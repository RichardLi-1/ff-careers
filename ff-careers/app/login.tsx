import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, signInWithGoogle } from '@/services/firebase';
import { AppFonts } from '@/constants/theme';
import { upsertUsers } from '@/services/api';

const GOOGLE_ICON_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  <path fill="none" d="M0 0h48v48H0z"/>
</svg>`
)}`;

export default function LoginScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isNarrow = width < 768;
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
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.layout, isNarrow && styles.layoutNarrow]}>
                    <View style={[styles.left, isNarrow && styles.leftNarrow]}>
                        <View style={styles.leftImageWrap}>
                            <Image
                                source={require('@/assets/images/login_blur.png')}
                                style={styles.leftImage}
                                contentFit="cover"
                            />
                            <View style={styles.leftGradient} />
                        </View>
                    </View>

                    <View style={[styles.rightWrap, isNarrow && styles.rightWrapNarrow]}>
                        <View style={styles.card}>
                            <Text style={styles.title}>FF Careers</Text>
                            <Text style={styles.subtitle}>Sign in to continue</Text>

                            <View style={styles.form}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="rgba(255,255,255,0.55)"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="rgba(255,255,255,0.55)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                {error && <Text style={styles.error}>{error}</Text>}
                                <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                                    <LinearGradient
                                        colors={['#A238B6', '#3E348D']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.signInGradient}>
                                        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                                    </LinearGradient>
                                </Pressable>

                                <View style={styles.dividerRow}>
                                    <View style={styles.divider} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.divider} />
                                </View>

                                <Pressable style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
                                    <View style={styles.googleInner}>
                                        <Image source={{ uri: GOOGLE_ICON_URI }} style={styles.googleMark} contentFit="contain" />
                                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                                    </View>
                                </Pressable>

                                <Text style={styles.terms}>
                                    By signing in, you agree to our <Text style={styles.link}>Terms of Service</Text> and{' '}
                                    <Text style={styles.link}>Privacy Policy</Text>.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#0B0A2B',
    },
    layout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    layoutNarrow: {
        flexDirection: 'column',
    },

    left: {
        flex: 1,
        padding: 0,
    },
    leftNarrow: {
        padding: 0,
    },
    leftImageWrap: {
        flex: 1,
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#120F32',
        position: 'relative',
    },
    leftImage: {
        width: '100%',
        height: '100%',
    },
    leftGradient: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 10, 43, 0.35)',
    },

    rightWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    rightWrapNarrow: {
        alignItems: 'stretch',
        padding: 18,
        paddingTop: 10,
    },
    card: {
        width: '100%',
        maxWidth: 460,
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
    },

    title: {
        fontSize: 30,
        fontFamily: AppFonts.bold,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: AppFonts.regular,
        color: 'rgba(255,255,255,0.72)',
        marginBottom: 26,
    },

    form: {
        width: '100%',
        maxWidth: 360,
        gap: 12,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: AppFonts.regular,
        color: '#FFFFFF',
        borderWidth: 0,
    },
    error: {
        color: '#e74c3c',
        fontSize: 14,
        fontFamily: AppFonts.regular,
        textAlign: 'center',
    },
    button: {
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 4,
        overflow: 'hidden',
    },
    signInGradient: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
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
        backgroundColor: 'rgba(255,255,255,0.18)',
    },
    dividerText: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
        fontFamily: AppFonts.regular,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#747775',
        borderRadius: 4,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: 40,
        maxWidth: 400,
        minWidth: 260,
        width: '100%',
        paddingHorizontal: 12,
    },
    googleInner: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    googleMark: {
        width: 20,
        height: 20,
    },
    googleButtonText: {
        color: '#1f1f1f',
        fontSize: 14,
        fontFamily: AppFonts.regular,
    },
    terms: {
        color: 'rgba(255,255,255,0.62)',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: AppFonts.regular,
        marginTop: 4,
        textAlign: 'center',
    },
    link: {
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
});
