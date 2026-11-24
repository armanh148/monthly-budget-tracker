import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from './Icon';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { palette } from '../theme/colors';

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

export default function Header({ onOpenSettings }) {
  const { user, themeMode, toggleTheme } = useAuth();
  const { selectedMonth, selectedYear, nextMonth, prevMonth } = useBudget();
  const colors = palette[themeMode] || palette.light;
  const isDark = themeMode === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.topBackdrop }]}>
      {/* Center: Executive Frosted Month Capsule */}
      <View
        style={[
          styles.monthCapsule,
          { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }
        ]}
      >
        <TouchableOpacity
          onPress={prevMonth}
          style={styles.chevronTouch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={16} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.monthText, { color: colors.text }]}>
          {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
        </Text>

        <TouchableOpacity
          onPress={nextMonth}
          style={styles.chevronTouch}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Right: Theme Toggle & Glossy Avatar */}
      <View style={styles.rightGroup}>
        <TouchableOpacity
          style={[
            styles.frostedClayBtnSmall,
            { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}
          onPress={toggleTheme}
          activeOpacity={0.8}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={15} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          style={[styles.avatarRing, { backgroundColor: colors.surface }]}
          activeOpacity={0.85}
          accessibilityLabel="Account & Security Settings"
        >
          <View style={[styles.avatarInner, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryText || '#0D1117' }]}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12
  },
  frostedClayBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  frostedClayBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 8
  },
  chevronTouch: {
    padding: 6
  },
  monthText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.1
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  avatarRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(30, 58, 138, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  avatarInner: {
    flex: 1,
    borderRadius: 17,
    backgroundColor: '#0A192F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  }
});
