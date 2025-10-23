import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
  details?: string;
}

const EmptyState = ({ icon, message, details }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={60} color="#D0D0D0" />
      <Text style={styles.message}>{message}</Text>
      {details && <Text style={styles.details}>{details}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 50, // İçeriği biraz yukarı taşımak için
  },
  message: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.lg,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  details: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.md,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
