import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [fontsLoaded] = useFonts({
    'Glacial Indifference': require('../assets/fonts/GlacialIndifference-Regular.otf'),
    'Glacial Indifference Bold': require('../assets/fonts/GlacialIndifference-Bold.otf'),
  });

  useEffect(() => {
    if (!fontsLoaded || authLoading) return;
    const inAuthGroup = segments[0] === 'login';
    if (!user && !inAuthGroup) router.replace('/login');
    if (user && inAuthGroup) router.replace('/');
  }, [user, authLoading, fontsLoaded, segments]);

  if (!fontsLoaded || authLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
