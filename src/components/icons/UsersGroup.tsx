import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface UsersGroupProps {
  size?: number;
  color?: string;
}

export const UsersGroup: React.FC<UsersGroupProps> = ({
  size = 24,
  color = '#ffffff',
}) => (
  <Svg width={size} height={size} viewBox="-1 -1 26 26">
  <Path d="m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm6.5 11h-13a1 1 0 0 1 -1-1v-.5a7.5 7.5 0 0 1 15 0v.5a1 1 0 0 1 -1 1zm3.5-15a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm-1.421 2.021a6.825 6.825 0 0 0 -4.67 2.831 9.537 9.537 0 0 1 4.914 5.148h6.677a1 1 0 0 0 1-1v-.038a7.008 7.008 0 0 0 -7.921-6.941z" 
    fill={color}
    stroke={color}
    strokeWidth={1.5}
/>
</Svg>
); 