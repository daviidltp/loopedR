import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { AppText } from '../Text/AppText';
import { PlatformTouchable } from '../buttons/PlatformTouchable';

interface FollowRequestWithUser {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: number;
  user: any;
}
interface FollowRequestCardProps {
  request: FollowRequestWithUser;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onUserPress: (userId: string, user: any) => void;
}

export const FollowRequestCard: React.FC<FollowRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  onUserPress,
}) => {
  const user = request.user;
  if (!user) return null;
  const safeDisplayName = (user.display_name || user.displayName || '').trim();
  const safeUsername = (user.username || '').trim();

  return (
    <View style={styles.container}>
      <PlatformTouchable onPress={() => onUserPress(request.fromUserId, user)}>
        <DefaultAvatar
          name={safeDisplayName}
          size={48}
          avatarUrl={user.avatar_url || user.avatarUrl}
          showUploadButton={false}
        />
      </PlatformTouchable>
      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <PlatformTouchable onPress={() => onUserPress(request.fromUserId, user)}>
          <View style={styles.usernameRow}>
            <AppText 
              variant='body'
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
              numberOfLines={1}
              style={styles.username}
            >
              {safeUsername}
            </AppText>
            {user.is_verified && (
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
            numberOfLines={1}
            style={styles.displayName}
          >
            {safeDisplayName}
          </AppText>
        </PlatformTouchable>
      </View>
      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(request.id)}
          accessibilityLabel="Aceptar solicitud"
          activeOpacity={0.8}
        >
          <AppText style={styles.acceptButtonText}>Aceptar</AppText>
        </TouchableOpacity>
        <IconButton
          icon="close"
          size={22}
          onPress={() => onReject(request.id)}
          iconColor={Colors.white}
          style={styles.rejectButton}
          accessibilityLabel="Rechazar solicitud"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    minHeight: 70,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 12,
    minWidth: 0,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    minWidth: 0,
  },
  username: {
    fontSize: 16,
    marginRight: 6,
    maxWidth: 120,
  },
  displayName: {
    fontSize: 13,
    color: Colors.mutedWhite,
    maxWidth: 120,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 0,
  },
  iconButtonWrapper: {
    marginHorizontal: 2,
  },
  acceptButton: {
    backgroundColor: '#00b290',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 90,
  },
  acceptButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginLeft: 0,
  },
}); 