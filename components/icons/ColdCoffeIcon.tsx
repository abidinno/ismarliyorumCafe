// --- components/icons/ColdCoffeIcon.tsx ---
import React from 'react';
import Svg, { Circle, G, Path, Defs, ClipPath, Rect } from 'react-native-svg';
export const ColdCoffeIcon = ({ color = 'black', size = 24 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="12" fill="white"/>
        <G clipPath="url(#clip0_takeaway)">
            <Path d="M16.2 10.2919H7.79998M16.2 10.2919L15.15 19.7419H9.37498L7.79998 10.2919M16.2 10.2919C16.2 9.17801 15.7575 8.10972 14.9698 7.32207C14.1822 6.53442 13.1139 6.09192 12 6.09192C10.8861 6.09192 9.81778 6.53442 9.03013 7.32207C8.24247 8.10972 7.79998 9.17801 7.79998 10.2919M6.22498 10.2919H17.775" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M11.4932 14.4919L13.3335 5.08043C13.3647 4.94083 13.4241 4.80908 13.5081 4.69326C13.592 4.57744 13.6988 4.48 13.8217 4.40691C13.9447 4.33383 14.0813 4.28664 14.2232 4.26824C14.365 4.24984 14.5092 4.26063 14.6467 4.29993L17.25 5.04193M8.5 14.4919H15.7331" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </G>
        <Defs>
            <ClipPath id="clip0_takeaway">
                <Rect width="16.8" height="16.8" fill="white" transform="translate(3.59998 3.59998)"/>
            </ClipPath>
        </Defs>
    </Svg>
)
