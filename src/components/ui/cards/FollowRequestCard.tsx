import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { VerifiedIcon } from '../../icons/VerifiedIcon';
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
    <PlatformTouchable onPress={() => onUserPress(request.fromUserId, user)}>
      <View style={styles.rowContainer}>
        {/* Información del usuario */}
        <DefaultAvatar
          name={safeDisplayName}
          size={56}
          avatarUrl={user.avatar_url || user.avatarUrl}
          showUploadButton={false}
        />
        <View style={styles.userInfo}>
          <View style={styles.usernameRow}>
            <AppText 
              variant='bodySmall'
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
              numberOfLines={1}
              style={[
                styles.username,
                !user.is_verified && styles.usernameFullWidth
              ]}
            >
              {safeUsername}lopez
            </AppText>
            {user.is_verified && (
              < VerifiedIcon
                size={12}
              />
            )}
          </View>
          <AppText 
            variant='caption'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
            numberOfLines={1}
            style={styles.displayName}
          >
            {safeDisplayName}
          </AppText>
        </View>
        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(request.id)}
            accessibilityLabel="Aceptar solicitud"
            activeOpacity={0.8}
          >
            <AppText variant='bodySmall' fontFamily='inter' fontWeight='semiBold' color={Colors.white}>Aceptar</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButtonCustom}
            onPress={() => onReject(request.id)}
            accessibilityLabel="Rechazar solicitud"
            activeOpacity={0.8}
          >
            <AppText variant='bodySmall' fontFamily='inter' fontWeight='semiBold' color={Colors.white}>Rechazar</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 2,
    minWidth: 0,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginRight: 8,
    gap: 6,
  },
  username: {
  },
  usernameFullWidth: {
    maxWidth: 150, // o el valor que prefieras para más espacio
  },
  displayName: {
    color: Colors.mutedWhite,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
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
    paddingVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginLeft: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  rejectButtonCustom: {
    backgroundColor: Colors.backgroundUltraSoft,
    paddingVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 