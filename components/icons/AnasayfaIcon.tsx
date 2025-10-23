// --- components/icons/AnasayfaIcon.tsx ---
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color: string;
    size?: number; // Opsiyonel olduğunu belirtmek için '?' ekliyoruz
}

export const AnasayfaIcon = ({ color, size = 25 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
    <Path d="M21.5 19.24V12.507C21.5 11.9645 21.3896 11.4276 21.1756 10.929C20.9616 10.4305 20.6483 9.98068 20.255 9.607L13.878 3.55C13.5063 3.19689 13.0132 3 12.5005 3C11.9878 3 11.4947 3.19689 11.123 3.55L4.745 9.607C4.35165 9.98068 4.03844 10.4305 3.8244 10.929C3.61037 11.4276 3.5 11.9645 3.5 12.507V19.24C3.5 19.7704 3.71071 20.2791 4.08579 20.6542C4.46086 21.0293 4.96957 21.24 5.5 21.24H19.5C20.0304 21.24 20.5391 21.0293 20.9142 20.6542C21.2893 20.2791 21.5 19.7704 21.5 19.24Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);