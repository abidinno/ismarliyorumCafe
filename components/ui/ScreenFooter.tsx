import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledButton from './StyledButton'; // Yolu doğrulayın
import { Colors } from '@/constants/Colors'; // Yolu doğrulayın

interface ScreenFooterProps {
  onNext: () => void;
  isNextDisabled: boolean;
  title: string; // "Vazgeç" butonu kaldırıldığı için genel bir başlık prop'u eklendi
}

const ScreenFooter: React.FC<ScreenFooterProps> = ({ onNext, isNextDisabled, title }) => {
  return (
    <View style={styles.footerContainer}>
      <StyledButton title={title} onPress={onNext} disabled={isNextDisabled} size='sm' />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    padding: 14,
    paddingBottom: 30, // Alt boşluk (iPhone'lar için)
    backgroundColor: Colors.light.background,
  },
});

export default ScreenFooter;
