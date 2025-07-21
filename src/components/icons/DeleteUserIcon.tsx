import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DeleteUserIconProps {
  size?: number;
  color?: string;
}

export const DeleteUserIcon: React.FC<DeleteUserIconProps> = ({ 
  size = 24, 
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
        d="M9 12a6 6 0 1 0 -6-6 6.006 6.006 0 0 0 6 6zm0-10a4 4 0 1 1 -4 4 4 4 0 0 1 4-4zm9 21a1 1 0 0 1 -2 0 7 7 0 0 0 -14 0 1 1 0 0 1 -2 0 9 9 0 0 1 18 0zm5.707-8.707a1 1 0 1 1 -1.414 1.414l-1.793-1.793-1.793 1.793a1 1 0 0 1 -1.414-1.414l1.793-1.793-1.793-1.793a1 1 0 0 1 1.414-1.414l1.793 1.793 1.793-1.793a1 1 0 0 1 1.414 1.414l-1.793 1.793z"
        fill={color}
      />
    </Svg>
  );
}; 