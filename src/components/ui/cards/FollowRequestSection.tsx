import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FollowRequest, getUserById } from '../../../utils/mockData';
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
  if (requests.length === 0) return null;

  // Obtener la solicitud más reciente
  const mostRecentRequest = requests.sort((a, b) => b.timestamp - a.timestamp)[0];
  const mostRecentUser = getUserById(mostRecentRequest.fromUserId);

  if (!mostRecentUser) return null;

  return (
    <PlatformTouchable 
      onPress={onPress}
      style={styles.container}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {/* Avatar circular */}
        <DefaultAvatar
          name={mostRecentUser.displayName}
          size={52}
          avatarUrl={mostRecentUser.avatarUrl}
          showUploadButton={false}
        />

        {/* Información de la sección */}
        <View style={styles.sectionInfo}>
          <AppText 
            variant='body'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.sectionTitle}
          >
            Solicitudes de seguimiento
          </AppText>
          
          <AppText 
            variant='bodySmall'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
            style={styles.sectionSubtitle}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    // backgroundColor: Colors.background, // <-- Eliminar esta línea
  },

  sectionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    marginBottom: 2,
  },
  sectionSubtitle: {
    // Sin margin adicional
  },
  arrowContainer: {
    marginLeft: 8,
  },
}); 