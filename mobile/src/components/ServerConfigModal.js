import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Ionicons from './Icon';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayPill } from '../theme/colors';

export default function ServerConfigModal({ visible, onClose }) {
  const { user, isAuthenticated, logout, themeMode } = useAuth();

  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);
  const clayPill = getClayPill(themeMode);

  const handleSwitchAccount = async () => {
    onClose();
    await logout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, clayCard]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Account Settings</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Manage your active profile
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              accessibilityLabel="Close Settings"
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* SIGNED-IN ACCOUNT */}
            {isAuthenticated && user && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.primary }]}>
                  SIGNED-IN ACCOUNT
                </Text>
                <View
                  style={[styles.accountCard, clayPill, { backgroundColor: colors.surfaceSubtle }]}
                >
                  <View style={styles.accountRow}>
                    <View style={[styles.accountAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.accountAvatarText}>
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: colors.text }]} numberOfLines={1}>
                        {user.name || 'Account Holder'}
                      </Text>
                      <Text
                        style={[styles.settingDesc, { color: colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {user.email}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSwitchAccount}
                    style={[
                      styles.logoutBtn,
                      { backgroundColor: colors.expenseLight, borderColor: colors.expense }
                    ]}
                    activeOpacity={0.82}
                  >
                    <Ionicons name="log-out-outline" size={16} color={colors.expense} />
                    <Text style={[styles.logoutBtnText, { color: colors.expense }]}>
                      Log Out / Switch Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Action Button */}
            <View style={styles.actionStack}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.85}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    padding: 22
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollArea: {
    marginTop: 6
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10
  },
  accountCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 18
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  accountAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  settingInfo: {
    flex: 1
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  actionStack: {
    marginTop: 6,
    paddingBottom: 4
  },
  cancelBtn: {
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});
