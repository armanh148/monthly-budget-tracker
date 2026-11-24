import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, categoryColors, getClayCard } from '../theme/colors';

const CATEGORY_ICONS = {
  Food: 'restaurant-outline',
  Bills: 'receipt-outline',
  Travel: 'car-outline',
  Shopping: 'bag-handle-outline',
  Health: 'medkit-outline',
  Entertainment: 'film-outline',
  Education: 'book-outline',
  General: 'pricetag-outline'
};

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-US')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export default function ExpenseList({ onEditExpense, onAddExpense, activeCategory }) {
  const { expenses, deleteExpense } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Filter expenses by search query and active category filter
  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory =
      !activeCategory || exp.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() || exp.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${item.name}" (${formatCurrency(item.amount)})?\n\nThis amount will be automatically restored to your remaining balance.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(item.id);
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete expense.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header: "Transactions Activity" */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transactions Activity</Text>
          <View style={[styles.countBadge, { backgroundColor: 'rgba(37, 99, 235, 0.15)', borderColor: 'rgba(37, 99, 235, 0.3)' }]}>
            <Text style={[styles.countBadgeText, { color: '#3B82F6' }]}>
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'record' : 'records'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionIconBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => setShowSearch(!showSearch)}
            accessibilityLabel="Search expenses"
          >
            <Ionicons name="search" size={15} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onAddExpense}
            style={[styles.addBtnPill, { backgroundColor: '#DC2626' }]}
          >
            <Ionicons name="add" size={15} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clean Search Input Bar */}
      {showSearch && (
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
        >
          <Ionicons name="search-outline" size={16} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Transaction List */}
      {filteredExpenses.length === 0 ? (
        <View style={[styles.emptyContainer, clayCard]}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceSubtle }]}>
            <Ionicons name="receipt-outline" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {expenses.length === 0 ? 'No transactions yet' : 'No matching results'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {expenses.length === 0
              ? 'Tap "+ Add" above or the "+" orb below to record an expense.'
              : 'Try searching with a different term.'}
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredExpenses.map((item) => {
            const cat = item.category || 'General';
            const catConfig = categoryColors[cat] || categoryColors.General;
            const catColor = catConfig.color;
            const catDarkColor = catConfig.darkColor || '#5138CC';
            const iconName = CATEGORY_ICONS[cat] || 'pricetag-outline';

            return (
              <View
                key={item.id}
                style={[
                  styles.transactionCard,
                  {
                    backgroundColor: colors.surface || '#0A192F',
                    borderColor: 'rgba(37, 99, 235, 0.18)',
                    shadowColor: colors.shadow
                  }
                ]}
              >
                {/* Left: Category Icon Squircle with subtle red accent ring */}
                <View
                  style={[
                    styles.iconBadge,
                    {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: catColor || '#DC2626'
                    }
                  ]}
                >
                  <Ionicons name={iconName} size={18} color={catColor || '#EF4444'} />
                </View>

                {/* Middle: Title, Date, Category Tag */}
                <View style={styles.infoCol}>
                  <Text style={[styles.transactionTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={[styles.categoryTag, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
                      <Text style={[styles.metaCategory, { color: catColor || '#EF4444' }]}>{cat}</Text>
                    </View>
                    <Text style={[styles.metaDate, { color: colors.textTertiary }]}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </View>

                {/* Right: Amount in Crimson Red & Mini Actions */}
                <View style={styles.amountCol}>
                  <Text style={[styles.amountText, { color: '#EF4444' }]}>
                    -{formatCurrency(item.amount)}
                  </Text>

                  <View style={styles.actionGroup}>
                    <TouchableOpacity
                      onPress={() => onEditExpense(item)}
                      style={[styles.miniBtn, { backgroundColor: 'rgba(30, 58, 138, 0.25)', borderColor: 'rgba(37, 99, 235, 0.3)' }]}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                      accessibilityLabel={`Edit ${item.name}`}
                    >
                      <Ionicons name="pencil" size={12} color="#93C5FD" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(item)}
                      style={[styles.miniBtn, { backgroundColor: 'rgba(220, 38, 38, 0.15)', borderColor: 'rgba(220, 38, 38, 0.3)' }]}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                      accessibilityLabel={`Delete ${item.name}`}
                    >
                      <Ionicons name="trash-outline" size={12} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 40
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  addBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17
  },
  listContainer: {
    gap: 10
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 70,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  infoCol: {
    flex: 1,
    marginRight: 8
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1
  },
  metaCategory: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  metaDate: {
    fontSize: 11,
    fontWeight: '500'
  },
  amountCol: {
    alignItems: 'flex-end'
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  miniBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
