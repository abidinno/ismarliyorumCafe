// --- components/icons/MapsIcon.tsx ---
import React from 'react';
import Svg, { Path } from 'react-native-svg';
export const MapsIcon = ({ w = 25, h = 24 }) => (
  <Svg width={w} height={h} viewBox="0 0 25 24" fill="none">
    <Path d="M15 9.5H15.009M15.629 13.747C15.4602 13.9099 15.2347 14.0009 15 14.0009C14.7654 14.0009 14.5399 13.9099 14.371 13.747C12.827 12.25 10.758 10.579 11.767 8.152C12.0365 7.51648 12.4864 6.97391 13.061 6.59142C13.6356 6.20894 14.3098 6.00331 15 6C16.378 6 17.688 6.84 18.233 8.152C19.241 10.576 17.177 12.256 15.629 13.747Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <Path d="M17.5 21L3.5 7M10.5 14L4.5 20M3 12C3 7.522 3 5.282 4.391 3.891C5.782 2.5 8.021 2.5 12.5 2.5C16.978 2.5 19.218 2.5 20.609 3.891C22 5.282 22 7.521 22 12C22 16.478 22 18.718 20.609 20.109C19.218 21.5 16.979 21.5 12.5 21.5C8.022 21.5 5.782 21.5 4.391 20.109C3 18.718 3 16.479 3 12Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </Svg>
);
