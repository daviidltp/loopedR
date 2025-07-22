import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import { FollowRequest, getUserById } from '../../../utils/mockData';
import { UsersGroup } from '../../icons/UsersGroup';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface FollowRequestSectionProps {
  requests: FollowRequest[];
  onPress: () => void;
}

export const FollowRequestSection: React.FC<FollowRequestSectionProps> = ({
  requests,
  onPress,
}) => {
  const { followRequests } = useFollowers();

  let sectionText = 'No tienes solicitudes';
  if (followRequests.length === 1) {
    const req = followRequests[0];
    sectionText = `${req.follower_profile?.display_name || req.follower_profile?.username || 'Alguien'} quiere seguirte`;
  } else if (followRequests.length > 1) {
    const first = followRequests[0];
    sectionText = `${first.follower_profile?.display_name || first.follower_profile?.username || 'Alguien'} y ${followRequests.length - 1} persona${followRequests.length - 1 === 1 ? '' : 's'} más quieren seguirte`;
  }

  // Si no hay solicitudes, mostrar el estado vacío pero con el mismo formato visual
  if (requests.length === 0) {
    return (
      <PlatformTouchable 
        onPress={onPress}
      >
        <View style={styles.contentContainer}>
          <DefaultAvatar
            name="Sin solicitudes"
            size={52}
            showUploadButton={false}
            renderIcon={<UsersGroup size={24} color={Colors.mutedWhite} />}
            disabled={true}
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
  }

  // Obtener la solicitud más reciente
  const mostRecentRequest = requests.sort((a, b) => b.timestamp - a.timestamp)[0];
  const mostRecentUser = getUserById(mostRecentRequest.fromUserId);

  if (!mostRecentUser) return null;

  return (
    <PlatformTouchable 
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        {/* Avatar circular */}
        <DefaultAvatar
          name={mostRecentUser.displayName}
          size={80}
          avatarUrl={mostRecentUser.avatarUrl}
          showUploadButton={false}
          disabled={true}
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
            {requests.length} solicitud{requests.length > 1 ? 'es' : ''}
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