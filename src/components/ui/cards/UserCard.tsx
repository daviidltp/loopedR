import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';
import { ResizingButton } from '../buttons/ResizingButton';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  onFollowPress: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onFollowPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <AppText 
            variant='body'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.displayName}
          >
            {user.displayName}
          </AppText>
          {user.isVerified && (
            <Image 
              source={verifiedBlue} 
              style={styles.verifiedIcon}
            />
          )}
        </View>
        
        <AppText 
          variant='bodySmall'
          fontFamily="inter" 
          fontWeight="regular" 
          color={Colors.mutedWhite}
          style={styles.username}
        >
          @{user.username}
        </AppText>
      </View>

      {/* Botón seguir */}
      <ResizingButton
        title="Seguir"
        onPress={() => onFollowPress(user.id)}
        backgroundColor={Colors.white}
        textColor={Colors.background}
        height={42}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 200,
    height: 260,
    marginRight: 0,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 70,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    marginBottom: 0,
    gap: 0,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'center',
  },
  displayName: {
    textAlign: 'center',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  username: {
    textAlign: 'center',
  },
}); 