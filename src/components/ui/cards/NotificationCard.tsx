import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CommentIcon from '../../../../assets/icons/comment.svg';
import HeartIcon from '../../../../assets/icons/heart.svg';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { Notification, getCommentById, getUserById } from '../../../utils/mockData';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const user = getUserById(notification.fromUserId);

  if (!user) return null;

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
  };

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `${minutos}m`;
    } else if (horas < 24) {
      return `${horas}h`;
    } else {
      return `${dias}d`;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const renderTextWithTime = () => {
    const timeText = getTimeAgo(notification.timestamp);
    const MAX_COMMENT_LENGTH = 35;

    return (
      <View style={styles.textFlexContainer}>
        <Text style={styles.combinedText} numberOfLines={3}>
          {notification.type === 'like' ? (
            <>
              <AppText variant='bodySmall' fontFamily="inter" fontWeight="medium" color={Colors.lessMutedWhite}>A </AppText>
              <AppText variant='bodySmall' fontFamily="inter" fontWeight="bold" color={Colors.white}>{user.username}</AppText>
              <View>
              {user.isVerified && <Image source={verifiedBlue} style={styles.verifiedBlueIcon} resizeMode="contain" />}
              </View>
              <AppText variant='bodySmall' fontFamily="inter" fontWeight="medium" color={Colors.lessMutedWhite}> le ha gustado tu publicación</AppText>
              <AppText variant='bodySmall' fontSize={12} fontFamily="inter" fontWeight="regular" color={Colors.mutedWhite}>
                {`  ${timeText}`}
              </AppText>
            </>
          ) : (
            <>
              <AppText variant='bodySmall' fontFamily="inter" fontWeight="bold" color={Colors.white}>{user.username}</AppText>
              <View>
              {user.isVerified && <Image source={verifiedBlue} style={styles.verifiedBlueIcon} resizeMode="contain" />}
              </View>
              <AppText variant='bodySmall' fontFamily="inter" fontWeight="medium" color={Colors.lessMutedWhite}> ha comentado en tu publicación: </AppText>
              {notification.commentId && (
                <AppText variant='bodySmall' fontFamily="inter" fontWeight="medium" color={Colors.lessMutedWhite}>
                  {truncateText(getCommentById(notification.commentId)?.content || 'comentario', MAX_COMMENT_LENGTH)}
                </AppText>
              )}
              <AppText variant='bodySmall' fontSize={12} fontFamily="inter" fontWeight="regular" color={Colors.mutedWhite}>
                {`  ${timeText}`}
              </AppText>
            </>
          )}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <PlatformTouchable
        style={styles.container}
        onPress={onPress}

      >
        <View style={styles.rowContent}>
          {/* Ícono de tipo de notificación alineado verticalmente con el username */}
          <View style={styles.iconCircle}>
            {notification.type === 'like' ? (
              <HeartIcon width={18} height={18}/>
            ) : (
              <CommentIcon width={16} height={16} fill={Colors.white} />
            )}
          </View>

          {/* Avatar circular */}
          <View style={styles.avatarContainer}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <AppText 
                  fontSize={14} 
                  fontFamily="roboto" 
                  fontWeight="semiBold" 
                  color={Colors.white}
                >
                  {getInitials(user.displayName)}
                </AppText>
              </View>
            )}
          </View>

          {/* Contenido de la notificación */}
          <View style={styles.notificationContent}>
            {renderTextWithTime()}
          </View>
        </View>
      </PlatformTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 24,
    backgroundColor: Colors.background,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.backgroundUltraSoft,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 26,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  textFlexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  inlineTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  combinedText: {
    lineHeight: 20,
  },
  timeTextInline: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
  },
  usernameText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    fontWeight: 'bold',
    color: Colors.white,
  },
  verifiedBlueIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
    marginLeft: 6,
    transform: [{ translateY: 2.5 }],
  },

  verifiedText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#1DA1F2',
    lineHeight: 20,
    fontWeight: 'bold',
  },
});