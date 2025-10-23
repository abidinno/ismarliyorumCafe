import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, type TouchableOpacityProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { widthPixel, heightPixel, fontPixel, widthPercentage } from '@/utils/responsive';


interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg'; // 'sm', 'md', 'lg' boyutları
  icon?: React.ReactNode;
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
    ...props 
}: StyledButtonProps) => {

  const buttonVariantStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textVariantStyle = variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;

  const buttonSizeStyle = sizeStyles[size].button;
  const textSizeStyle = sizeStyles[size].text;

  return (
    <TouchableOpacity
        style={[
            styles.button,
            buttonVariantStyle,
            buttonSizeStyle,
            disabled && styles.disabledButtonStyle
        ]}
        disabled={disabled}
        {...props}
      >
        {/* İkon varsa göster */}
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <Text style={[
            styles.buttonText,
            textVariantStyle,
            textSizeStyle
        ]}>
            {title}
        </Text>
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
