// --- components/icons/HeartsIcon.tsx ---
import React from 'react';
import Svg, { Path } from 'react-native-svg';
export const HeartsIcon = ({ w = 18, h = 24 }) => (
  <Svg width={w} height={h} viewBox="0 0 18 24" fill="none">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.3965 0.721458C6.83701 -1.78504 12.9345 2.60246 4.3965 8.24396C-4.14149 2.60396 1.9575 -1.78504 4.3965 0.721458ZM14.6565 3.41246C16.2825 1.74146 20.349 4.66646 14.6565 8.42696C8.964 4.66646 13.0305 1.74146 14.6565 3.41246ZM8.76 11.463C12.825 7.28396 22.989 14.598 8.76 24C-5.4705 14.598 4.695 7.28396 8.76 11.463Z" fill="white"/>
  </Svg>
);