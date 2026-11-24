import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayInput, getClayPill } from '../theme/colors';

const CATEGORIES = [
  'General',
  'Food',
  'Bills',
  'Travel',
  'Shopping',
  'Health',
  'Entertainment',
  'Education'
];

const CATEGORY_ICONS = {
  General: 'pricetag-outline',
  Food: 'restaurant-outline',
  Bills: 'receipt-outline',
  Travel: 'car-outline',
  Shopping: 'bag-handle-outline',
  Health: 'medkit-outline',
  Entertainment: 'film-outline',
  Education: 'book-outline'
};

const CATEGORY_COLORS = {
  General: '#64748B',
  Food: '#F59E0B',
  Bills: '#6366F1',
  Travel: '#14B8A6',
  Shopping: '#EC4899',
  Health: '#10B981',
  Entertainment: '#8B5CF6',
  Education: '#EAB308'
};

export default function AddEditExpenseModal({ visible, onClose, editingExpense }) {
  const { summary, addExpense, editExpense } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const isDark = themeMode === 'dark';
  const clayCard = getClayCard(themeMode);
  const clayInput = getClayInput(themeMode);
  const clayPill = getClayPill(themeMode);

  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('General');
  const [date, setDate] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setErrorText('');
      if (editingExpense) {
        setName(editingExpense.name || editingExpense.title || '');
        setAmountStr(String(editingExpense.amount || ''));
        setCategory(editingExpense.category || 'General');
        setDate(
          editingExpense.date
            ? editingExpense.date.split('T')[0]
            : new Date().toISOString().split('T')[0]
        );
      } else {
        setName('');
        setAmountStr('');
        setCategory('General');
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [visible, editingExpense]);

  const currentRemaining = summary.remaining_balance || 0;
  const numAmount = parseFloat(amountStr) || 0;
  const effectiveAvailable = editingExpense
    ? currentRemaining + (parseFloat(editingExpense.amount) || 0)
    : currentRemaining;

  const isExceeding = numAmount > 0 && numAmount > effectiveAvailable;
  const deficitAmount = numAmount - effectiveAvailable;

  const handleSubmit = async () => {
    setErrorText('');

    if (!name || name.trim().length === 0) {
      setErrorText('Expense name is required.');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorText('Expense amount must be a positive number greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await editExpense(editingExpense.id, {
          name: name.trim(),
          title: name.trim(),
          amount: numAmount,
          category,
          date
        });
      } else {
        await addExpense({
          name: name.trim(),
          title: name.trim(),
          amount: numAmount,
          category,
          date
        });
      }
      onClose();
    } catch (err) {
      setErrorText(err.message || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.modalCard, clayCard, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: editingExpense ? colors.primaryLight : colors.expenseLight,
                    borderColor: editingExpense ? colors.primary : colors.expense
                  }
                ]}
              >
                <Ionicons
                  name={editingExpense ? 'pencil-outline' : 'add-circle-outline'}
                  size={22}
                  color={editingExpense ? colors.primary : colors.expense}
                />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Record spending in single vertical flow
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              accessibilityLabel="Close Modal"
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Field 1: Name (Full Width Box) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EXPENSE NAME</Text>
              <View style={[styles.inputBox, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder="e.g. Grocery Shopping, Electricity Bill"
                  placeholderTextColor={colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                  autoFocus={!editingExpense}
                />
              </View>
            </View>

            {/* Field 2: Amount (Full Width Box - Identical Size) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                AMOUNT (PKR / RS)
              </Text>
              <View style={[styles.inputBox, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
                <Text style={[styles.currencyPrefix, { color: colors.expense }]}>Rs.</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, fontWeight: '700' }]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  value={amountStr}
                  onChangeText={setAmountStr}
                />
              </View>
            </View>

            {/* Over-budget Warning Notice */}
            {isExceeding && (
              <View
                style={[
                  styles.warningBox,
                  clayPill,
                  {
                    backgroundColor: colors.warningLight,
                    borderColor: colors.warning
                  }
                ]}
              >
                <Ionicons name="warning" size={18} color={colors.warning} />
                <View style={styles.warningContent}>
                  <Text style={[styles.warningTitle, { color: colors.warning }]}>
                    Expense Exceeds Remaining Balance
                  </Text>
                  <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Adding this puts your balance in deficit by Rs. {deficitAmount.toLocaleString()}
                    .
                  </Text>
                </View>
              </View>
            )}

            {/* Field 3: Category (Symmetric 4x2 Grid with EQUAL Box Sizes) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                SELECT CATEGORY
              </Text>
              <View style={styles.equalGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  const catColor = CATEGORY_COLORS[cat] || colors.primary;
                  const iconName = CATEGORY_ICONS[cat] || 'pricetag-outline';

                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                      style={[
                        styles.equalCategoryBox,
                        {
                          backgroundColor: isSelected ? catColor : colors.surfaceSubtle,
                          borderColor: isSelected ? catColor : isDark ? '#334155' : '#E2E8F0',
                          borderWidth: isSelected ? 1.5 : 1
                        }
                      ]}
                    >
                      <Ionicons
                        name={iconName}
                        size={16}
                        color={isSelected ? '#FFFFFF' : catColor}
                      />
                      <Text
                        style={[
                          styles.equalCategoryText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '800' : '600'
                          }
                        ]}
                        numberOfLines={1}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Field 4: Date (Full Width Box - Identical Size) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                DATE (YYYY-MM-DD)
              </Text>
              <View style={[styles.inputBox, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder="2026-11-17"
                  placeholderTextColor={colors.textTertiary}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            {errorText.length > 0 && (
              <View
                style={[
                  styles.errorBox,
                  clayPill,
                  {
                    backgroundColor: colors.expenseLight,
                    borderColor: colors.expense
                  }
                ]}
              >
                <Ionicons name="alert-circle-outline" size={15} color={colors.expense} />
                <Text style={[styles.errorText, { color: colors.expense }]}>{errorText}</Text>
              </View>
            )}

            {/* Action Buttons: Full Width Stacked One Below the Other */}
            <View style={styles.actionStack}>
              {/* Primary Action Button (100% Width) */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.primarySubmitBtn,
                  { backgroundColor: editingExpense ? colors.primary : colors.expense }
                ]}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={editingExpense ? 'checkmark-circle' : 'add-circle'}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.primarySubmitBtnText}>
                  {isSubmitting
                    ? 'Saving...'
                    : editingExpense
                      ? 'Update Expense Record'
                      : 'Add Expense Record'}
                </Text>
              </TouchableOpacity>

              {/* Secondary Cancel Button (100% Width) */}
              <TouchableOpacity
                onPress={onClose}
                style={[styles.secondaryCancelBtn, { backgroundColor: colors.surfaceSubtle }]}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={[styles.secondaryCancelBtnText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formScroll: {
    maxHeight: 460
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1
  },
  inputIcon: {
    marginRight: 10
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    padding: 0
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14
  },
  warningContent: {
    flex: 1
  },
  warningTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2
  },
  warningText: {
    fontSize: 11,
    lineHeight: 15
  },
  equalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between'
  },
  equalCategoryBox: {
    width: '23%',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  equalCategoryText: {
    fontSize: 9,
    textAlign: 'center'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14
  },
  errorText: {
    fontSize: 11,
    fontWeight: '700'
  },
  actionStack: {
    marginTop: 8,
    gap: 10,
    paddingBottom: 4
  },
  primarySubmitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  primarySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  secondaryCancelBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryCancelBtnText: {
    fontSize: 13,
    fontWeight: '700'
  }
});
