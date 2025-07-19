import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getUserFollowers, getUserFollowing } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { ProfileContent } from './ProfileContent';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { profile, isLoading } = useProfile();

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
          showPrivacyIndicator={false}
        />
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }
  
  // Obtener datos de seguidores/seguidos desde mockData
  const followers = getUserFollowers(profile.id);
  const following = getUserFollowing(profile.id);
  const followersCount = followers.length;
  const followingCount = following.length;

  // Convertir profile a formato compatible con ProfileContent
  const userData = {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    isVerified: profile.is_verified,
    isPublic: profile.is_public,
  };

  // Header para mi perfil
  const headerComponent = (
    <ProfileHeader 
      username={profile.username}
      onMenuPress={openSettings}
      isVerified={profile.is_verified}
      isPublicProfile={profile.is_public}
      showPrivacyIndicator={true} // Solo mostrar en mi perfil
    />
  );

  // Botón de acción para mi perfil
  const actionButton = (
    <ResizingButton
      title="Editar perfil"
      onPress={handleEditProfile}
      backgroundColor={Colors.backgroundUltraSoft}
      textColor={Colors.white}
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