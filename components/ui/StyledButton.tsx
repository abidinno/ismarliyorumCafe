import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, type TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { widthPixel, heightPixel, fontPixel } from '@/utils/responsive';

// 1. isLoading özelliğini buraya ekliyoruz
interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean; // <-- EKLENDİ
}

const sizeStyles = {
    sm: {
        button: { paddingVertical: heightPixel(10) },
        text: { fontSize: fontPixel(Fonts.size.sm) },
    },
    md: {
        button: { paddingVertical: heightPixel(16) },
        text: { fontSize: fontPixel(Fonts.size.md) },
    },
    lg: {
        button: { paddingVertical: heightPixel(20) },
        text: { fontSize: fontPixel(Fonts.size.lg) },
    }
};

const StyledButton = ({ 
    title, 
    variant = 'primary', 
    size = 'md', 
    icon, 
    disabled, 
    isLoading = false, // 2. Varsayılan değeri atıyoruz
    ...props 
}: StyledButtonProps) => {

  const buttonVariantStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textVariantStyle = variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;
  
  // Spinner rengini butona göre ayarlıyoruz (Primary ise beyaz, Secondary ise turuncu)
  const spinnerColor = variant === 'primary' ? '#fff' : Colors.light.oneCo;

  const buttonSizeStyle = sizeStyles[size].button;
  const textSizeStyle = sizeStyles[size].text;

  return (
    <TouchableOpacity
        style={[
            styles.button,
            buttonVariantStyle,
            buttonSizeStyle,
            // 3. Yüklenirken veya disabled ise opaklığı düşür
            (disabled || isLoading) && styles.disabledButtonStyle
        ]}
        disabled={disabled || isLoading} // 4. Yüklenirken tıklamayı engelle
        {...props}
      >
        {/* 5. Yükleniyorsa Spinner, değilse İkon ve Yazı göster */}
        {isLoading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
            <>
                {icon && <View style={styles.iconWrapper}>{icon}</View>}
                <Text style={[
                    styles.buttonText,
                    textVariantStyle,
                    textSizeStyle
                ]}>
                    {title}
                </Text>
            </>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: widthPixel(20),
  },
  disabledButtonStyle: {
    opacity: 0.5,
  },
  iconWrapper: {
    marginRight: 8,
  },
  buttonText: {
    fontFamily: Fonts.family.regular,
  },
  primaryButton: {
    backgroundColor: Colors.light.oneCo, 
  },
  primaryButtonText: {
    color: '#fff', 
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.oneCo,
  },
  secondaryButtonText: {
    color: Colors.light.oneCo,
  },
});

export default StyledButton;