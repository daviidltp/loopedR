import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowLeftIconProps {
  size?: number;
  color?: string;
  weight?: number;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  size = 24, 
  color = '#000000',
  weight = 2
}) => {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <Path
        stroke="none"
        d="M0 0h24v24H0z"
        fill="none"
      />
      <Path
        d="M5 12l16 0"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12l6 6"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12l6 -6"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 