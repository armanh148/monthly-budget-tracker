import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayInput } from '../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORIES = [
  { id: 'Food', label: 'Food', icon: 'fast-food', color: '#E11D48', bg: '#FFF1F2' },
  { id: 'Transport', label: 'Transport', icon: 'car-sport', color: '#0284C7', bg: '#F0F9FF' },
  { id: 'Bills', label: 'Bills', icon: 'flash', color: '#D97706', bg: '#FFFBEB' },
  { id: 'Shopping', label: 'Shopping', icon: 'bag-handle', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'Entertainment', label: 'Fun', icon: 'game-controller', color: '#EC4899', bg: '#FDF2F8' },
  { id: 'Health', label: 'Health', icon: 'medkit', color: '#059669', bg: '#ECFDF5' },
  { id: 'General', label: 'General', icon: 'pricetag', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'Other', label: 'Other', icon: 'cube', color: '#64748B', bg: '#F1F5F9' }
];

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-US')}`;
};

export default function ExpenseAccordion({ isExpanded, onToggle, onEditExpense }) {
  const { summary, expenses, addExpense, deleteExpense, selectedMonth, selectedYear } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const isDark = themeMode === 'dark';
  const clayCard = getClayCard(themeMode);
  const clayInput = getClayInput(themeMode);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [isAdding, setIsAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web'
    }).start();
  }, [isExpanded, rotateAnim]);

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (onToggle) onToggle();
  };

  const handleAddExpense = async () => {
    setFeedbackMsg('');
    if (!title.trim()) {
      setFeedbackMsg('Please enter an expense title.');
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setFeedbackMsg('Please enter a valid expense amount greater than 0.');
      return;
    }

    setIsAdding(true);
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      let expenseDate;

      if (selectedYear === currentYear && selectedMonth === currentMonth) {
        expenseDate = today.toISOString().split('T')[0];
      } else {
        const paddedMonth = String(selectedMonth).padStart(2, '0');
        expenseDate = `${selectedYear}-${paddedMonth}-01`;
      }

      await addExpense({
        name: title.trim(),
        title: title.trim(),
        amount: num,
        category,
        date: expenseDate
      });

      setTitle('');
      setAmount('');
      setCategory('Food');
      setFeedbackMsg('✓ Expense added successfully!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      setFeedbackMsg(err.message || 'Failed to add expense.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteExpense = async (id, itemTitle) => {
    const performDelete = async () => {
      setDeletingId(id);
      try {
        await deleteExpense(id);
      } catch (err) {
        Alert.alert('Error', err.message || 'Could not delete expense.');
      } finally {
        setDeletingId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${itemTitle}"?`)) {
        performDelete();
      }
    } else {
      Alert.alert('Delete Expense', `Are you sure you want to delete "${itemTitle}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete }
      ]);
    }
  };

  const totalExpense = summary.total_expense || 0;
  const burnRate = summary.burn_rate_percent || 0;
  const isOverBudget =
    summary.remaining_balance !== undefined ? summary.remaining_balance < 0 : false;
  const isBudgetAlert = summary.is_budget_alert || burnRate >= 80;

  return (
    <View style={[styles.container, clayCard, isExpanded && { borderBottomColor: colors.expense }]}>
      {/* Accordion Header (Clickable) - Exact 78px Puffy Clay Height */}
      <TouchableOpacity
        style={styles.headerTouch}
        onPress={handleToggle}
        activeOpacity={0.82}
        accessibilityLabel="Toggle Monthly Expense Accordion"
      >
        <View style={styles.headerLeft}>
          {/* Puffy 3D Solid Coral Clay Icon Square (Mockup Style) */}
          <View
            style={[
              styles.iconCoin,
              {
                backgroundColor: colors.expenseSurface,
                borderTopColor: colors.expenseHighlight,
                borderLeftColor: colors.expenseHighlight,
                borderBottomColor: colors.expenseBorder,
                shadowColor: colors.expenseBorder
              }
            ]}
          >
            <Ionicons name="receipt" size={23} color="#FFFFFF" />
          </View>

          <View style={styles.headerTextGroup}>
            <Text style={[styles.accordionTitle, { color: colors.text }]}>Monthly Expenses</Text>
            <Text
              style={[styles.accordionSubtitle, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {expenses.length} {expenses.length === 1 ? 'item' : 'items'} recorded
            </Text>
          </View>
        </View>

        {/* Header Right: Amount & Animated Chevron */}
        <View style={styles.headerRight}>
          <Text style={[styles.amountText, { color: colors.expense }]}>
            {formatCurrency(totalExpense)}
          </Text>

          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Accordion Body (Expanded View) */}
      {isExpanded && (
        <View style={[styles.expandedContent, { borderTopColor: colors.borderSubtle }]}>
          {/* Budget Consumption Progress Bar */}
          <View style={[styles.budgetStatusBar, { backgroundColor: colors.surfaceSubtle }]}>
            <View style={styles.statusBarHeader}>
              <Text style={[styles.statusBarTitle, { color: colors.textSecondary }]}>
                BUDGET CONSUMED
              </Text>
              <Text
                style={[
                  styles.statusBarValue,
                  {
                    color: isOverBudget
                      ? colors.expense
                      : isBudgetAlert
                        ? colors.warning
                        : colors.income
                  }
                ]}
              >
                {burnRate}%{' '}
                {isOverBudget ? '(Over Budget)' : isBudgetAlert ? '(Caution 80%)' : '(Safe)'}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(burnRate, 100)}%`,
                    backgroundColor: isOverBudget
                      ? colors.expense
                      : isBudgetAlert
                        ? colors.warning
                        : colors.primary
                  }
                ]}
              />
            </View>
          </View>

          {/* Tab Switcher: Add Form vs Expense List */}
          <View style={[styles.tabSwitcher, { backgroundColor: colors.surfaceSubtle }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                showForm && [styles.tabBtnActive, { backgroundColor: colors.surface }]
              ]}
              onPress={() => setShowForm(true)}
            >
              <Ionicons
                name="add-circle"
                size={16}
                color={showForm ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: showForm ? colors.primary : colors.textSecondary,
                    fontWeight: showForm ? '800' : '600'
                  }
                ]}
              >
                + Add Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                !showForm && [styles.tabBtnActive, { backgroundColor: colors.surface }]
              ]}
              onPress={() => setShowForm(false)}
            >
              <Ionicons
                name="list"
                size={16}
                color={!showForm ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: !showForm ? colors.primary : colors.textSecondary,
                    fontWeight: !showForm ? '800' : '600'
                  }
                ]}
              >
                View Items ({expenses.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Mode: Inline Add Expense */}
          {showForm ? (
            <View style={styles.formSection}>
              {/* Expense Title Input */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                EXPENSE TITLE / DESCRIPTION
              </Text>
              <View style={[styles.inputRow, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons name="pricetag-outline" size={18} color={colors.textTertiary} />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder="e.g. Starbucks, Groceries, Electricity"
                  placeholderTextColor={colors.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Expense Amount Input */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 10 }]}>
                AMOUNT (PKR)
              </Text>
              <View style={[styles.inputRow, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
                <Text style={[styles.currencyPrefix, { color: colors.expense }]}>Rs.</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, fontWeight: '700' }]}
                  keyboardType="numeric"
                  placeholder="1200"
                  placeholderTextColor={colors.textTertiary}
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Category Pills: Equal 4x2 Grid */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 10 }]}>
                SELECT CATEGORY
              </Text>
              <View style={styles.categoryWrap}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected ? cat.color : colors.surfaceSubtle,
                          borderColor: isSelected ? cat.color : isDark ? '#334155' : '#E2E8F0',
                          borderWidth: isSelected ? 1.5 : 1
                        }
                      ]}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={15}
                        color={isSelected ? '#FFFFFF' : cat.color}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '800' : '600'
                          }
                        ]}
                        numberOfLines={1}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Feedback Message */}
              {feedbackMsg.length > 0 && (
                <View
                  style={[
                    styles.feedbackBox,
                    {
                      backgroundColor: feedbackMsg.includes('✓')
                        ? colors.incomeLight
                        : colors.expenseLight,
                      borderColor: feedbackMsg.includes('✓')
                        ? colors.incomeBorder
                        : colors.expenseBorder
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.feedbackText,
                      { color: feedbackMsg.includes('✓') ? colors.income : colors.expense }
                    ]}
                  >
                    {feedbackMsg}
                  </Text>
                </View>
              )}

              {/* Action Button: Save Expense */}
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.expense }]}
                onPress={handleAddExpense}
                disabled={isAdding}
                activeOpacity={0.85}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>Add Expense Record</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* List Mode: Inline Expense Items */
            <View style={styles.itemsListContainer}>
              {expenses.length === 0 ? (
                <View style={styles.emptyItemsBox}>
                  <Ionicons name="receipt-outline" size={36} color={colors.textTertiary} />
                  <Text style={[styles.emptyItemsTitle, { color: colors.textSecondary }]}>
                    No expenses recorded yet
                  </Text>
                  <Text style={[styles.emptyItemsSub, { color: colors.textTertiary }]}>
                    Tap "+ Add Expense" above to record your first spending.
                  </Text>
                </View>
              ) : (
                expenses.map((item) => {
                  const catMatch = CATEGORIES.find(
                    (c) => c.id.toLowerCase() === (item.category || '').toLowerCase()
                  );
                  const catColor = catMatch ? catMatch.color : colors.primary;
                  const catIcon = catMatch ? catMatch.icon : 'pricetag';
                  const isDeleting = deletingId === item.id;

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.expenseItemRow,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border
                        }
                      ]}
                    >
                      <View style={[styles.itemIconBox, { backgroundColor: catColor + '18' }]}>
                        <Ionicons name={catIcon} size={18} color={catColor} />
                      </View>

                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
                          {item.name || item.title || 'Expense'}
                        </Text>
                        <Text style={[styles.itemMeta, { color: colors.textTertiary }]}>
                          {item.category} • {item.date ? item.date.split('T')[0] : 'Today'}
                        </Text>
                      </View>

                      <View style={styles.itemRight}>
                        <Text style={[styles.itemAmount, { color: colors.expense }]}>
                          -{formatCurrency(item.amount)}
                        </Text>

                        <View style={styles.itemActions}>
                          <TouchableOpacity
                            onPress={() => onEditExpense && onEditExpense(item)}
                            style={styles.actionBtn}
                            accessibilityLabel={`Edit ${item.name}`}
                          >
                            <Ionicons name="pencil-outline" size={15} color={colors.primary} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDeleteExpense(item.id, item.name || item.title)}
                            style={styles.actionBtn}
                            disabled={isDeleting}
                            accessibilityLabel={`Delete ${item.name}`}
                          >
                            {isDeleting ? (
                              <ActivityIndicator size="small" color={colors.expense} />
                            ) : (
                              <Ionicons name="trash-outline" size={15} color={colors.expense} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.15)'
  },
  headerTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 74
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14
  },
  iconCoin: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  headerTextGroup: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800'
  },
  accordionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.4
  },
  expandedContent: {
    borderTopWidth: 1,
    padding: 16
  },
  budgetStatusBar: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 14
  },
  statusBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  statusBarTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  statusBarValue: {
    fontSize: 11,
    fontWeight: '700'
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  tabBtnText: {
    fontSize: 12
  },
  formSection: {
    marginTop: 2
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '800'
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    padding: 0
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 14
  },
  categoryChip: {
    width: '23%',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  categoryChipText: {
    fontSize: 9,
    textAlign: 'center'
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  saveBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  itemsListContainer: {
    marginTop: 4
  },
  emptyItemsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 6
  },
  emptyItemsTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  emptyItemsSub: {
    fontSize: 12
  },
  expenseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12
  },
  itemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  itemMeta: {
    fontSize: 11,
    marginTop: 2
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '800'
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionBtn: {
    padding: 4
  }
});
