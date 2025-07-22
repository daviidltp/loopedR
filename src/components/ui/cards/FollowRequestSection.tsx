import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
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
              No tienes solicitudes
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