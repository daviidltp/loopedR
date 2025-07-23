import React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import { useProfile } from '../../../contexts/ProfileContext';
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
  // onFollowPress,
}) => {
  const { profile: currentUser } = useProfile();
  const { getFollowStatus, follow, unfollow, cancelFollowRequest } = useFollowers();
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);

  const followStatus = getFollowStatus(user.id);

  const handleFollowPress = async () => {
    if (!user.id) return;
    if (followStatus === 'accepted') {
      Alert.alert(
        'Dejar de seguir',
        `¿Estás seguro de que quieres dejar de seguir a @${user.username}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Dejar de seguir', style: 'destructive', onPress: async () => {
              setIsFollowLoading(true);
              try {
                await unfollow(user.id);
              } catch {}
              setIsFollowLoading(false);
            }
          }
        ]
      );
    } else if (followStatus === 'pending') {
      Alert.alert(
        'Cancelar solicitud',
        `¿Quieres cancelar tu solicitud de seguimiento a @${user.username}?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Cancelar solicitud', style: 'destructive', onPress: async () => {
              setIsFollowLoading(true);
              try {
                await cancelFollowRequest(user.id);
              } catch {}
              setIsFollowLoading(false);
            }
          }
        ]
      );
    } else {
      setIsFollowLoading(true);
      try {
        await follow(user.id);
      } catch {}
      setIsFollowLoading(false);
    }
  };

  let buttonTitle = 'Seguir';
  if (followStatus === 'pending') buttonTitle = 'Pendiente';
  if (followStatus === 'accepted') buttonTitle = 'Siguiendo';

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
        icon={followStatus === 'accepted' ? <Icon source="check" size={18} color={Colors.white} /> : undefined}
        title={buttonTitle}
        onPress={handleFollowPress}
        backgroundColor={followStatus === 'accepted' ? Colors.backgroundUltraSoft : Colors.white}
        textColor={followStatus === 'accepted' ? Colors.white : Colors.background}
        borderColor={followStatus === 'accepted' ? undefined : 'transparent'}
        height={42}
        isLoading={isFollowLoading}
        isDisabled={isFollowLoading}
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