import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuth } from '@/hooks/use-auth';
import { AppColors, AppFonts } from '@/constants/theme';

const TABS = [
  { label: 'To Do', path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Profile', path: '/profile' },
];

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  async function handleLogout() {
    await signOut(auth);
    router.replace('/login');
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' || pathname === '/index' : pathname === path;

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? '?').toUpperCase();

  const inner = (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>FF</Text>
        </View>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{user?.displayName ?? user?.email ?? 'Loading...'}</Text>
        </View>
      </View>

      {!isMobile && (
        <View style={styles.navRow}>
          {TABS.map((tab) => (
            <Pressable key={tab.path} onPress={() => router.navigate(tab.path as any)} style={styles.navButton}>
              <Text style={[styles.navText, isActive(tab.path) && styles.navTextActive]}>
                {tab.label}
              </Text>
              {isActive(tab.path) && <View style={styles.indicator} />}
            </Pressable>
          ))}
        </View>
      )}

      {!isMobile && (
        <View style={styles.settingsWrap}>
          <Pressable onPress={() => setShowSettings((v) => !v)} style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
          {showSettings && (
            <View style={styles.settingsMenu}>
              <View style={styles.popupProfile}>
                <View style={styles.popupAvatar}>
                  <Text style={styles.popupAvatarText}>{initials}</Text>
                </View>
                <View style={styles.popupInfo}>
                  <Text style={styles.popupName}>{user?.displayName ?? 'Profile'}</Text>
                  <Text style={styles.popupEmail}>{user?.email ?? ''}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuItemText}>Log Out</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={70} tint="light" style={styles.container}>
        {inner}
      </BlurView>
    );
  }

  return <View style={[styles.container, styles.fallback]}>{inner}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212, 170, 255, 0.4)',
  },
  fallback: {
    backgroundColor: AppColors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  logoCircle: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: AppColors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 15,
    fontFamily: AppFonts.bold,
    color: AppColors.textSecondary,
  },
  greeting: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
  name: {
    fontSize: 18,
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  navRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  navText: {
    fontSize: 17,
    color: AppColors.textMuted,
    fontFamily: AppFonts.regular,
  },
  navTextActive: {
    color: '#7c3aed',
    fontFamily: AppFonts.bold,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#7c3aed',
  },
  settingsWrap: {
    position: 'relative',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  settingsButton: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 22,
    color: AppColors.textSecondary,
  },
  settingsMenu: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    padding: 8,
    minWidth: 200,
    zIndex: 100,
  },
  popupProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  popupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupAvatarText: {
    fontSize: 15,
    fontFamily: AppFonts.bold,
    color: AppColors.textSecondary,
  },
  popupInfo: {
    flex: 1,
  },
  popupName: {
    fontSize: 15,
    fontFamily: AppFonts.bold,
    color: AppColors.textPrimary,
  },
  popupEmail: {
    fontSize: 13,
    fontFamily: AppFonts.regular,
    color: AppColors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.accentBorder,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  menuItem: {
    padding: 10,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
});
