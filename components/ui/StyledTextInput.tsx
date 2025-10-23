// componnets/ui/StyledTextInput.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { widthPixel, heightPixel, fontPixel, widthPercentage } from '@/utils/responsive';

// Bileşenin hangi türde veri kontrolü yapacağını belirtiyoruz
type ValidationType = 'text' | 'email' | 'phone' | 'password';

interface StyledTextInputProps extends TextInputProps {
  label: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  validationType?: ValidationType;
  error?: string | null;
  onValidatedChange?: (value: string, isValid: boolean) => void;
}

const StyledTextInput = ({
  label,
  iconName,
  validationType = 'text',
  onChangeText,
  onValidatedChange, 
  onBlur,
  value,
  error,
  ...props
}: StyledTextInputProps) => {
  const [isFocused, setFocused] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const applyPhoneMask = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.substring(0, 10).match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ').trim();
  };

  const displayValue = useMemo(() => {
    if (validationType === 'phone') {
      return applyPhoneMask(value || '');
    }
    return value || '';
  }, [value, validationType]);
  
  const validate = (text: string): { isValid: boolean; message: string | null } => {
    const safeText = text || '';
    let isValid = true;
    let message: string | null = null;

    switch (validationType) {
      case 'text':
        const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/;
        if (safeText.trim().length > 0) {
          if (!nameRegex.test(safeText)) {
            isValid = false;
            message = 'Bu alanda sadece harf kullanılabilir.';
          } else if (safeText.trim().length < 2) {
            isValid = false;
            message = 'Bu alan en az 2 karakter olmalıdır.';
          }
        } else {
          isValid = false;
        }
        break;
      case 'email':
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (safeText.trim().length > 0) {
          if (!emailRegex.test(safeText)) {
            isValid = false;
            message = 'Lütfen geçerli bir e-posta adresi girin.';
          }
        } else {
          isValid = false;
        }
        break;
      case 'phone':
        if (safeText.trim().length > 0) {
          if (safeText.length < 10) {
            isValid = false;
            message = 'Telefon numarası 10 haneli olmalıdır.';
          }
        } else {
          isValid = false;
        }
        break;
      case 'password':
        // Şifre boş mu diye kontrol et
        if (!safeText) {
            isValid = false;
            message = 'Şifre alanı boş bırakılamaz.';
        } 
        // 1. Kural: Uzunluk kontrolü (8 karaktere çıkardım)
        else if (safeText.length < 8) {
            isValid = false;
            message = 'Şifre en az 8 karakter uzunluğunda olmalıdır.';
        } 
        // 2. Kural: Büyük harf içeriyor mu?
        else if (!/[A-Z]/.test(safeText)) {
            isValid = false;
            message = 'Şifre en az bir büyük harf içermelidir.';
        } 
        // 3. Kural: Küçük harf içeriyor mu?
        else if (!/[a-z]/.test(safeText)) {
            isValid = false;
            message = 'Şifre en az bir küçük harf içermelidir.';
        } 
        // 4. Kural: Rakam içeriyor mu?
        else if (!/[0-9]/.test(safeText)) {
            isValid = false;
            message = 'Şifre en az bir rakam içermelidir.';
        } 
        // 5. Kural: Özel karakter içeriyor mu?
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(safeText)) {
            isValid = false;
            message = 'Şifre en az bir özel karakter (!@#$ vb.) içermelidir.';
        } 
        // Tüm kurallardan geçtiyse
        else {
            isValid = true;
            message = ''; // Mesajı temizle
        }
        break;
    }
    
    return { isValid, message };

  };

  const handleBlur = (e: any) => {
    const { message } = validate(value || '');
    // Hata mesajını SADECE bu anda ayarla
    setInternalError(message);

    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleFocus = () => {
    setFocused(true);
    setInternalError(null);
  };
  
  const handleChange = (text: string) => {
    let rawValue = text;
    if (validationType === 'phone') {
      rawValue = text.replace(/[^0-9]/g, '').substring(0, 10);
    }
    
    const { isValid } = validate(rawValue);
    
    if (onChangeText) {
      onChangeText(rawValue);
    }
    
if (onValidatedChange) {
        onValidatedChange(rawValue, isValid);
    }
  }

  const keyboardType = validationType === 'phone' ? 'phone-pad' : validationType === 'email' ? 'email-address' : 'default';
  const finalErrorMessage = error || internalError;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
          styles.inputContainer, 
          isFocused && styles.inputContainerFocused,
          finalErrorMessage && styles.inputContainerError
        ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#A9A9A9"
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={displayValue}
          keyboardType={keyboardType}
          // GÜNCELLEME: Şifre alanlarını gizliyoruz
          secureTextEntry={validationType === 'password' && !isPasswordVisible}
          {...props}
        />
        {/* GÜNCELLEME: Şifre alanı için göster/gizle ikonu ekliyoruz */}
        {validationType === 'password' ? (
          <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={fontPixel(22)} 
              color={isFocused ? Colors.light.oneCo : Colors.light.icon} 
              style={styles.icon} 
            />
          </TouchableOpacity>
        ) : (
          iconName && <Ionicons name={iconName} size={fontPixel(22)} color={isFocused ? Colors.light.oneCo : Colors.light.icon} style={styles.icon} />
        )}
      </View>
      {finalErrorMessage && <Text style={styles.errorText}>{finalErrorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 15,
      },
      label: {
        fontFamily: Fonts.family.regular,
        fontSize: fontPixel(12),
        color: '#888',
        marginBottom: heightPixel(5),
        marginLeft: widthPixel(10),
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 15,
        paddingHorizontal: widthPixel(15),
      },
      inputContainerFocused: {
        borderColor: Colors.light.oneCo,
      },
      inputContainerError: {
        borderColor: '#D32F2F',
      },
      input: {
        flex: 1,
        height: heightPixel(45),
        fontFamily: Fonts.family.regular,
        fontSize: fontPixel(Fonts.size.xs),
        color: Colors.light.text,
      },
      icon: {
        marginLeft: 10,
      },
      errorText: {
        fontFamily: Fonts.family.regular,
        fontSize: fontPixel(10),
        color: '#D32F2F',
        marginTop: 5,
        marginLeft: 10,
      }
});

export default StyledTextInput;
