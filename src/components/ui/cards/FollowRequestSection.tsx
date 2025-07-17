import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FollowRequest, getUserById } from '../../../utils/mockData';
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

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const content = (
    <View style={styles.container}>
      {/* Avatar circular */}
      <View style={styles.avatarContainer}>
        {mostRecentUser.avatarUrl ? (
          <Image source={{ uri: mostRecentUser.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <AppText 
              variant='body'
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
            >
              {getInitials(mostRecentUser.displayName)}
            </AppText>
          </View>
        )}
      </View>

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
  );

  // Fallback para iOS
  return (
    <PlatformTouchable 
      onPress={onPress}
      rippleColor={Colors.backgroundSoft}
    >
      {content}
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 52,
    height: 52,
    borderRadius: 24,
    backgroundColor: Colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
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