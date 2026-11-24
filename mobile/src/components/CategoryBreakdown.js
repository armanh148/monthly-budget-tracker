import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, categoryColors } from '../theme/colors';

const DEFAULT_DEMO_BARS = [
  { key: 'FOOD', label: 'Food', pct: 45 },
  { key: 'BILL', label: 'Bills', pct: 80 },
  { key: 'TRAV', label: 'Travel', pct: 60 },
  { key: 'SHOP', label: 'Shop', pct: 90 },
  { key: 'HLTH', label: 'Health', pct: 55 },
  { key: 'OTHR', label: 'Other', pct: 35 }
];

export default function CategoryBreakdown({ onSelectCategory, activeCategory }) {
  const { categoryBreakdown, summary } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;

  const totalExpense = summary.total_expense || 0;
  const categories = Object.keys(categoryBreakdown);
  const hasRealData = categories.length > 0 && totalExpense > 0;
  const maxAmount = hasRealData
    ? Math.max(...categories.map((c) => categoryBreakdown[c] || 0), 1)
    : 100;

  return (
    <View style={styles.wrapper}>
      {/* Modern Executive Financial Breakdown Card */}
      <View
        style={[
          styles.breakdownCard,
          {
            backgroundColor: colors.chartBg || '#0A192F',
            shadowColor: colors.shadow
          }
        ]}
      >
        {/* Top Header Pill Row */}
        <View style={styles.pillsHeader}>
          <View style={styles.headerTitlePill}>
            <View style={styles.redDot} />
            <Text style={styles.headerTitleText}>Spending Breakdown</Text>
          </View>

          <View style={styles.totalBadgePill}>
            <Text style={styles.totalBadgeLabel}>Total:</Text>
            <Text style={styles.totalBadgeValue}>Rs. {totalExpense.toLocaleString()}</Text>
          </View>
        </View>

        {/* Inner Chart Well */}
        <View style={[styles.chartWell, { backgroundColor: colors.chartWell || '#080E1E' }]}>
          <View style={styles.wellHeaderRow}>
            <Text style={styles.wellTitle}>Monthly Analytics</Text>
            <Text style={styles.wellSubtitle}>
              {hasRealData
                ? 'Tap a bar to isolate category'
                : 'Preview • Add expenses to view live data'}
            </Text>
          </View>

          {/* Sleek Vertical Capsule Bars */}
          <View style={styles.barsRow}>
            {hasRealData
              ? categories.map((cat) => {
                  const amount = categoryBreakdown[cat] || 0;
                  const pct = Math.max(Math.round((amount / maxAmount) * 100), 18);
                  const isSelected = activeCategory === cat;

                  return (
                    <TouchableOpacity
                      key={cat}
                      style={styles.barCol}
                      onPress={() => onSelectCategory(isSelected ? null : cat)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.capsuleBar,
                            {
                              height: `${pct}%`,
                              backgroundColor: isSelected ? '#EF4444' : '#1E3A8A',
                              borderColor: isSelected ? '#FCA5A5' : '#3B82F6',
                              shadowColor: isSelected ? '#DC2626' : '#2563EB'
                            }
                          ]}
                        />
                      </View>
                      <Text style={[styles.barDayLabel, isSelected && { color: '#EF4444', fontWeight: '900' }]}>
                        {cat.slice(0, 4).toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              : DEFAULT_DEMO_BARS.map((bar) => (
                  <View key={bar.key} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.capsuleBar,
                          {
                            height: `${bar.pct}%`,
                            opacity: 0.45,
                            backgroundColor: '#1E3A8A',
                            borderColor: '#3B82F6'
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.barDayLabel}>{bar.key}</Text>
                  </View>
                ))}
          </View>
        </View>

        {/* Filter Chips */}
        {hasRealData && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <TouchableOpacity
              onPress={() => onSelectCategory(null)}
              style={[styles.filterChip, activeCategory === null && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, activeCategory === null && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              const catInfo = categoryColors[cat] || categoryColors.General;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => onSelectCategory(isSelected ? null : cat)}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                >
                  <Ionicons name={catInfo.icon} size={12} color={isSelected ? '#EF4444' : '#94A3B8'} />
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16
  },
  breakdownCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.22)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6
  },
  pillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8
  },
  headerTitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DC2626'
  },
  headerTitleText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  totalBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.35)'
  },
  totalBadgeLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '600'
  },
  totalBadgeValue: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900'
  },
  chartWell: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  wellHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  wellTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  wellSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500'
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 125,
    paddingTop: 6
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end'
  },
  barTrack: {
    height: 98,
    width: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6
  },
  capsuleBar: {
    width: 14,
    borderRadius: 7,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4
  },
  barDayLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  filterChipActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderColor: '#DC2626'
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700'
  },
  filterChipTextActive: {
    color: '#EF4444',
    fontWeight: '800'
  }
});
