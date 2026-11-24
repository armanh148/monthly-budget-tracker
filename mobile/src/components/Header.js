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
      {/* Left: Personalized Greeting */}
      <View style={styles.userGreetingWrap}>
        <Text style={styles.greetingMini}>WELCOME BACK</Text>
        <Text style={styles.greetingName} numberOfLines={1}>
          {user?.name || 'Arman'}
        </Text>
      </View>

      {/* Right: Month Selector, Theme Toggle & Avatar */}
      <View style={styles.rightGroup}>
        {/* Compact Modern Month Capsule */}
        <View style={styles.monthCapsule}>
          <TouchableOpacity
            onPress={prevMonth}
            style={styles.chevronTouch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Previous month"
          >
            <Ionicons name="chevron-back" size={14} color="#93C5FD" />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {MONTH_NAMES[selectedMonth - 1]?.slice(0, 3)} {selectedYear}
          </Text>

          <TouchableOpacity
            onPress={nextMonth}
            style={styles.chevronTouch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Next month"
          >
            <Ionicons name="chevron-forward" size={14} color="#93C5FD" />
          </TouchableOpacity>
        </View>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          style={styles.frostedBtn}
          onPress={toggleTheme}
          activeOpacity={0.8}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={15} color="#FFFFFF" />
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity
          onPress={onOpenSettings}
          style={styles.avatarRing}
          activeOpacity={0.85}
          accessibilityLabel="Account Settings"
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>
              {(user?.name || 'A').charAt(0).toUpperCase()}
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
    paddingTop: 12,
    paddingBottom: 14
  },
  userGreetingWrap: {
    justifyContent: 'center'
  },
  greetingMini: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1
  },
  greetingName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginTop: 1
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  monthCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 6
  },
  chevronTouch: {
    padding: 4
  },
  monthText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.1
  },
  frostedBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A192F',
    padding: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.6)'
  },
  avatarInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  }
});
