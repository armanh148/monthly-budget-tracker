import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette, getClayCard, getClayInput, getClayPill } from '../theme/colors';
import { aiAgentService } from '../services/aiAgent';

const QUICK_QUESTIONS = [
  'How can I save more this month?',
  'Kiya mera budget safe range mai hai?',
  'Tips to cut unnecessary expenses',
  'Review my spending pace'
];

export default function AIAssistantModal({ visible, onClose }) {
  const { summary, expenses } = useBudget();
  const { themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const clayCard = getClayCard(themeMode);
  const clayInput = getClayInput(themeMode);
  const clayPill = getClayPill(themeMode);

  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceResult, setAdviceResult] = useState('');
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatAnswer, setChatAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGetAdvice = async () => {
    setErrorMsg('');
    setIsLoadingAdvice(true);
    try {
      const advice = await aiAgentService.getFinancialAdvice(summary, expenses);
      setAdviceResult(advice);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to generate financial advice.');
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleAskQuestion = async (textToAsk) => {
    const query = textToAsk || question;
    if (!query || !query.trim()) return;

    setErrorMsg('');
    setIsAsking(true);
    setQuestion(query);
    try {
      const ans = await aiAgentService.askAdvisor(query, summary, expenses);
      setChatAnswer(ans);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to get answer from AI agent.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.modalCard, clayCard, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.primaryLight, borderColor: colors.primary }
                ]}
              >
                <Ionicons name="sparkles" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  AI Financial Coach
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Instant Budget Insights & Advisory
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
              accessibilityLabel="Close Modal"
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* Model Badge */}
            <View style={[styles.modelBadge, clayPill, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="flash" size={12} color={colors.primary} />
              <Text style={[styles.modelBadgeText, { color: colors.textSecondary }]}>
                Engine:{' '}
                <Text style={{ color: colors.primary, fontWeight: '800' }}>
                  Neural Engine (Ultra Fast)
                </Text>
              </Text>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: colors.expenseLight, borderColor: colors.expense }
                ]}
              >
                <Ionicons name="alert-circle" size={16} color={colors.expense} />
                <Text style={[styles.errorText, { color: colors.expense }]}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Section 1: Financial Health Check */}
            <View style={[styles.cardSection, clayPill, { backgroundColor: colors.surfaceSubtle }]}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="pulse" size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  SMART FINANCIAL HEALTH CHECK
                </Text>
              </View>
              <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                Smart AI analyzes your current income, expenses, and burn rate to give personalized
                advice.
              </Text>

              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
                onPress={handleGetAdvice}
                disabled={isLoadingAdvice}
                activeOpacity={0.8}
              >
                {isLoadingAdvice ? (
                  <ActivityIndicator size="small" color="#22160F" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="#22160F" />
                    <Text style={styles.primaryActionBtnText}>Generate Budget Insights</Text>
                  </>
                )}
              </TouchableOpacity>

              {adviceResult ? (
                <View style={[styles.resultBox, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.resultText, { color: colors.text }]}>{adviceResult}</Text>
                </View>
              ) : null}
            </View>

            {/* Section 2: Ask Financial Coach */}
            <View
              style={[
                styles.cardSection,
                clayPill,
                { backgroundColor: colors.surfaceSubtle, marginTop: 14 }
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="chatbubbles" size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  ASK COACH (ROMAN URDU / ENGLISH)
                </Text>
              </View>

              {/* Quick Suggestion Chips */}
              <View style={styles.chipsRow}>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.surface, borderColor: 'rgba(231, 168, 161, 0.3)' }
                    ]}
                    onPress={() => handleAskQuestion(q)}
                    disabled={isAsking}
                  >
                    <Text style={[styles.chipText, { color: colors.textSecondary }]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input Row */}
              <View style={[styles.askInputRow, clayInput, { backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.askTextInput, { color: colors.text }]}
                  placeholder="Ask anything (e.g. Can I afford eating out?)..."
                  placeholderTextColor={colors.textTertiary}
                  value={question}
                  onChangeText={setQuestion}
                  onSubmitEditing={() => handleAskQuestion()}
                  returnKeyType="send"
                  editable={!isAsking}
                />
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    {
                      backgroundColor: colors.primary,
                      opacity: isAsking || !question.trim() ? 0.6 : 1
                    }
                  ]}
                  onPress={() => handleAskQuestion()}
                  disabled={isAsking || !question.trim()}
                >
                  {isAsking ? (
                    <ActivityIndicator size="small" color="#22160F" />
                  ) : (
                    <Ionicons name="paper-plane" size={15} color="#22160F" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Chat Answer Box */}
              {chatAnswer ? (
                <View style={[styles.resultBox, { backgroundColor: colors.surface }]}>
                  <View style={styles.coachAnswerHeader}>
                    <Ionicons name="shield-checkmark" size={14} color={colors.income} />
                    <Text style={[styles.coachAnswerLabel, { color: colors.income }]}>
                      AI Advisor Recommendation:
                    </Text>
                  </View>
                  <Text style={[styles.resultText, { color: colors.text }]}>{chatAnswer}</Text>
                </View>
              ) : null}
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Close button at bottom */}
          <TouchableOpacity
            style={[styles.dismissBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={onClose}
          >
            <Text style={[styles.dismissBtnText, { color: colors.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    borderRadius: 24,
    padding: 18
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)'
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentScroll: {
    marginTop: 12
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12
  },
  modelBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  cardSection: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(231, 168, 161, 0.2)'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  sectionSub: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#E28D93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#22160F'
  },
  resultBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(231, 168, 161, 0.3)'
  },
  coachAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  coachAnswerLabel: {
    fontSize: 11,
    fontWeight: '800'
  },
  resultText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500'
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600'
  },
  askInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  askTextInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 6
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dismissBtn: {
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  dismissBtnText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
