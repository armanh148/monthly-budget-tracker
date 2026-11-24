import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  TOKEN: '@budget_token',
  USER: '@budget_user',
  API_URL: '@budget_api_url',
  THEME: '@budget_theme',
  DEMO_MODE: '@budget_demo_mode'
};

// Default Backend URL based on platform
const CLOUD_BACKEND_URL = 'https://monthly-budget-tracker-iphone-app.vercel.app';

const getDefaultBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    const { hostname, port, origin } = window.location;
    // In production (Vercel / Render / custom domain) or when served directly from Express port 5000
    if ((hostname !== 'localhost' && hostname !== '127.0.0.1') || port === '5000') {
      return origin;
    }
    return CLOUD_BACKEND_URL;
  }
  // Standalone Android APK and native builds connect to the live cloud backend by default
  return CLOUD_BACKEND_URL;
};

class ApiService {
  constructor() {
    this.baseUrl = getDefaultBaseUrl();
    this.token = null;
    this.demoMode = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      const storedUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
      const isProdWeb =
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        window.location &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';
      if (storedUrl && !(isProdWeb && storedUrl.includes('localhost'))) {
        this.baseUrl = storedUrl;
      }

      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedToken) this.token = storedToken;

      const storedDemo = await AsyncStorage.getItem(STORAGE_KEYS.DEMO_MODE);
      if (storedDemo !== null) this.demoMode = JSON.parse(storedDemo);

