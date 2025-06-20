import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CrossIconProps {
  size?: number;
  color?: string;
}

export const CrossIcon: React.FC<CrossIconProps> = ({ 
  size = 20, 
  color = '#fa233b' 
}) => {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <Path
        d="M18 6L6 18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6L18 18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 