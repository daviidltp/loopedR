import { Skeleton } from "moti/skeleton";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const UserListItemSkeleton: React.FC = () => {

  const LinearGradient = require('react-native-svg').LinearGradient;
  
  return (
    <View style={styles.container}>
      {/* Avatar skeleton */}
      <Skeleton
      colorMode="dark"
      width={56} // Percentage, number, or 'auto'
      height={56} // Number (e.g., fontSize)
      radius="round"
    />
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
        <Skeleton
      colorMode="dark"
      width={200} // Percentage, number, or 'auto'
      height={20} // Number (e.g., fontSize)
      radius="square"
    />
        </View>
        <Skeleton
      colorMode="dark"
      width={100} // Percentage, number, or 'auto'
      height={20} // Number (e.g., fontSize)
      radius="square"
    />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    borderRadius: 28,
    backgroundColor: Colors.backgroundSoft,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 6,
  },
  username: {
    marginRight: 6,
    borderRadius: 4,
  },
  verifiedIcon: {
    marginRight: 6,
    borderRadius: 8,
  },
  siguiendoText: {
    marginLeft: 2,
    borderRadius: 4,
  },
  displayName: {
    opacity: 0.8,
    borderRadius: 4,
    marginTop: 4,
    backgroundColor: Colors.backgroundSoft,
  },
}); 