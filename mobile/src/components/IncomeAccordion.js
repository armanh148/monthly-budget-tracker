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
  ActivityIndicator
} from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayInput } from '../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-US')}`;
};

export default function IncomeAccordion({ isExpanded, onToggle }) {
  const { summary, incomeData, updateIncome, selectedMonth, selectedYear } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);
  const clayInput = getClayInput(themeMode);

  const [inputAmount, setInputAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web'
    }).start();
  }, [isExpanded, rotateAnim]);

  useEffect(() => {
    if (incomeData?.amount) {
      setInputAmount(String(incomeData.amount));
    } else {
      setInputAmount('');
    }
    setFeedbackMsg('');
  }, [incomeData, selectedMonth, selectedYear]);

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (onToggle) onToggle();
  };

  const handleSaveIncome = async () => {
    setFeedbackMsg('');
    const num = parseFloat(inputAmount);

    if (isNaN(num) || num < 0) {
      setFeedbackMsg('Please enter a valid non-negative income amount.');
      return;
    }

    setIsSaving(true);
    try {
      await updateIncome(num);
      setFeedbackMsg('✓ Income saved! Balance updated dynamically.');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      setFeedbackMsg(err.message || 'Failed to save income.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreset = (val) => {
    setInputAmount(String(val));
  };

  const totalIncome = summary.total_income || 0;

  return (
    <View style={[styles.container, clayCard, isExpanded && { borderBottomColor: colors.income }]}>
      {/* Accordion Header (Clickable) - Standard 78px Puffy Clay Height */}
      <TouchableOpacity
        style={styles.headerTouch}
        onPress={handleToggle}
        activeOpacity={0.82}
        accessibilityLabel="Toggle Monthly Income Accordion"
      >
        <View style={styles.headerLeft}>
          {/* Puffy 3D Solid Mint Clay Icon Square (Mockup Style) */}
          <View
            style={[
              styles.iconCoin,
              {
                backgroundColor: colors.incomeSurface,
                borderTopColor: colors.incomeHighlight,
                borderLeftColor: colors.incomeHighlight,
                borderBottomColor: colors.incomeBorder,
                shadowColor: colors.incomeBorder
              }
            ]}
          >
            <Ionicons name="arrow-down-circle" size={24} color="#FFFFFF" />
          </View>

          <View style={styles.headerTextGroup}>
            <Text style={[styles.accordionTitle, { color: colors.text }]}>Monthly Income</Text>
            <Text
              style={[styles.accordionSubtitle, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </Text>
          </View>
        </View>

        {/* Header Right: Amount & Animated Chevron */}
        <View style={styles.headerRight}>
          <Text style={[styles.amountText, { color: colors.income }]}>
            {formatCurrency(totalIncome)}
          </Text>

          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Accordion Body (Expanded View) */}
      {isExpanded && (
        <View style={[styles.expandedContent, { borderTopColor: colors.borderSubtle }]}>
          {/* Explanatory Policy Banner */}
          <View
            style={[
              styles.policyNotice,
              { backgroundColor: colors.incomeLight, borderColor: colors.incomeBorder }
            ]}
          >
            <Ionicons name="information-circle" size={16} color={colors.income} />
            <Text style={[styles.policyNoticeText, { color: colors.incomeDark }]}>
              Income is dynamic. Changing your income automatically recalculates your remaining
              balance for {MONTH_NAMES[selectedMonth - 1]}.
            </Text>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsBar, { backgroundColor: colors.surfaceSubtle }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>BASE INCOME</Text>
              <Text style={[styles.metricVal, { color: colors.income }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>TOTAL SPENT</Text>
              <Text style={[styles.metricVal, { color: colors.expense }]}>
                {formatCurrency(summary.total_expense || 0)}
              </Text>
            </View>
          </View>

          {/* Inline Set/Update Income Form */}
          <View style={styles.formSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              ENTER OR UPDATE INCOME AMOUNT (PKR)
            </Text>

            <View style={[styles.inputRow, clayInput, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.currencyPrefix, { color: colors.income }]}>Rs.</Text>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                keyboardType="numeric"
                placeholder="100000"
                placeholderTextColor={colors.textTertiary}
                value={inputAmount}
                onChangeText={setInputAmount}
              />
            </View>

            {/* Quick Presets: 4 Equal Boxes */}
            <View style={styles.presetRow}>
              {[50000, 100000, 150000, 200000].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor:
                        inputAmount === String(preset) ? colors.income : colors.surfaceSubtle,
                      borderColor: inputAmount === String(preset) ? colors.income : colors.border
                    }
                  ]}
                  onPress={() => handlePreset(preset)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color: inputAmount === String(preset) ? '#FFFFFF' : colors.textSecondary,
                        fontWeight: inputAmount === String(preset) ? '800' : '600'
                      }
                    ]}
                  >
                    Rs. {preset / 1000}k
                  </Text>
                </TouchableOpacity>
              ))}
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

            {/* Full Width Submit Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.income }]}
              onPress={handleSaveIncome}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.saveBtnContent}>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Monthly Income</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
    borderColor: 'rgba(37, 99, 235, 0.15)'
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
  policyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12
  },
  policyNoticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500'
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14
  },
  metricItem: {
    flex: 1,
    alignItems: 'center'
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(148, 163, 184, 0.25)'
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800'
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
    marginBottom: 10
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    padding: 0
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 12
  },
  presetChip: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1
  },
  presetText: {
    fontSize: 11
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12
  },
  feedbackText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center'
  },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
