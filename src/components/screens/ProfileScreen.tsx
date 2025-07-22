import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useFollowers } from '../../contexts/FollowersContext';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RippleButton } from '../ui/buttons/RippleButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { ProfileContent } from './ProfileContent';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { profile, isLoading } = useProfile();
  const { getFollowersCount, getFollowingCount } = useFollowers();
  const [followersCount, setFollowersCount] = React.useState(0);
  const [followingCount, setFollowingCount] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (profile?.id) {
        getFollowersCount(profile.id).then(setFollowersCount).catch(() => setFollowersCount(0));
        getFollowingCount(profile.id).then(setFollowingCount).catch(() => setFollowingCount(0));
      }
    }, [profile?.id, getFollowersCount, getFollowingCount])
  );

  const openSettings = () => {
    navigation.navigate('Settings');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading || !profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ProfileHeader 
          username=""
          isPublicProfile={true}
        />
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }
  
  // Convertir profile a formato compatible con ProfileContent
  const userData = {
    id: profile.id,
    username: profile.username || '',
    displayName: profile.display_name || '',
    email: profile.email || '',
    avatarUrl: profile.avatar_url || '',
    bio: profile.bio || '',
    isVerified: profile.is_verified || false,
    isPublic: profile.is_public || true,
  };

  // Header para mi perfil
  const headerComponent = (
    <ProfileHeader 
      username={profile.username || ''}
      onMenuPress={openSettings}
      isVerified={profile.is_verified || false}
      isPublicProfile={profile.is_public}
      isMyProfile={true}
    />
  );

  // Botón de acción para mi perfil
  const actionButton = (
    <RippleButton
      title="Editar perfil"
      onPress={handleEditProfile}
      backgroundColor={Colors.backgroundSoft}
      textColor={Colors.white}
      borderColor={Colors.backgroundSoft}
      height={42}
    />
  );

  return (
    <ProfileContent
      userData={userData}
      followersCount={followersCount}
      followingCount={followingCount}
      headerComponent={headerComponent}
      actionButton={actionButton}
      isPublic={userData.isPublic}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 