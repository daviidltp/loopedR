import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CloseIconProps {
  size?: number;
  color?: string;
}

export const CloseIcon: React.FC<CloseIconProps> = ({ 
  size = 24, 
  color = '#000000' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 