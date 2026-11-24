import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, categoryColors } from '../theme/colors';

const DEFAULT_DEMO_BARS = [
  { key: 'FO', label: 'Food', pct: 42 },
  { key: 'BI', label: 'Bills', pct: 76 },
  { key: 'TR', label: 'Travel', pct: 58 },
  { key: 'SH', label: 'Shop', pct: 92 },
  { key: 'HE', label: 'Health', pct: 78 },
  { key: 'OT', label: 'Other', pct: 48 }
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
      {/* Executive Financial Chart Card */}
      <View
        style={[
          styles.purpleCard,
          {
            backgroundColor: colors.chartBg,
            shadowColor: colors.shadow
          }
        ]}
      >
        {/* Top Clay Dropdown Pills Row (Mockup Style) */}
        <View style={styles.pillsHeader}>
          <View style={styles.purpleClayPill}>
            <Text style={styles.purplePillText}>Outcome</Text>
            <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
          </View>

          <View style={styles.purpleClayPill}>
            <Text style={styles.purplePillText}>Rs. {totalExpense.toLocaleString()}</Text>
          </View>
        </View>

        {/* Inner Soft Violet Clay Well */}
        <View style={[styles.chartWell, { backgroundColor: colors.chartWell }]}>
          <Text style={styles.wellTitle}>Outcome Transactions</Text>
          <Text style={styles.wellSubtitle}>
            {hasRealData
              ? 'Tap any bar to filter category'
              : 'Preview • Add expenses to see live bars'}
          </Text>

          {/* 3D Puffy Pink Vertical Pill Bars */}
          <View style={styles.barsRow}>
            {hasRealData
              ? categories.map((cat) => {
                  const amount = categoryBreakdown[cat] || 0;
                  const pct = Math.max(Math.round((amount / maxAmount) * 100), 22);
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
                            styles.pinkClayBar,
                            {
                              height: `${pct}%`,
                              backgroundColor: isSelected ? '#E7A8A1' : colors.chartBar,
                              borderTopColor: isSelected ? '#FEFFFE' : colors.chartBarTop,
                              borderLeftColor: isSelected ? '#FEFFFE' : colors.chartBarTop,
                              borderBottomColor: isSelected ? '#C88078' : colors.chartBarBottom
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.barDayLabel}>{cat.slice(0, 2).toUpperCase()}</Text>
                    </TouchableOpacity>
                  );
                })
              : DEFAULT_DEMO_BARS.map((bar) => (
                  <View key={bar.key} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.pinkClayBar,
                          {
                            height: `${bar.pct}%`,
                            opacity: 0.48,
                            backgroundColor: colors.chartBar,
                            borderTopColor: colors.chartBarTop,
                            borderLeftColor: colors.chartBarTop,
                            borderBottomColor: colors.chartBarBottom
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
              <Text style={styles.filterChipText}>All</Text>
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
                  <Ionicons name={catInfo.icon} size={12} color="#FFFFFF" />
                  <Text style={styles.filterChipText}>{cat}</Text>
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
    marginBottom: 14
  },
  purpleCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 227, 179, 0.14)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6
  },
  pillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10
  },
  purpleClayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 227, 179, 0.15)'
  },
  purplePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  chartWell: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 227, 179, 0.1)'
  },
  wellTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  wellSubtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 16
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 136,
    paddingTop: 8
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end'
  },
  barTrack: {
    height: 106,
    width: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8
  },
  pinkClayBar: {
    width: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  barDayLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '800'
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 14
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  filterChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
    borderColor: '#FFFFFF'
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  }
});
