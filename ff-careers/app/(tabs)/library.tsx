import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';
import { sendChatMessage } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InsightCardData {
  id: string;
  icon: string;
  label: string;
  value: string;
  bg: string;
}

interface Career {
  id: string;
  title: string;
  industry: string;
  description: string;
  matchScore: number;
  matchedSkills: string[];
  skillsToLearn: string[];
  aiSummary: string;
  avgSalary: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
// TODO: Replace with real API calls to /careers/me and /insights/me

const INSIGHT_CARDS: InsightCardData[] = [
  { id: '1', icon: '✨', label: 'Top Match', value: 'Product Manager', bg: '#ffffff' },
  { id: '2', icon: '📈', label: 'Rising Field', value: 'AI/ML Engineer', bg: '#ffffff' },
  { id: '3', icon: '🎯', label: 'Skills Ready', value: '4 careers', bg: '#ffffff' },
  { id: '4', icon: '📚', label: 'Learn Next', value: 'SQL Basics', bg: '#ffffff' },
  { id: '5', icon: '💼', label: 'Active Openings', value: '2,340 roles', bg: '#ffffff' },
];

const MOCK_CAREERS: Career[] = [
  {
    id: '1',
    title: 'Product Manager',
    industry: 'Technology',
    description: 'Lead cross-functional teams to define and ship products users love.',
    matchScore: 91,
    matchedSkills: ['Communication', 'Strategy', 'Data Analysis'],
    skillsToLearn: ['SQL', 'A/B Testing', 'Roadmapping Tools'],
    aiSummary:
      'Your background in communication and strategic thinking aligns strongly with PM work. Your experience leading projects gives you a foundation most entry-level candidates lack.',
    avgSalary: '$115k – $145k',
  },
  {
    id: '2',
    title: 'UX Researcher',
    industry: 'Design',
    description: 'Uncover how real people think and behave to guide product decisions.',
    matchScore: 78,
    matchedSkills: ['Critical Thinking', 'Interviewing', 'Writing'],
    skillsToLearn: ['Figma', 'Qualtrics', 'Usability Testing'],
    aiSummary:
      'Your analytical mindset and interpersonal skills map well to UX Research. A few targeted projects in usability testing would make your profile very competitive.',
    avgSalary: '$90k – $120k',
  },
  {
    id: '3',
    title: 'Data Analyst',
    industry: 'Analytics',
    description: 'Turn raw data into insights that drive business decisions.',
    matchScore: 65,
    matchedSkills: ['Problem Solving', 'Excel', 'Attention to Detail'],
    skillsToLearn: ['Python', 'SQL', 'Tableau', 'Statistics'],
    aiSummary:
      'You have the core analytical instincts for this role. Adding SQL and a data visualization tool to your skillset would significantly boost your match score.',
    avgSalary: '$75k – $110k',
  },
  {
    id: '4',
    title: 'Marketing Manager',
    industry: 'Marketing',
    description: 'Drive growth through campaigns, content, and brand strategy.',
    matchScore: 82,
    matchedSkills: ['Creativity', 'Content Writing', 'Social Media'],
    skillsToLearn: ['Google Analytics', 'Paid Ads', 'Email Automation'],
    aiSummary:
      'Your creative and communication skills are a strong foundation. Gaining hands-on experience with marketing analytics tools will elevate your candidacy.',
    avgSalary: '$80k – $125k',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function matchColor(score: number) {
  if (score >= 80) return '#27ae60';
  if (score >= 60) return '#e8a020';
  return '#cc4444';
}

function matchLabel(score: number) {
  if (score >= 80) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Developing Match';
}

// ─── Insight Card ──────────────────────────────────────────────────────────────

function InsightCard({ card }: { card: InsightCardData }) {
  return (
    <View style={[insightStyles.card, { backgroundColor: card.bg }]}>
      <Text style={insightStyles.icon}>{card.icon}</Text>
      <Text style={insightStyles.label}>{card.label}</Text>
      <Text style={insightStyles.value}>{card.value}</Text>
    </View>
  );
}

const insightStyles = StyleSheet.create({
  card: {
    width: 136,
    borderRadius: 16,
    padding: 16,
    marginRight: 10,
    gap: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: { fontSize: 24 },
  label: {
    fontSize: 11,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: AppFonts.bold,
    marginTop: 2,
  },
  value: {
    fontSize: 15,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
});

// ─── Skill Chip ────────────────────────────────────────────────────────────────

function Chip({ label, variant }: { label: string; variant: 'matched' | 'learn' }) {
  const bg = variant === 'matched' ? '#e8f5e9' : '#f0f0f0';
  const color = variant === 'matched' ? '#27ae60' : '#666666';
  return (
    <View style={[chipStyles.chip, { backgroundColor: bg }]}>
      <Text style={[chipStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    fontFamily: AppFonts.bold,
  },
});

// ─── Career Detail Modal ────────────────────────────────────────────────────────

function CareerDetailModal({
  career,
  onClose,
  onChat,
}: {
  career: Career | null;
  onClose: () => void;
  onChat: (career: Career) => void;
}) {
  if (!career) return null;
  const color = matchColor(career.matchScore);

  return (
    <Modal visible={!!career} animationType="slide" transparent onRequestClose={onClose}>
      <View style={detailStyles.overlay}>
        <Pressable style={detailStyles.backdrop} onPress={onClose} />
        <View style={detailStyles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Header */}
            <View style={detailStyles.header}>
              <View style={detailStyles.headerLeft}>
                <View style={detailStyles.industryPill}>
                  <Text style={detailStyles.industryText}>{career.industry}</Text>
                </View>
                <Text style={detailStyles.title}>{career.title}</Text>
              </View>
              <Pressable onPress={onClose} style={detailStyles.closeBtn}>
                <Text style={detailStyles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Match Score */}
            <View style={[detailStyles.matchBanner, { borderColor: color }]}>
              <View style={[detailStyles.scoreBubble, { backgroundColor: color }]}>
                <Text style={detailStyles.scoreNum}>{career.matchScore}</Text>
                <Text style={detailStyles.scorePct}>%</Text>
              </View>
              <View style={detailStyles.matchInfo}>
                <Text style={[detailStyles.matchLabel, { color }]}>{matchLabel(career.matchScore)}</Text>
                <Text style={detailStyles.matchDesc}>Based on your profile and skills</Text>
              </View>
            </View>

            {/* AI Summary */}
            <View style={detailStyles.aiCard}>
              <Text style={detailStyles.aiLabel}>✦  AI Insight</Text>
              <Text style={detailStyles.aiText}>{career.aiSummary}</Text>
            </View>

            {/* Salary */}
            <View style={detailStyles.row}>
              <Text style={detailStyles.sectionLabel}>Avg. Salary</Text>
              <Text style={detailStyles.salary}>{career.avgSalary}</Text>
            </View>

            {/* Matched Skills */}
            <Text style={detailStyles.sectionLabel}>Skills You Have</Text>
            <View style={detailStyles.chipRow}>
              {career.matchedSkills.map((s) => (
                <Chip key={s} label={s} variant="matched" />
              ))}
            </View>

            {/* Skills to Learn */}
            <Text style={detailStyles.sectionLabel}>Skills to Develop</Text>
            <View style={detailStyles.chipRow}>
              {career.skillsToLearn.map((s) => (
                <Chip key={s} label={s} variant="learn" />
              ))}
            </View>

            {/* Chat CTA */}
            <Pressable
              style={detailStyles.chatBtn}
              onPress={() => {
                onClose();
                onChat(career);
              }}
            >
              <Text style={detailStyles.chatBtnText}>💬  Chat about this career</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.overlay,
  },
  sheet: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: { flex: 1, gap: 6 },
  industryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  industryText: {
    fontSize: 11,
    color: '#666666',
    fontFamily: AppFonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeBtnText: {
    fontSize: 14,
    color: AppColors.textMuted,
    fontFamily: AppFonts.bold,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  scoreBubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreNum: {
    fontSize: 22,
    color: '#fff',
    fontFamily: AppFonts.bold,
  },
  scorePct: {
    fontSize: 13,
    color: '#fff',
    fontFamily: AppFonts.bold,
    marginTop: 4,
  },
  matchInfo: { flex: 1, gap: 3 },
  matchLabel: {
    fontSize: 16,
    fontFamily: AppFonts.bold,
  },
  matchDesc: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontFamily: AppFonts.regular,
  },
  aiCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 20,
  },
  aiLabel: {
    fontSize: 12,
    color: '#27ae60',
    fontFamily: AppFonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  aiText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    lineHeight: 22,
    fontFamily: AppFonts.regular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: AppFonts.bold,
    marginBottom: 10,
  },
  salary: {
    fontSize: 16,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chatBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  chatBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: AppFonts.bold,
  },
});

// ─── Chat Modal ─────────────────────────────────────────────────────────────────

function ChatModal({
  visible,
  context,
  onClose,
}: {
  visible: boolean;
  context?: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: context
        ? `I can help you explore ${context}. What would you like to know?`
        : "Hi! I'm your career advisor. Ask me anything about careers, your match scores, or next steps.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setSending(true);

    try {
      const reply = await sendChatMessage(text, context);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={chatStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={chatStyles.overlay}>
          <Pressable style={chatStyles.backdrop} onPress={onClose} />
          <View style={chatStyles.sheet}>
            {/* Header */}
            <View style={chatStyles.header}>
              <View style={chatStyles.headerInfo}>
                <View style={chatStyles.avatarCircle}>
                  <Text style={chatStyles.avatarText}>✦</Text>
                </View>
                <View>
                  <Text style={chatStyles.headerTitle}>Career Advisor</Text>
                  <Text style={chatStyles.headerSub}>Powered by AI</Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={chatStyles.closeBtn}>
                <Text style={chatStyles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              style={chatStyles.messages}
              contentContainerStyle={chatStyles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    chatStyles.bubble,
                    msg.role === 'user' ? chatStyles.userBubble : chatStyles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      chatStyles.bubbleText,
                      msg.role === 'user' ? chatStyles.userText : chatStyles.aiText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              ))}
              {sending && (
                <View style={[chatStyles.bubble, chatStyles.aiBubble]}>
                  <ActivityIndicator size="small" color="#7c3aed" />
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={chatStyles.inputRow}>
              <TextInput
                style={chatStyles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask about careers, skills, next steps…"
                placeholderTextColor={AppColors.textMuted}
                multiline
                maxLength={500}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                blurOnSubmit
              />
              <Pressable
                style={[chatStyles.sendBtn, (!input.trim() || sending) && chatStyles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!input.trim() || sending}
              >
                <Text style={chatStyles.sendIcon}>↑</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const chatStyles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.overlay,
  },
  sheet: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '88%',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.accentBorder,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#7c3aed',
  },
  headerTitle: {
    fontSize: 16,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  headerSub: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontFamily: AppFonts.regular,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: AppColors.textMuted,
    fontFamily: AppFonts.bold,
  },
  messages: { flex: 1 },
  messagesContent: {
    padding: 20,
    gap: 12,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7c3aed',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: AppFonts.regular,
  },
  userText: { color: '#fff' },
  aiText: { color: AppColors.textSecondary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.accentBorder,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.surfaceMuted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.regular,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: AppColors.accentBorder,
  },
  sendIcon: {
    fontSize: 20,
    color: '#fff',
    fontFamily: AppFonts.bold,
  },
});

// ─── Career Card ───────────────────────────────────────────────────────────────

function CareerCard({ career, onPress }: { career: Career; onPress: () => void }) {
  const color = matchColor(career.matchScore);
  return (
    <Pressable style={cardStyles.card} onPress={onPress}>
      <View style={cardStyles.cardHeader}>
        <View style={cardStyles.cardHeaderLeft}>
          <Text style={cardStyles.cardTitle}>{career.title}</Text>
          <Text style={cardStyles.cardIndustry}>{career.industry}</Text>
        </View>
        <View style={[cardStyles.scoreTag, { backgroundColor: color }]}>
          <Text style={cardStyles.scoreTagText}>{career.matchScore}%</Text>
        </View>
      </View>
      <Text style={cardStyles.cardDesc}>{career.description}</Text>
      <View style={cardStyles.cardFooter}>
        <Text style={cardStyles.salaryLabel}>{career.avgSalary}</Text>
        <Text style={cardStyles.seeMore}>View details →</Text>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardHeaderLeft: { flex: 1, gap: 3 },
  cardTitle: {
    fontSize: 19,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  cardIndustry: {
    fontSize: 12,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: AppFonts.bold,
  },
  scoreTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  scoreTagText: {
    fontSize: 14,
    fontFamily: AppFonts.bold,
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
    fontFamily: AppFonts.regular,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  salaryLabel: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontFamily: AppFonts.regular,
  },
  seeMore: {
    fontSize: 13,
    color: '#7c3aed',
    fontFamily: AppFonts.bold,
  },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  function openChat(career?: Career) {
    setChatContext(career?.title);
    setChatVisible(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Page Header */}
        <Text style={styles.eyebrow}>Career Library</Text>
        <Text style={styles.title}>Your personalized career map</Text>
        <Text style={styles.description}>
          AI-matched careers based on your skills, tasks, and goals. Tap any card to explore your fit.
        </Text>

        {/* Insight Cards */}
        <Text style={styles.sectionLabel}>Insights</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightScroll}
        >
          {INSIGHT_CARDS.map((card) => (
            <InsightCard key={card.id} card={card} />
          ))}
        </ScrollView>

        {/* Career Matches */}
        <Text style={styles.sectionLabel}>Career Matches</Text>
        <View style={styles.cardList}>
          {MOCK_CAREERS.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onPress={() => setSelectedCareer(career)}
            />
          ))}
        </View>

        {/* Bottom spacer so FAB doesn't overlap last card */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Chat Button */}
      <Pressable style={styles.fab} onPress={() => openChat()}>
        <Text style={styles.fabIcon}>💬</Text>
      </Pressable>

      {/* Career Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        onClose={() => setSelectedCareer(null)}
        onChat={(career) => openChat(career)}
      />

      {/* Chat Modal */}
      <ChatModal
        visible={chatVisible}
        context={chatContext}
        onClose={() => {
          setChatVisible(false);
          setChatContext(undefined);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  container: {
    padding: 24,
    gap: 10,
  },
  eyebrow: {
    color: AppColors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: AppFonts.bold,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 30,
    fontFamily: AppFonts.bold,
    marginTop: 2,
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: AppFonts.regular,
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 12,
    color: AppColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: AppFonts.bold,
    marginTop: 10,
    marginBottom: 4,
  },
  insightScroll: {
    paddingBottom: 4,
  },
  cardList: {
    gap: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
});
