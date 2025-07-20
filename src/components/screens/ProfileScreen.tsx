import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getUserFollowers, getUserFollowing } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { ProfileContent } from './ProfileContent';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { currentUser, isLoading } = useCurrentUser();

  const openSettings = () => {
    navigation.navigate('Settings');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading || !currentUser) {
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
  
  // Obtener datos de seguidores/seguidos desde mockData
  const followers = getUserFollowers(currentUser.id);
  const following = getUserFollowing(currentUser.id);
  const followersCount = followers.length;
  const followingCount = following.length;

  // Header para mi perfil
  const headerComponent = (
    <ProfileHeader 
      username={currentUser.username}
      onMenuPress={openSettings}
      isVerified={currentUser.isVerified}
      isPublicProfile={currentUser.isPublic}
      isMyProfile={true}
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
      userData={currentUser}
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