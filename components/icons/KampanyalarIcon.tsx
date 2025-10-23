
// --- components/icons/KampanyalarIcon.tsx ---
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number; // Opsiyonel olduğunu belirtmek için '?' ekliyoruz
}

export const KampanyalarIcon = ({ color, size = 21 }: IconProps) => (
    <Svg width={size} height={size*(20/21)} viewBox="0 0 21 20" fill="none">
        <Path d="M10.5 19V10M10.5 5H6.45C3.68 5 3.51 1 6.45 1C9.6 1 10.5 5 10.5 5ZM10.5 5H14.55C17.446 5 17.446 1 14.55 1C11.4 1 10.5 5 10.5 5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M18.5 10V17C18.5 17.5304 18.2893 18.0391 17.9142 18.4142C17.5391 18.7893 17.0304 19 16.5 19H4.5C3.96957 19 3.46086 18.7893 3.08579 18.4142C2.71071 18.0391 2.5 17.5304 2.5 17V10M19.5 10V7C19.5 6.46957 19.2893 5.96086 18.9142 5.58579C18.5391 5.21071 18.0304 5 17.5 5H3.5C2.96957 5 2.46086 5.21071 2.08579 5.58579C1.71071 5.96086 1.5 6.46957 1.5 7V10H19.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
);