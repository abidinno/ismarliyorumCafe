// Dosya: components/common/UserAvatar.tsx 

import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { widthPixel, heightPixel, fontPixel } from '@/utils/responsive';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}

const UserAvatar = ({ name, avatarUrl, size = 60 }: UserAvatarProps) => {
    // Gelen avatarUrl'i kontrol edip, gerekirse domain ekleyen mantık
    const absoluteAvatarUrl = useMemo(() => {
        if (!avatarUrl || avatarUrl.startsWith('http')) {
            return avatarUrl;
        }
        // Eğer URL '/' ile başlıyorsa, domain'i ekle
        return `https://ismarliyorum.com${avatarUrl}`;
    }, [avatarUrl]);

    const getInitials = (name: string) => {
        if (!name || typeof name !== 'string' || name.trim() === '') return '?';
        
        // Boşlukları temizle ve kelimelere ayır
        const words = name.trim().split(/\s+/);

        if (words.length > 1 && words[0] && words[words.length - 1]) {
            // İlk ve son kelimenin baş harflerini al
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        // Tek kelime varsa veya bir sorun oluşursa, ilk iki harfi al
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(name);
    
    // Dinamik stiller
    const containerStyle = {
        width: widthPixel(size),
        height: heightPixel(size),
        borderRadius: widthPixel(size / 2),
    };
    
    const textStyle = {
        fontSize: fontPixel(size / 2.5),
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {absoluteAvatarUrl  ? (
                <Image source={{ uri: absoluteAvatarUrl  }} style={styles.image} />
            ) : (
                <Text style={[styles.initials, textStyle]}>{initials}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#E0E0E0', // Varsayılan arka plan rengi
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
  },
  image: {
      width: '100%',
      height: '100%',
  },
  initials: {
      color: '#FFFFFF',
      fontFamily: Fonts.family.bold,
  },
});

export default UserAvatar;
