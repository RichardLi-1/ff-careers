import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';

const RESOURCES = [
  {
    title: 'Resume Writing',
    description: 'Build stronger bullet points and tailor your resume to each role.',
  },
  {
    title: 'Interview Practice',
    description: 'Prepare for behavioral and technical questions with a repeatable routine.',
  },
  {
    title: 'Networking',
    description: 'Track outreach and follow up with classmates, mentors, and recruiters.',
  },
];

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Career Library</Text>
        <Text style={styles.title}>Resources to keep your search moving</Text>
        <Text style={styles.description}>
          Save articles, templates, and practice material here so your next step is always easy to find.
        </Text>

        <View style={styles.cardList}>
          {RESOURCES.map((resource) => (
            <View key={resource.title} style={styles.card}>
              <Text style={styles.cardTitle}>{resource.title}</Text>
              <Text style={styles.cardDescription}>{resource.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    gap: 14,
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
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: AppFonts.regular,
  },
  cardList: {
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    color: AppColors.textPrimary,
    fontSize: 20,
    marginBottom: 6,
    fontFamily: AppFonts.bold,
  },
  cardDescription: {
    color: AppColors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: AppFonts.regular,
  },
});
