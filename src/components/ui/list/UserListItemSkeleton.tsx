import { Skeleton } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const UserListItemSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Avatar skeleton */}
      <Skeleton
        animation="wave"
        circle
        width={56}
        height={56}
        style={{ backgroundColor: Colors.backgroundSoft }}
        skeletonStyle={{ backgroundColor: Colors.backgroundUltraSoft }}
      />
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
          <Skeleton  width={90} height={16}         
          style={{ backgroundColor: Colors.backgroundSoft }}
          skeletonStyle={{ backgroundColor: Colors.backgroundUltraSoft }} 
          animation="wave" />
        </View>
        <Skeleton width={120} height={14} 
        style={{ backgroundColor: Colors.backgroundSoft }} 
        skeletonStyle={{ backgroundColor: Colors.backgroundUltraSoft }}
        animation="wave" />
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