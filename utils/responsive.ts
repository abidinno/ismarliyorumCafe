// utils/responsive.ts

import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Tasarımın yapıldığı referans ekran boyutları (örneğin iPhone 11)
const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;

function normalize(size: number, based: 'width' | 'height' = 'width') {
  const newSize = (based === 'height') ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Genişliğe göre boyutlandırma için
export const widthPixel = (size: number) => {
  return normalize(size, 'width');
};

// Yüksekliğe göre boyutlandırma için
export const heightPixel = (size: number) => {
  return normalize(size, 'height');
};

// Yazı tipi boyutlandırması için
export const fontPixel = (size: number) => {
  // DÜZELTME: Fontları yüksekliğe göre değil, her zaman genişliğe göre ölçekle.
  // Bu, farklı en/boy oranlarına sahip cihazlarda tutarlılık sağlar.
  return widthPixel(size);
};

// Genişlik yüzdesi için
export const widthPercentage = (percent: number) => {
    return (SCREEN_WIDTH * percent) / 100;
};

// Yükseklik yüzdesi için
export const heightPercentage = (percent: number) => {
    return (SCREEN_HEIGHT * percent) / 100;
};