      this.initialized = true;
    } catch (e) {
      console.warn('Error initializing ApiService:', e);
    }
  }

  async setBaseUrl(url) {
    this.baseUrl = url.trim().replace(/\/+$/, '');
    await AsyncStorage.setItem(STORAGE_KEYS.API_URL, this.baseUrl);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async setToken(token) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  async setDemoMode(val) {
    this.demoMode = Boolean(val);
    await AsyncStorage.setItem(STORAGE_KEYS.DEMO_MODE, JSON.stringify(this.demoMode));
  }

  isDemoMode() {
    return this.demoMode;
  }

  async request(path, options = {}) {
    await this.init();

    if (this.demoMode) {
      return this.handleDemoRequest(path, options);
    }

    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.error || `HTTP ${response.status}: ${response.statusText}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(
          'Connection timed out. Please verify your backend server is running and accessible.'
        );
      }
      if (
        error.message.includes('Network request failed') ||
        error.message.includes('Failed to fetch')
      ) {
        const msg = `Unable to reach backend at ${this.baseUrl}. Check your internet connection, verify the server URL in Settings (gear icon), or switch to Offline Demo Mode.`;
        const err = new Error(msg);
        err.isNetworkError = true;
        throw err;
      }
      throw error;
    }
  }

  // Built-in Demo Engine for instant mobile evaluation
  async handleDemoRequest(path, options) {
    const method = options.method || 'GET';
    const body = options.body || {};

    let demoData = await AsyncStorage.getItem('@demo_db_store');
    if (!demoData) {
      demoData = {
        incomes: [
          {
            id: 1,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            amount: 100000
          }
        ],
        expenses: [
          {
            id: 1,
            name: 'Electricity Bill',
            amount: 8000,
            category: 'Bills',
            date: new Date().toISOString().split('T')[0]
          },
          {
            id: 2,
            name: 'Monthly Groceries',
            amount: 15000,
            category: 'Food',
            date: new Date().toISOString().split('T')[0]
          },
          {
            id: 3,
            name: 'Car Fuel',
            amount: 7000,
            category: 'Travel',
            date: new Date().toISOString().split('T')[0]
          }
        ],
        nextExpenseId: 4
      };
      await AsyncStorage.setItem('@demo_db_store', JSON.stringify(demoData));
    } else {
      demoData = JSON.parse(demoData);
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    if (path.startsWith('/api/auth/login') || path.startsWith('/api/auth/register')) {
      return {
        success: true,
        token: 'demo-jwt-token-active',
        user: {
          id: 'demo-user-id',
          name: body.name || 'arman',
          email: body.email || 'arman@budgettracker.com'
        }
      };
    }

    if (path.startsWith('/api/income') && method === 'GET') {
      const urlParams = new URLSearchParams(path.split('?')[1] || '');
      const month = parseInt(urlParams.get('month') || currentMonth, 10);
      const year = parseInt(urlParams.get('year') || currentYear, 10);

      const inc = demoData.incomes.find((i) => i.month === month && i.year === year);
      const totalIncome = inc ? inc.amount : 0;
      const totalExpense = demoData.expenses.reduce((s, e) => s + Number(e.amount), 0);
      const remainingBalance = totalIncome - totalExpense;
      const burnRate = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

      return {
        success: true,
        data: {
          income: inc || null,
          summary: {
            month,
            year,
            total_income: totalIncome,
            total_expense: totalExpense,
            remaining_balance: remainingBalance,
            burn_rate_percent: Math.round(burnRate * 10) / 10,
            is_budget_alert: burnRate >= 80,
            is_over_budget: remainingBalance < 0,
            comparison_with_prev_month: {
              prev_month: month === 1 ? 12 : month - 1,
              prev_year: month === 1 ? year - 1 : year,
              prev_income: 90000,
              prev_expense: 26000,
              expense_change_percent: 15.4
            }
          }
        }
      };
    }

    if (path.startsWith('/api/income') && method === 'POST') {
      const { month, year, amount } = body;
      const inc = demoData.incomes.find((i) => i.month === month && i.year === year);
      if (inc) {
        inc.amount = Number(amount);
      } else {
        demoData.incomes.push({ id: Date.now(), month, year, amount: Number(amount) });
      }
      await AsyncStorage.setItem('@demo_db_store', JSON.stringify(demoData));

      const totalExpense = demoData.expenses.reduce((s, e) => s + Number(e.amount), 0);
      return {
        success: true,
        message: 'Income saved successfully',
        data: {
          income: { month, year, amount: Number(amount) },
          summary: {
            month,
            year,
            total_income: Number(amount),
            total_expense: totalExpense,
            remaining_balance: Number(amount) - totalExpense,
            burn_rate_percent: Math.round((totalExpense / Number(amount)) * 1000) / 10,
            is_budget_alert: totalExpense / Number(amount) >= 0.8,
            is_over_budget: Number(amount) - totalExpense < 0
          }
        }
      };
    }

    if (path.startsWith('/api/expenses') && method === 'GET') {
      const categoryBreakdown = {};
      let total = 0;
      demoData.expenses.forEach((e) => {
        total += Number(e.amount);
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + Number(e.amount);
      });

      return {
        success: true,
        count: demoData.expenses.length,
        total_expense: total,
        category_breakdown: categoryBreakdown,
        expenses: demoData.expenses
      };
    }

    if (path.startsWith('/api/expenses') && method === 'POST') {
      const newExp = {
        id: demoData.nextExpenseId++,
        name: body.name,
        amount: Number(body.amount),
        category: body.category || 'General',
        date: body.date || new Date().toISOString().split('T')[0]
      };
      demoData.expenses.unshift(newExp);
      await AsyncStorage.setItem('@demo_db_store', JSON.stringify(demoData));

      const inc = demoData.incomes.find(
        (i) => i.month === (body.month || currentMonth) && i.year === (body.year || currentYear)
      );
      const totalIncome = inc ? inc.amount : 0;
      const totalExpense = demoData.expenses.reduce((s, e) => s + Number(e.amount), 0);
      const remainingBalance = totalIncome - totalExpense;

      let warning = null;
      if (Number(body.amount) > remainingBalance + Number(body.amount)) {
        warning = {
          exceeded: true,
          message: `Expense exceeds remaining balance. Trainee policy: Allowed with warning.`
        };
      }

      return {
        success: true,
        message: 'Expense added successfully',
        expense: newExp,
        warning,
        summary: {
          total_income: totalIncome,
          total_expense: totalExpense,
          remaining_balance: remainingBalance,
          burn_rate_percent:
            totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 1000) / 10 : 100,
          is_budget_alert: totalIncome > 0 ? totalExpense / totalIncome >= 0.8 : true,
          is_over_budget: remainingBalance < 0
        }
      };
    }

    if (path.match(/\/api\/expenses\/\d+/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop(), 10);
      const idx = demoData.expenses.findIndex((e) => e.id === id);
      if (idx !== -1) {
        demoData.expenses[idx] = {
          ...demoData.expenses[idx],
          ...body,
          amount: Number(body.amount || demoData.expenses[idx].amount)
        };
        await AsyncStorage.setItem('@demo_db_store', JSON.stringify(demoData));
      }
      return {
        success: true,
        message: 'Expense updated successfully',
        expense: demoData.expenses[idx]
      };
    }

    if (path.match(/\/api\/expenses\/\d+/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop(), 10);
      demoData.expenses = demoData.expenses.filter((e) => e.id !== id);
      await AsyncStorage.setItem('@demo_db_store', JSON.stringify(demoData));
      return { success: true, message: 'Expense deleted successfully' };
    }

    return { success: true };
  }
}

export const api = new ApiService();
export { STORAGE_KEYS };
