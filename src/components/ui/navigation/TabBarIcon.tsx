import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

// Importar los iconos SVG
import AddFilledIcon from '@assets/icons/add_filled.svg';
import HeartIcon from '@assets/icons/heart.svg';
import HeartFilledIcon from '@assets/icons/heart_filled.svg';
import HouseIcon from '@assets/icons/house.svg';
import HouseFilledIcon from '@assets/icons/house_filled.svg';
import SearchIcon from '@assets/icons/search.svg';
import SearchFilledIcon from '@assets/icons/search_filled.svg';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
}

// Componente CircleAvatar para el perfil
const CircleAvatar = ({ focused }: { focused: boolean }) => (
  <View style={[
    styles.avatarContainer,
    { opacity: focused ? 1 : 0.6 }
  ]}>
    <View style={styles.avatarInner} />
  </View>
);

export const TabBarIcon = ({ routeName, focused }: TabBarIconProps) => {
  let IconComponent;
  let iconSize = 22;
  const opacity = focused ? 1 : 0.6;

  switch (routeName) {
    case 'Home':
      IconComponent = focused ? HouseFilledIcon : HouseIcon;
      break;
    case 'Search':
      IconComponent = focused ? SearchFilledIcon : SearchIcon;
      break;
    case 'Upload':
      IconComponent = AddFilledIcon; // Siempre filled para el especial
      iconSize = 32;
      break;
    case 'Inbox':
      IconComponent = focused ? HeartFilledIcon : HeartIcon;
      break;
    case 'Profile':
      return <CircleAvatar focused={focused} />;
    default:
      IconComponent = HouseIcon;
  }

  return (
    <View style={[styles.iconWrapper, { opacity }]}>
      <IconComponent
        width={iconSize}
        height={iconSize}
        fill={Colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 32,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray[400],
  },
}); 