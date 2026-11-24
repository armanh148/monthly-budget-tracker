import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import Ionicons from './Icon';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayButton, getClayInput, getClayPill } from '../theme/colors';
import { aiAgentService } from '../services/aiAgent';

export default function ServerConfigModal({ visible, onClose }) {
  const { user, isAuthenticated, logout, themeMode } = useAuth();

  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);
  const clayButton = getClayButton(themeMode, colors.primary, colors.primaryDark);
  const clayInput = getClayInput(themeMode);
  const clayPill = getClayPill(themeMode);

  const [groqKey, setGroqKey] = useState('');
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [isTestingGroq, setIsTestingGroq] = useState(false);
  const [groqStatus, setGroqStatus] = useState(null);

  useEffect(() => {
    if (visible) {
      setGroqStatus(null);
      aiAgentService.getApiKey().then((k) => setGroqKey(k || ''));
    }
  }, [visible]);

  const handleSwitchAccount = async () => {
    onClose();
    await logout();
  };

  const handleSave = async () => {
    if (groqKey.trim()) {
      await aiAgentService.setApiKey(groqKey.trim());
    }
    Alert.alert('Saved', 'Settings saved successfully.');
    onClose();
  };

  const handleTestGroq = async () => {
    setIsTestingGroq(true);
    setGroqStatus(null);
    try {
      const res = await aiAgentService.testConnection(groqKey.trim());
      setGroqStatus({ ok: true, msg: `Groq AI Online (${res.activeModel})` });
    } catch (err) {
      setGroqStatus({ ok: false, msg: err?.message || 'Groq connection failed' });
    } finally {
      setIsTestingGroq(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, clayCard]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="settings-outline" size={21} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>App Settings</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Account & AI Configuration
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
            {/* SECTION 0: ACTIVE ACCOUNT & MULTI-USER SWITCHER */}
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

            {/* SECTION: GROQ AI AGENT */}
            <Text style={[styles.sectionLabel, { color: colors.primary, marginTop: 14 }]}>
              GROQ AI AGENT
            </Text>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  GROQ API KEY (LLM AGENT)
                </Text>
                <TouchableOpacity onPress={() => setShowGroqKey(!showGroqKey)}>
                  <Text style={[styles.showKeyText, { color: colors.primary }]}>
                    {showGroqKey ? 'Hide' : 'Show Key'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[styles.inputBox, clayInput, { flexDirection: 'row', alignItems: 'center' }]}
              >
                <Ionicons
                  name="sparkles"
                  size={16}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text, flex: 1 }]}
                  placeholder="gsk_..."
                  placeholderTextColor={colors.textTertiary}
                  value={groqKey}
                  onChangeText={setGroqKey}
                  secureTextEntry={!showGroqKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.pingRow}>
              <TouchableOpacity
                onPress={handleTestGroq}
                style={[styles.pingBtn, clayPill, { backgroundColor: colors.surfaceSubtle }]}
                disabled={isTestingGroq}
              >
                <Ionicons
                  name={isTestingGroq ? 'hourglass-outline' : 'flash-outline'}
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.pingBtnText, { color: colors.primary }]}>
                  {isTestingGroq ? 'Testing AI...' : 'Test Groq AI Key'}
                </Text>
              </TouchableOpacity>

              {groqStatus && (
                <View style={styles.pingResult}>
                  <Ionicons
                    name={groqStatus.ok ? 'checkmark-circle' : 'close-circle'}
                    size={15}
                    color={groqStatus.ok ? colors.income : colors.expense}
                  />
                  <Text
                    style={[
                      styles.pingResultText,
                      { color: groqStatus.ok ? colors.income : colors.expense }
                    ]}
                    numberOfLines={1}
                  >
                    {groqStatus.msg}
                  </Text>
                </View>
              )}
            </View>

            {/* Stacked Action Buttons */}
            <View style={styles.actionStack}>
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, clayButton]}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Save Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceSubtle }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Close</Text>
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
    backgroundColor: 'rgba(18, 16, 40, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    padding: 22
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    marginBottom: 8
  },
  accountCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 14
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  accountAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  settingInfo: {
    flex: 1
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700'
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
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  inputGroup: {
    marginBottom: 12
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  showKeyText: {
    fontSize: 11,
    fontWeight: '700'
  },
  inputBox: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  textInput: {
    fontSize: 13,
    fontWeight: '600'
  },
  pingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap'
  },
  pingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10
  },
  pingBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  pingResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1
  },
  pingResultText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  actionStack: {
    gap: 10,
    marginTop: 8,
    paddingBottom: 8
  },
  saveBtn: {
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  cancelBtn: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700'
  }
});
