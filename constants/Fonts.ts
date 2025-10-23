import { fontPixel } from '@/utils/responsive'; // Yeni yardımcımızı import et

export const Fonts = {
  family: {
    regular: 'Mulish-Regular',
    bold: 'Mulish-Bold', 
    semibold: 'Mulish-SemiBold', 
    light: 'Mulish-Light', 
  },
  single: {
    regular: 'GeneralSans-Regular', 
  },
  size: {
    xs: fontPixel(8), 
    sm: fontPixel(10), 
    md: fontPixel(12), 
    lg: fontPixel(14), 
    xl: fontPixel(16), 
    xxl: fontPixel(20),
  },
};