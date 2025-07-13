import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser, getUserFollowers, getUserFollowing } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { ProfileContent } from './ProfileContent';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  
  // Usar siempre el usuario actual para esta pantalla (mi perfil)
  const userData = currentUser;

  const openSettings = () => {
    navigation.navigate('Settings');
  };

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    // TODO: Navegar a editar perfil
  };
  
  // Obtener datos de seguidores/seguidos desde mockData
  const followers = getUserFollowers(userData.id);
  const following = getUserFollowing(userData.id);
  const followersCount = followers.length + 100000;
  const followingCount = following.length + 100000;

  // Header para mi perfil
  const headerComponent = (
    <ProfileHeader 
      username={userData.username}
      onMenuPress={openSettings}
      isVerified={userData.isVerified}
      isPublicProfile={userData.isPublic}
      showPrivacyIndicator={true} // Solo mostrar en mi perfil
    />
  );

  // Botón de acción para mi perfil
  const actionButton = (
    <ResizingButton
      icon={<Icon source="pencil" size={18} color={Colors.white} />}
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