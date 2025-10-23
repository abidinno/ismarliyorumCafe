import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import StyledButton from './StyledButton';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { fontPixel } from '@/utils/responsive';

const { height: screenHeight } = Dimensions.get('window');

interface ModalButtonProps {
  text: string;
  onPress: () => void;
}

interface StyledModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButton?: ModalButtonProps;
  secondaryButton?: ModalButtonProps;
}

const StyledModal = ({
  visible,
  onClose,
  title,
  message,
  primaryButton,
  secondaryButton,
}: StyledModalProps) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            {primaryButton && (
              <StyledButton title={primaryButton.text} onPress={primaryButton.onPress} />
            )}
            {secondaryButton && (
              <TouchableOpacity onPress={secondaryButton.onPress}>
                <Text style={styles.secondaryButtonText}>{secondaryButton.text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.family.bold,
    fontSize: fontPixel(Fonts.size.lg),
    color: Colors.light.text,
    marginBottom: 12,
  },
  message: {
    fontFamily: Fonts.family.regular,
    fontSize: fontPixel(Fonts.size.md),
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  secondaryButtonText: {
    fontFamily: Fonts.family.bold,
    fontSize: fontPixel(Fonts.size.sm),
    color: '#888',
    marginTop: 16,
  },
});

export default StyledModal;