import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import { useProfile } from '../../../contexts/ProfileContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { convertSupabaseUserToUser } from '../../../utils/userActions';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { DEFAULT_AVATAR_ID, PRESET_AVATAR_IMAGES } from '../Avatar/PresetAvatarGrid';
import { AppText } from '../Text/AppText';
import { PlatformTouchable } from '../buttons/PlatformTouchable';

const getAvatarSource = (avatarUrl: string | undefined) => {
  if (!avatarUrl || avatarUrl === DEFAULT_AVATAR_ID) return undefined;
  if (PRESET_AVATAR_IMAGES[avatarUrl]) return PRESET_AVATAR_IMAGES[avatarUrl];
  return { uri: avatarUrl };
};

export const FollowRequestsScreen: React.FC = () => {
  const { followRequests, acceptFollowRequest, rejectFollowRequest, isLoading } = useFollowers();
  const stackNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { profile: currentUser } = useProfile();

  const handleAccept = async (requestId: string) => {
    await acceptFollowRequest(requestId);
  };
  const handleReject = async (requestId: string) => {
    await rejectFollowRequest(requestId);
  };
  const handleUserPress = (userId: string, userData: any) => {
    if (userId === currentUser?.id) {
      stackNavigation.navigate('MainApp');
    } else {
      const user = convertSupabaseUserToUser(userData);
      stackNavigation.navigate('UserProfile', { userId, userData: user });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const avatarUrl = item.follower_profile?.avatar_url;
    const avatarSource = getAvatarSource(avatarUrl);
    return (
      <PlatformTouchable
        onPress={() => handleUserPress(item.follower_id, item.follower_profile)}
        rippleColor={Colors.gray[700]}
        disabled={isLoading}
      >
        <View style={screenStyles.requestItem}>
          {avatarSource ? (
            <Image source={avatarSource} style={screenStyles.avatar} />
          ) : (
            <DefaultAvatar
              name={item.follower_profile?.display_name || item.follower_profile?.username || 'Usuario'}
              size={48}
              showUploadButton={false}
              disabled={true}
            />
          )}
          <View style={screenStyles.infoContainer}>
            <AppText variant="body" fontFamily="inter" fontWeight="semiBold" color={Colors.white}>
              {item.follower_profile?.display_name || item.follower_profile?.username || 'Usuario'}
            </AppText>
            <AppText variant="bodySmall" fontFamily="inter" color={Colors.mutedWhite}>
              @{item.follower_profile?.username || 'usuario'}
            </AppText>
            {item.follower_profile?.is_verified && (
              <AppText variant="bodySmall" fontFamily="inter" color={Colors.white}>
                ✔ Verificado
              </AppText>
            )}
          </View>
          <View style={screenStyles.actions}>
            <TouchableOpacity onPress={() => handleAccept(item.id)} disabled={isLoading} style={screenStyles.actionBtn}>
              <CheckIcon size={24} color={Colors.spotifyGreen || '#1DB954'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(item.id)} disabled={isLoading} style={screenStyles.actionBtn}>
              <CrossIcon size={24} color={'#fa233b'} />
            </TouchableOpacity>
          </View>
        </View>
      </PlatformTouchable>
    );
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.header}>
        <TouchableOpacity onPress={() => stackNavigation.goBack()} style={screenStyles.backBtn}>
          <AppText variant="body" fontFamily="inter" color={Colors.white}>{'< Volver'}</AppText>
        </TouchableOpacity>
        <AppText variant="h5" fontFamily="inter" fontWeight="bold" color={Colors.white} style={screenStyles.title}>
          Solicitudes de seguimiento
        </AppText>
      </View>
      {followRequests.length > 0 ? (
        <FlatList
          data={followRequests}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={screenStyles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={screenStyles.emptyContainer}>
          <AppText variant="body" fontFamily="inter" color={Colors.mutedWhite}>
            No tienes solicitudes de seguimiento
          </AppText>
        </View>
      )}
    </View>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  list: {
    marginBottom: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: Colors.backgroundSoft,
  },
  infoContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    marginHorizontal: 4,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
}); 