import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
  size?: number;
  color?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ 
  size = 20, 
  color = '#1DB954' 
}) => {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <Path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 