import { ImageSourcePropType } from 'react-native';

// 1. Cloud adresin (veya process.env.EXPO_PUBLIC_API_URL vb.)
const BASE_IMAGE_URL = "https://cloud.ismarliyorum.com"; 

// 2. Placeholder resmi (Assets klasöründe olduğundan emin ol)
// require() React Native'de 'number' tipinde bir ID döndürür.
const PLACEHOLDER_IMAGE = require('../assets/images/no-image.png');

/**
 * Veritabanı yolunu React Native Image kaynağına çevirir.
 * @param path - DB'den gelen string, null veya undefined olabilir.
 */
export const getImageUrl = (path: string | null | undefined): ImageSourcePropType => {
  // A. Veri yoksa -> Local Placeholder döndür
  if (!path) {
    return PLACEHOLDER_IMAGE;
  }

  // B. Zaten tam link ise (örn: Google login fotosu)
  if (path.startsWith('http') || path.startsWith('https')) {
    return { uri: path };
  }

  // C. Bizim sunucudaki resim ise -> Cloud URL ile birleştir
  // Başındaki olası "/" işaretini temizle
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return { uri: `${BASE_IMAGE_URL}/${cleanPath}` };
};