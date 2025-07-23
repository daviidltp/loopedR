import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import { UsersGroup } from '../../icons/UsersGroup';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface FollowRequestSectionProps {
  onPress: () => void;
}

export const FollowRequestSection: React.FC<FollowRequestSectionProps> = ({
  onPress,
}) => {
  const { followRequests } = useFollowers();

  let sectionText = 'No tienes solicitudes';
  if (followRequests.length === 1) {
    const req = followRequests[0];
    sectionText = `${req.follower_profile?.username || req.follower_profile?.display_name || 'Alguien'} quiere seguirte`;
  } else if (followRequests.length > 1) {
    const first = followRequests[0];
    sectionText = `${first.follower_profile?.username || first.follower_profile?.display_name || 'Alguien'} y ${followRequests.length - 1} persona${followRequests.length - 1 === 1 ? '' : 's'} más quieren seguirte`;
  }

  const profile = followRequests.length > 0 ? followRequests[0].follower_profile : null;
  const avatarUrl = profile && profile.avatar_url && profile.avatar_url !== "default_avatar"
    ? profile.avatar_url
    : undefined;

  return (
    <PlatformTouchable 
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <DefaultAvatar
          name={profile ? (profile.display_name || profile.username || 'Alguien') : 'Sin solicitudes'}
          avatarUrl={avatarUrl}
          size={56}
          showUploadButton={false}
          disabled={true}
          {...(followRequests.length === 0 ? { renderIcon: <UsersGroup size={24} color={Colors.mutedWhite} /> } : {})}
        />
        {/* Información de la sección */}
        <View style={styles.sectionInfo}>
          <AppText 
            variant='body'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.sectionTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Solicitudes de seguimiento
          </AppText>
          <AppText 
            variant='bodySmall'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
            style={styles.sectionSubtitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {sectionText}
          </AppText>
        </View>
        {/* Indicador de flecha */}
        <View style={styles.arrowContainer}>
          <AppText 
            variant='bodyLarge'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
          >
            ›
          </AppText>
        </View>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sectionInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0, // Importante: permite que el texto se contraiga
  },
  sectionTitle: {
    marginBottom: 2,
  },
  sectionSubtitle: {
    // Sin margin adicional
  },
  arrowContainer: {
    marginLeft: 8,
    flexShrink: 0, // Evita que la flecha se contraiga
  },
});