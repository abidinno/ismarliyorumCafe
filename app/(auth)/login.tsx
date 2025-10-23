import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import IsmarliyorumLogo from '@/components/IsmarliyorumLogo';
import StyledButton from '@/components/ui/StyledButton';
import StyledTextInput from '@/components/ui/StyledTextInput';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { widthPixel } from '@/utils/responsive';

import { useAuth } from '@/context/AuthContext'; // useAuth'u import et

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth(); // login fonksiyonunu context'ten al
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            // GÜNCELLEME: Artık context'teki login fonksiyonunu çağırıyoruz
            await login({ email, password });
            
            // Yönlendirme artık login fonksiyonunun içinde yapılıyor.
            
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false, // Bu satır bu sayfanın header'ını kapatır
                }}
            />
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="dark" />
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <View style={styles.logoContainer}>
                        <IsmarliyorumLogo 
                            variant="color" 
                            width={widthPixel(200)} 
                            height={widthPixel(200) * 0.3}
                        />
                        <Text style={styles.headerTitle}>Mağaza Paneli</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <StyledTextInput 
                            label="E-posta Adresi"
                            value={email}
                            onValidatedChange={(value) => setEmail(value)}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            validationType="email"
                            iconName="mail-outline"
                        />
                        <StyledTextInput 
                            label="Şifre"
                            value={password}
                            onValidatedChange={(value) => setPassword(value)}
                            textContentType="password"
                            secureTextEntry
                            validationType="password"
                            iconName="lock-closed-outline"
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <StyledButton 
                            title="Giriş Yap"
                            variant="primary"
                            onPress={handleLogin}
                            disabled={isLoading}
                        />
                        {isLoading && <ActivityIndicator style={{ marginTop: 15 }} color={Colors.light.oneCo} />}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Yardıma mı ihtiyacın var?</Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontFamily: Fonts.family.bold,
        fontSize: 24,
        color: Colors.light.text,
        marginTop: 16,
    },
    formContainer: {
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontFamily: Fonts.family.regular,
        textAlign: 'center',
        marginTop: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        fontFamily: Fonts.family.semibold,
        color: Colors.light.oneCo,
        fontSize: 14,
    },
});