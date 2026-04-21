import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';

const TABS = [
  { label: 'To Do', path: '/' },
  { label: 'Library', path: '/library' },
  { label: 'Profile', path: '/profile' },
];

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' || pathname === '/index' : pathname === path;

  const inner = (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>FF</Text>
        </View>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>Loading...</Text>
        </View>
      </View>

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

      <View style={styles.settingsWrap}>
        <Pressable onPress={() => setShowSettings((v) => !v)} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
        {showSettings && (
          <View style={styles.settingsMenu}>
            <Pressable style={styles.menuItem}>
              <Text style={styles.menuItemText}>Log Out</Text>
            </Pressable>
          </View>
        )}
      </View>
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
    borderRadius: 10,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 8,
    minWidth: 120,
    zIndex: 100,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
});
