import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';
import { palette, getClayCard } from '../theme/colors';

import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import BudgetAlertBanner from '../components/BudgetAlertBanner';
import MonthComparisonCard from '../components/MonthComparisonCard';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ExpenseList from '../components/ExpenseList';
import IncomeAccordion from '../components/IncomeAccordion';
import ExpenseAccordion from '../components/ExpenseAccordion';

import SetIncomeModal from '../components/SetIncomeModal';
import AddEditExpenseModal from '../components/AddEditExpenseModal';
import ServerConfigModal from '../components/ServerConfigModal';
import ExportModal from '../components/ExportModal';

export default function HomeScreen() {
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);
  const { isLoading, refresh, errorMessage, clearError } = useBudget();

  // Active Category Filter & View Toggles
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  // Accordion State: 'income' | 'expense' | null
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // Modal States
  const [showSetIncome, setShowSetIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleCloseExpenseModal = () => {
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.topBackdrop }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.topBackdrop}
      />

      {/* 1. Seamless Claymorphism Header Over Violet Backdrop */}
      <Header onOpenSettings={() => setShowServerConfig(true)} />

      {/* Main Porcelain Clay Canvas */}
      <View style={[styles.canvasWrapper, { backgroundColor: colors.background }]}>
        {/* Network or General Error Notice */}
        {errorMessage && (
          <View style={styles.errorNotice}>
            <Ionicons name="cloud-offline-outline" size={15} color="#F06464" />
            <Text style={styles.errorNoticeText} numberOfLines={2}>
              {errorMessage}
            </Text>
            <TouchableOpacity onPress={clearError} style={styles.errorCloseBtn}>
              <Ionicons name="close" size={15} color="#F06464" />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={[styles.mainScroll, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              tintColor="#FFFFFF"
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* 2. Floating 3D Purple Clay Card & 4 Pastel Clay Action Tiles */}
          <SummaryCards
            onOpenSetIncome={() => setShowSetIncome(true)}
            onOpenAddExpense={() => setShowAddExpense(true)}
            onToggleCategoryBreakdown={() => setShowCharts(!showCharts)}
            onOpenExport={() => setShowExport(true)}
          />

          {/* 3. Main Budget Content Area */}
          <View style={[styles.mainContentSheet, { backgroundColor: colors.background }]}>
            {/* Budget Alert Banner */}
            <BudgetAlertBanner />

            {/* Screen 2 Claymorphism Analytics Bar Chart (pops right into view!) */}
            {showCharts && (
              <CategoryBreakdown
                activeCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
              />
            )}

            {/* 4. Uniform Puffy White Clay Cards (Budget Breakdown) */}
            <View style={styles.accordionsSection}>
              <View style={styles.accordionsHeaderRow}>
                <Text style={[styles.accordionsMainTitle, { color: colors.text }]}>
                  Budget Breakdown
                </Text>
                <Text style={[styles.accordionsSubtitle, { color: colors.primary }]}>
                  Tap to expand
                </Text>
              </View>

              {/* Income Accordion */}
              <IncomeAccordion
                isExpanded={expandedAccordion === 'income'}
                onToggle={() =>
                  setExpandedAccordion(expandedAccordion === 'income' ? null : 'income')
                }
              />

              {/* Expense Accordion */}
              <ExpenseAccordion
                isExpanded={expandedAccordion === 'expense'}
                onToggle={() =>
                  setExpandedAccordion(expandedAccordion === 'expense' ? null : 'expense')
                }
                onEditExpense={handleOpenEdit}
              />

              {/* Month Comparison Card */}
              <MonthComparisonCard />
            </View>

            {/* Recent Transactions List (Mockup "Recent" Clay Cards) */}
            <ExpenseList
              activeCategory={activeCategory}
              onAddExpense={() => setShowAddExpense(true)}
              onEditExpense={handleOpenEdit}
            />
          </View>
        </ScrollView>

        {/* 5. Executive Floating Glass Bottom Navigation Dock */}
        <View
          style={[
            styles.bottomDock,
            {
              backgroundColor: colors.dockBg,
              borderColor: colors.border
            }
          ]}
        >
          {/* Nav 1: Data */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => {
              setShowCharts(false);
              setActiveCategory(null);
            }}
            activeOpacity={0.8}
            accessibilityLabel="Overview / All Data"
          >
            <Ionicons
              name="home"
              size={20}
              color={!showCharts ? colors.dockActive : colors.dockInactive}
            />
            <Text
              style={[
                styles.dockLabel,
                { color: !showCharts ? colors.dockActive : colors.dockInactive }
              ]}
            >
              Data
            </Text>
          </TouchableOpacity>

          {/* Nav 2: Charts */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setShowCharts(!showCharts)}
            activeOpacity={0.8}
            accessibilityLabel="Analytics & Charts"
          >
            <Ionicons
              name="bar-chart"
              size={20}
              color={showCharts ? colors.dockActive : colors.dockInactive}
            />
            <Text
              style={[
                styles.dockLabel,
                { color: showCharts ? colors.dockActive : colors.dockInactive }
              ]}
            >
              Charts
            </Text>
          </TouchableOpacity>

          {/* Center Elevated Action Button (+) */}
          <TouchableOpacity
            style={[
              styles.dockCenterBtn,
              {
                backgroundColor: '#DC2626',
                shadowColor: '#DC2626'
              }
            ]}
            onPress={() => setShowAddExpense(true)}
            activeOpacity={0.8}
            accessibilityLabel="Add New Expense"
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Nav 4: Report */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setShowExport(true)}
            activeOpacity={0.8}
            accessibilityLabel="Export Statement"
          >
            <Ionicons name="document-text" size={20} color={colors.dockInactive} />
            <Text style={[styles.dockLabel, { color: colors.dockInactive }]}>Report</Text>
          </TouchableOpacity>

          {/* Nav 5: Setting */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setShowServerConfig(true)}
            activeOpacity={0.8}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings" size={20} color={colors.dockInactive} />
            <Text style={[styles.dockLabel, { color: colors.dockInactive }]}>Setting</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <SetIncomeModal visible={showSetIncome} onClose={() => setShowSetIncome(false)} />

      <AddEditExpenseModal
        visible={showAddExpense}
        onClose={handleCloseExpenseModal}
        editingExpense={editingExpense}
      />

      <ServerConfigModal visible={showServerConfig} onClose={() => setShowServerConfig(false)} />

      <ExportModal visible={showExport} onClose={() => setShowExport(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  canvasWrapper: {
    flex: 1
  },
  mainScroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 112
  },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8
  },
  errorNoticeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#F06464',
    lineHeight: 15
  },
  errorCloseBtn: {
    padding: 2
  },
  mainContentSheet: {
    paddingTop: 6
  },
  aiAdvisorContainer: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8
  },
  aiAdvisorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1
  },
  aiAdvisorIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiAdvisorTextWrap: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6
  },
  aiAdvisorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  aiAdvisorTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  aiNewPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6
  },
  aiNewPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  aiAdvisorSub: {
    fontSize: 11,
    fontWeight: '500'
  },
  accordionsSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8
  },
  accordionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14
  },
  accordionsMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  accordionsSubtitle: {
    fontSize: 12,
    fontWeight: '700'
  },
  bottomDock: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10
  },
  dockItem: {
    width: 52,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  dockCenterBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8
  }
});
