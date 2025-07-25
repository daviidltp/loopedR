import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HeartIconProps {
  size?: number;
  color?: string;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ 
  size = 24, 
  color = '#fff' 
}) => {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="1 1 22.00 22.00" 
      fill="none"
    >
      <Path
        d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
        fill={color}
      />
    </Svg>
  );
}; 