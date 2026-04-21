import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/services/firebase';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? '?').toUpperCase();

  async function handleLogout() {
    await signOut(auth);
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'Your Profile'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Account</Text>
            <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>Getting set up</Text>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
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
    padding: 24,
    paddingTop: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.accentSoft,
    marginBottom: 14,
  },
  avatarText: {
    color: AppColors.textSecondary,
    fontSize: 28,
    fontFamily: AppFonts.bold,
  },
  name: {
    color: AppColors.textPrimary,
    fontSize: 26,
    marginBottom: 4,
    fontFamily: AppFonts.bold,
  },
  email: {
    color: AppColors.textMuted,
    fontSize: 15,
    fontFamily: AppFonts.regular,
    marginBottom: 28,
  },
  section: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 28,
  },
  infoCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoLabel: {
    color: AppColors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: AppFonts.bold,
  },
  infoValue: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontFamily: AppFonts.regular,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: AppColors.accentSoft,
    borderWidth: 1,
    borderColor: AppColors.accentBorder,
  },
  logoutText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.bold,
  },
});
