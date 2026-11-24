# Monthly Budget Tracker — Android Mobile Application 📱

[![EAS Build](https://img.shields.io/badge/EAS%20Build-Passing-brightgreen.svg)](https://expo.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-blue.svg)](https://monthly-budget-tracker-iphone-app.vercel.app)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-39D353.svg)](https://neon.tech)
[![Platform](https://img.shields.io/badge/Platform-Android%20(APK)-orange.svg)](https://drive.google.com/file/d/1_kmtfhxsqMRdWVqdfz0boLuHAwCJt_Ga/view?usp=drive_link)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

A complete full-stack mobile application that allows users to record, track, and manage their monthly income and expenses. As soon as an expense is saved, edited, or deleted, the remaining balance recalculates in real time. Designed with a luxury tactile physical metal card UI, JWT multi-user authentication, cloud-hosted Node.js backend, and Neon Serverless PostgreSQL.

---

## 🎯 Quick Links & Deliverables

| Deliverable | Details / Link |
| :--- | :--- |
| **Direct APK Download** | [Expo Direct APK Download](https://expo.dev/artifacts/eas/GMaj81-ziK_8IXRdHqq2GToIl8kPoC7furNIrmWJJ1w.apk) |
| **EAS Cloud Build ID** | `0e6309fc-5af1-49e7-8989-e3ed77a55680` ([EAS Build Dashboard](https://expo.dev/accounts/armannaqvi/projects/monthly-budget-tracker/builds/0e6309fc-5af1-49e7-8989-e3ed77a55680)) |
| **Live Backend API** | `https://monthly-budget-tracker-iphone-app.vercel.app` |
| **Health Check Endpoint** | `https://monthly-budget-tracker-iphone-app.vercel.app/health` |
| **Database** | Neon Cloud Serverless PostgreSQL (`sslmode=require`) |
| **GitHub Repository** | `https://github.com/armanh148/monthly-budget-tracker.git` |
| **Demo Login Credentials** | **User**: `arman` \| **Password**: `arman05` |

---

## 📸 Screenshots Gallery

| 1. Authentication (Login / Register) | 2. Home Dashboard & Summary Cards | 3. Add / Edit Expense |
| :---: | :---: | :---: |
| ![Auth Screen](./screenshots/ui_new_auth.png) | ![Home Dashboard](./screenshots/ui_new_home.png) | ![Add Expense](./screenshots/ui_new_add_expense.png) |

| 4. AI Financial Coach & Quick Parse | 5. Settings, Security & Live Server Switcher |
| :---: | :---: |
| ![AI Coach](./screenshots/ui_new_ai_coach.png) | ![Settings Screen](./screenshots/ui_new_settings.png) |

---

## 📋 Requirements Compliance Matrix

### 1. Functional Requirements (F1 – F10)

| ID | Feature | Priority | Implementation Details | Status |
| :--- | :--- | :--- | :--- | :---: |
| **F1** | **Register / Login** | **Must** | Secure authentication with bcrypt password hashing (10 salt rounds) and signed JWT tokens with 7-day expiration. | ✅ **DONE** |
| **F2** | **Set Monthly Income** | **Must** | Sets or updates user income for any month/year (`POST /api/income`). | ✅ **DONE** |
| **F3** | **Add Expense** | **Must** | Records expense with Name, Amount, Date, and Category (`POST /api/expenses`). | ✅ **DONE** |
| **F4** | **Auto Deduction** | **Must** | Real-time dynamic calculation (`Remaining Balance = Income - SUM(Expenses)`). As soon as an expense is added, balance auto-updates. | ✅ **DONE** |
| **F5** | **Expense Table / List** | **Must** | Itemized table of all expenses for the selected month displaying Name, Amount, Date, and Category pill. | ✅ **DONE** |
| **F6** | **Edit Expense** | **Must** | Modifying expense name or amount recalculates total expense and balance instantly (`PUT /api/expenses/:id`). | ✅ **DONE** |
| **F7** | **Delete Expense** | **Must** | Deleting an expense removes it and restores the amount back to the remaining balance (`DELETE /api/expenses/:id`). | ✅ **DONE** |
| **F8** | **Summary Cards** | **Must** | Home screen presents 3 summary metrics: **Total Income**, **Total Expense**, and **Remaining Balance**. | ✅ **DONE** |
| **F9** | **Month Selector** | **Should** | Interactive month/year switcher capsule allowing seamless historical lookup and data filtering. | ✅ **DONE** |
| **F10**| **Logout** | **Should** | Clears client JWT token and user session from storage and redirects to the login screen. | ✅ **DONE** |

---

## 🗄️ Database Design (Neon PostgreSQL)

The database runs on **Neon Serverless PostgreSQL** with `sslmode=require`.

### Database Schema

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incomes Table
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL CHECK (year >= 2000),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, month, year)
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  income_id INT REFERENCES incomes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) DEFAULT 'General',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### ⚡ Critical Design Principle: Dynamic Balance
> [!IMPORTANT]
> The remaining balance is **NEVER** stored as a static column in the database. Instead, it is computed on every request:
> $$\text{Remaining Balance} = \text{Monthly Income} - \sum \text{Expenses}$$
> This guarantees zero data drift or mismatch after edits, deletions, or bulk updates.

---

## 🌐 API Specification

All endpoints under `/api/*` (except auth) require a Bearer JWT Token in the `Authorization` header: `Authorization: Bearer <TOKEN>`.

| Method | Endpoint | Description | Auth Required | Request Body | Sample Response |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No | `{"name","email","password"}` | `{"token","user":{...}}` |
| `POST` | `/api/auth/login` | Log in user | No | `{"email","password"}` | `{"token","user":{...}}` |
| `POST` | `/api/income` | Set or update monthly income | Yes | `{"amount":100000,"month":11,"year":2026}` | `{"message","income":{...}}` |
| `GET` | `/api/income?month=&year=` | Get monthly summary & balance | Yes | Query params: `month`, `year` | `{"total_income":100000,"total_expense":8000,"remaining_balance":92000}` |
| `POST` | `/api/expenses` | Add new expense | Yes | `{"name":"Electricity","amount":8000,"month":11,"year":2026}` | `{"message","expense":{...},"warning":null}` |
| `GET` | `/api/expenses?month=&year=` | List monthly expenses | Yes | Query params: `month`, `year` | `[{"id":1,"name":"Electricity","amount":"8000.00","date":"2026-11-23"}]` |
| `PUT` | `/api/expenses/:id` | Edit expense | Yes | `{"name":"Electricity","amount":10000}` | `{"message","expense":{...}}` |
| `DELETE`| `/api/expenses/:id` | Delete expense | Yes | None | `{"message":"Expense deleted successfully"}` |

---

## 🛡️ Validation Rules & Business Policies

| Rule | Implementation & Behavior |
| :--- | :--- |
| **Amount Check** | Amounts $\le 0$ or non-numeric strings are rejected with HTTP 400 (`validationMiddleware.js`). |
| **Name Check** | Expense name cannot be empty or whitespace only. |
| **Duplicate Income** | Setting income for an existing month/year executes an SQL upsert (`ON CONFLICT (user_id, month, year) DO UPDATE`), preventing duplicates. |
| **Authorization** | Strict row-level isolation via JWT payload `req.user.id`. Users cannot query or mutate data belonging to other accounts. |
| **Error Handling** | User-friendly alert banners with zero app crashes. Full offline fallback mode if network is unavailable. |

### 📌 Policy Decision: Balance Overdraft Warning
> [!NOTE]
> **Balance Warning Decision (Requirement Section 7)**:
> When an expense exceeds the current remaining balance, the system **allows the transaction** while displaying an amber **Over-Budget Warning Banner** (`is_over_budget: true`).
> 
> **Rationale**: Real-world financial tracking must reflect actual expenditures even when bank accounts are overdrawn or paid via credit cards. Blocking transactions would force users to omit real expenses, leading to inaccurate financial records.

---

## 🌟 Bonus Features (+10 Extra Marks)

1. **Expense Categories & Visual Breakdown**:
   - 8 custom categories (Food, Bills, Travel, Shopping, Health, Entertainment, Education, General) with color-coded badges and category breakdown progress bars.
2. **80% Budget Alert**:
   - Visual alert banner triggers automatically when spending exceeds 80% of total income.
3. **Previous Month Comparison**:
   - Interactive comparison card displaying spending percent change $(\pm\%)$ relative to the previous month.
4. **Export to PDF & CSV**:
   - Built-in financial statement export modal generating branded PDF reports with itemized tables.
5. **Sunset Light & Dark Mode**:
   - Custom palette tailored to soft light mode (`#FEFFFE`, `#E7A8A1`, `#E28D93`) and dark mode.
6. **Groq AI Financial Coach**:
   - Integrated AI agent that parses natural language expense entries (e.g. *"Paid 1500 for groceries today"*) and provides personalized budgeting advice.

---

## 🛠️ Local Setup & Execution

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli eas-cli`)
- Android Phone with **Expo Go** or an Android Emulator

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Create .env file with:
# PORT=5000
# DATABASE_URL=postgresql://neondb_owner:npg_x...@ep-tight-sound-a5oim66b.us-east-2.aws.neon.tech/neondb?sslmode=require
# JWT_SECRET=your_jwt_secret_key

# Run database migrations
npm run migrate

# Start backend server
npm run dev

# Run automated test suite (22 unit & integration tests)
npm test
```

### 3. Mobile App Setup
```bash
cd mobile
npm install

# Start Metro bundler
npx expo start
```
Scan the QR code in your terminal using **Expo Go** on Android.

---

## 📱 Generating Standalone Android APK (EAS Build)

The project includes an `eas.json` configuration for generating standalone installable `.apk` packages:

```bash
cd mobile
eas build --platform android --profile preview
```

The APK can be installed directly onto any Android device without Google Play Store requirements.

---

## 🧪 Test Suite Results

The backend includes a comprehensive automated test suite verifying all OJT requirements:

```text
✔ Health check endpoint (144ms)
✔ F1 - Register and Login (Authentication & JWT)
  ✔ Registers a new user successfully
  ✔ Rejects registration with duplicate email
  ✔ Rejects invalid registration inputs
  ✔ Logs in user with valid credentials
  ✔ Rejects login with incorrect password
✔ F2 & F8 - Monthly Income & Balance Calculations
  ✔ Sets monthly income (e.g. Rs. 100,000 for month 11/2026)
  ✔ Duplicate income updates instead of creating duplicate
  ✔ GET /api/income returns summary cards info
✔ F3, F4, F5, F6, F7 - Expense CRUD and Auto Deduction
  ✔ F3 & F4 - Add Expense and Auto Deduction (100,000 - 8,000 = 92,000)
  ✔ F5 - Lists expenses for the month
  ✔ F6 - Edit Expense recalculates balance correctly (8,000 -> 10,000 => 90,000)
  ✔ F7 - Delete Expense restores amount back to balance (balance back to 100,000)
✔ Validation Rules & Warnings
  ✔ Rejects expense with negative amount
  ✔ Rejects expense with zero amount
  ✔ Rejects expense with empty name
  ✔ Generates balance warning when expense exceeds remaining balance
  ✔ Protected endpoints reject unauthenticated requests

ℹ tests 22 passed | 0 failed | 100% pass rate
```

---

## ⚠️ Known Issues & Troubleshooting

- **Android Cleartext HTTP Traffic**:
  - Android 9+ blocks unencrypted `http://` traffic to raw IP addresses by default.
  - **Solution**: The app is pre-configured to connect to our secure HTTPS cloud endpoint (`https://monthly-budget-tracker-iphone-app.vercel.app`). For local network development, use the built-in **Server Config modal** (gear icon in the app) to switch between Cloud, Local Emulator (`10.0.2.2:5000`), or Offline Demo Mode.
