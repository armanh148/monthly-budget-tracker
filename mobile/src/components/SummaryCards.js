import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-US')}`;
};

export default function SummaryCards({
  onOpenSetIncome,
  onOpenAddExpense,
  onToggleCategoryBreakdown,
  onOpenExport
}) {
  const { summary } = useBudget();
  const { user, themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const isDark = themeMode === 'dark';

  const totalIncome = summary.total_income || 0;
  const totalExpense = summary.total_expense || 0;
  const remainingBalance =
    summary.remaining_balance !== undefined
      ? summary.remaining_balance
      : totalIncome - totalExpense;
  const burnRate = Math.min(100, Math.max(0, summary.burn_rate_percent || 0));
  const isOverBudget = remainingBalance < 0;

  const cardBg = isDark ? '#080E1E' : '#0A192F';
  const cardBorder = isOverBudget ? 'rgba(220, 38, 38, 0.7)' : 'rgba(59, 130, 246, 0.35)';

  return (
    <View style={styles.wrapper}>
      {/* Background Top Curved Wash */}
      <View style={[styles.curvedBackdrop, { backgroundColor: colors.topBackdrop }]} />

      <View style={styles.container}>
        {/* 1. Custom Cyber Executive Portfolio Card */}
        <View style={[styles.portfolioCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {/* Subtle Ambient Background Glows */}
          <View style={styles.ambientGlowBlue} />
          <View style={styles.ambientGlowRed} />

          {/* Card Top Row: Brand & Live Status */}
          <View style={styles.cardHeader}>
            <View style={styles.brandRow}>
              <View style={styles.emblemBadge}>
                <Ionicons name="wallet" size={16} color="#60A5FA" />
              </View>
              <View>
                <Text style={styles.brandTitle}>
                  {(user?.name || 'ARMAN').toUpperCase()} PORTFOLIO
                </Text>
                <Text style={styles.brandSubtitle}>Capital Vault</Text>
              </View>
            </View>

            <View style={styles.liveBadge}>
              <View
                style={[
                  styles.liveDot,
                  { backgroundColor: isOverBudget ? '#EF4444' : '#22C55E' }
                ]}
              />
              <Text style={styles.liveText}>{isOverBudget ? 'DEFICIT' : 'ACTIVE'}</Text>
            </View>
          </View>

          {/* Hero Balance Block */}
          <View style={styles.heroBalanceSection}>
            <View style={styles.balanceHeaderRow}>
              <Text style={styles.balanceLabel}>NET AVAILABLE BALANCE</Text>
              <View
                style={[
                  styles.marginTag,
                  {
                    backgroundColor: isOverBudget
                      ? 'rgba(220, 38, 38, 0.25)'
                      : 'rgba(34, 197, 94, 0.2)'
                  }
                ]}
              >
                <Ionicons
                  name={isOverBudget ? 'trending-down' : 'trending-up'}
                  size={12}
                  color={isOverBudget ? '#F87171' : '#4ADE80'}
                />
                <Text
                  style={[
                    styles.marginTagText,
                    { color: isOverBudget ? '#F87171' : '#4ADE80' }
                  ]}
                >
                  {isOverBudget ? 'Exceeded' : `${Math.max(0, 100 - Math.round(burnRate))}% Safe`}
                </Text>
              </View>
            </View>

            <Text style={styles.mainBalanceText} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(remainingBalance)}
            </Text>

            {/* Budget Progress Meter */}
            <View style={styles.budgetTrackWrap}>
              <View style={styles.budgetTrackBg}>
                <View
                  style={[
                    styles.budgetTrackFill,
                    {
                      width: `${burnRate}%`,
                      backgroundColor: isOverBudget
                        ? '#EF4444'
                        : burnRate > 75
                          ? '#F59E0B'
                          : '#3B82F6'
                    }
                  ]}
                />
              </View>
              <View style={styles.budgetTrackLabels}>
                <Text style={styles.budgetTrackMeta}>Used: {Math.round(burnRate)}%</Text>
                <Text style={styles.budgetTrackMeta}>Limit: 100%</Text>
              </View>
            </View>
          </View>

          {/* Dual Inflow & Outflow Interactive Cards */}
          <View style={styles.dualStatsGrid}>
            {/* Income Capsule */}
            <TouchableOpacity
              style={[styles.statCapsule, styles.incomeCapsule]}
              onPress={onOpenSetIncome}
              activeOpacity={0.82}
            >
              <View style={styles.statTop}>
                <View style={styles.statIconBadgeIncome}>
                  <Ionicons name="arrow-up" size={13} color="#60A5FA" />
                </View>
                <Text style={styles.statCapsuleLabel}>TOTAL INCOME</Text>
              </View>
              <Text style={styles.statAmountIncome} numberOfLines={1}>
                {formatCurrency(totalIncome)}
              </Text>
              <Text style={styles.statActionHint}>Tap to Edit Inflow →</Text>
            </TouchableOpacity>

            {/* Expense Capsule */}
            <TouchableOpacity
              style={[styles.statCapsule, styles.expenseCapsule]}
              onPress={onOpenAddExpense}
              activeOpacity={0.82}
            >
              <View style={styles.statTop}>
                <View style={styles.statIconBadgeExpense}>
                  <Ionicons name="arrow-down" size={13} color="#F87171" />
                </View>
                <Text style={styles.statCapsuleLabel}>TOTAL EXPENSE</Text>
              </View>
              <Text style={styles.statAmountExpense} numberOfLines={1}>
                {formatCurrency(totalExpense)}
              </Text>
              <Text style={styles.statActionHintExpense}>+ Add Expense →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Modern 2x2 Tactical Action Cards Grid */}
        <View style={styles.actionPillsGrid}>
          {/* Action 1: Set Income */}
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              {
                backgroundColor: isDark ? '#0A152E' : '#FFFFFF',
                borderColor: 'rgba(37, 99, 235, 0.28)'
              }
            ]}
            onPress={onOpenSetIncome}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#1E3A8A' }]}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={[styles.actionPillTitle, { color: colors.text }]}>Set Income</Text>
              <Text style={[styles.actionPillSubtitle, { color: colors.textSecondary }]}>
                Monthly Target
              </Text>
            </View>
          </TouchableOpacity>

          {/* Action 2: Add Expense */}
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              {
                backgroundColor: isDark ? '#1F0B10' : '#FFFFFF',
                borderColor: 'rgba(220, 38, 38, 0.28)'
              }
            ]}
            onPress={onOpenAddExpense}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#DC2626' }]}>
              <Ionicons name="remove-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={[styles.actionPillTitle, { color: colors.text }]}>Add Expense</Text>
              <Text style={[styles.actionPillSubtitle, { color: colors.textSecondary }]}>
                Record Outflow
              </Text>
            </View>
          </TouchableOpacity>

          {/* Action 3: Analytics */}
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              {
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: 'rgba(71, 85, 105, 0.25)'
              }
            ]}
            onPress={onToggleCategoryBreakdown}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#0A192F' }]}>
              <Ionicons name="pie-chart" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={[styles.actionPillTitle, { color: colors.text }]}>Analytics</Text>
              <Text style={[styles.actionPillSubtitle, { color: colors.textSecondary }]}>
                Category Charts
              </Text>
            </View>
          </TouchableOpacity>

          {/* Action 4: Statement */}
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              {
                backgroundColor: isDark ? '#050811' : '#FFFFFF',
                borderColor: 'rgba(15, 23, 42, 0.25)'
              }
            ]}
            onPress={onOpenExport}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#000000' }]}>
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={[styles.actionPillTitle, { color: colors.text }]}>Statement</Text>
              <Text style={[styles.actionPillSubtitle, { color: colors.textSecondary }]}>
                Export PDF / CSV
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    paddingBottom: 8
  },
  curvedBackdrop: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 130,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 4
  },
  portfolioCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  ambientGlowBlue: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(37, 99, 235, 0.18)'
  },
  ambientGlowRed: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(220, 38, 38, 0.12)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  emblemBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)'
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  heroBalanceSection: {
    marginBottom: 18
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2
  },
  marginTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8
  },
  marginTagText: {
    fontSize: 10,
    fontWeight: '800'
  },
  mainBalanceText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginVertical: 4
  },
  budgetTrackWrap: {
    marginTop: 8
  },
  budgetTrackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden'
  },
  budgetTrackFill: {
    height: '100%',
    borderRadius: 3
  },
  budgetTrackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  budgetTrackMeta: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700'
  },
  dualStatsGrid: {
    flexDirection: 'row',
    gap: 12
  },
  statCapsule: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1
  },
  incomeCapsule: {
    backgroundColor: 'rgba(30, 58, 138, 0.35)',
    borderColor: 'rgba(59, 130, 246, 0.4)'
  },
  expenseCapsule: {
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  statIconBadgeIncome: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconBadgeExpense: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statCapsuleLabel: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  statAmountIncome: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  statAmountExpense: {
    color: '#F87171',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3
  },
  statActionHint: {
    color: '#93C5FD',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    opacity: 0.8
  },
  statActionHintExpense: {
    color: '#FCA5A5',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    opacity: 0.8
  },
  actionPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14
  },
  actionPillBtn: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionTextCol: {
    flex: 1
  },
  actionPillTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  actionPillSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  }
});
