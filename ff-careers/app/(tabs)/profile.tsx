import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RL</Text>
        </View>
        <Text style={styles.name}>Your Profile</Text>
        <Text style={styles.subtitle}>Track progress, update preferences, and manage account details here.</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>Getting set up</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.accentSoft,
    marginBottom: 18,
  },
  avatarText: {
    color: AppColors.textSecondary,
    fontSize: 28,
    fontFamily: AppFonts.bold,
  },
  name: {
    color: AppColors.textPrimary,
    fontSize: 28,
    marginBottom: 8,
    fontFamily: AppFonts.bold,
  },
  subtitle: {
    color: AppColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: AppFonts.regular,
  },
  infoCard: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoLabel: {
    color: AppColors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: AppFonts.bold,
  },
  infoValue: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontFamily: AppFonts.regular,
  },
});
