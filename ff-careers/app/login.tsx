import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, signInWithGoogle } from '@/services/firebase';
import { AppColors, AppFonts } from '@/constants/theme';
import { upsertUsers } from '@/services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError(null);
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            upsertUsers();
            router.replace('/');
        } catch {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            upsertUsers();
            router.replace('/');
        } catch {
            setError('Google sign in failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>FF</Text>
                </View>
                <Text style={styles.title}>FF Careers</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={AppColors.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={AppColors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {error && <Text style={styles.error}>{error}</Text>}
                    <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                    </Pressable>

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                    </View>

                    <Pressable style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </Pressable>
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
        padding: 32,
    },
    logoCircle: {
        height: 72,
        width: 72,
        borderRadius: 36,
        backgroundColor: AppColors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 24,
        fontFamily: AppFonts.bold,
        color: AppColors.textSecondary,
    },
    title: {
        fontSize: 28,
        fontFamily: AppFonts.bold,
        color: AppColors.textPrimary,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: AppFonts.regular,
        color: AppColors.textMuted,
        marginBottom: 36,
    },
    form: {
        width: '100%',
        maxWidth: 360,
        gap: 12,
    },
    input: {
        backgroundColor: AppColors.surface,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        fontFamily: AppFonts.regular,
        color: AppColors.textPrimary,
        borderWidth: 1,
        borderColor: AppColors.accentBorder,
    },
    error: {
        color: '#e74c3c',
        fontSize: 14,
        fontFamily: AppFonts.regular,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#7c3aed',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 17,
        fontFamily: AppFonts.bold,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    divider: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: AppColors.accentBorder,
    },
    dividerText: {
        color: AppColors.textMuted,
        fontSize: 14,
        fontFamily: AppFonts.regular,
    },
    googleButton: {
        backgroundColor: AppColors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: AppColors.accentBorder,
    },
    googleButtonText: {
        color: AppColors.textPrimary,
        fontSize: 17,
        fontFamily: AppFonts.bold,
    },
});
