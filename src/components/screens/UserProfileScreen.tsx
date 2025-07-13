import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser, getUserFollowers, getUserFollowing, isUserFollowing, mockUsers } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { AppText } from '../ui/Text/AppText';
import { ProfileContent } from './ProfileContent';

type UserProfileScreenProps = StackScreenProps<RootStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const route = useRoute<UserProfileScreenProps['route']>();
  
  // Obtener userId de los parámetros de navegación (obligatorio para esta pantalla)
  const { userId } = route.params as { userId: string };
  
  // Buscar el usuario en mockData
  const userData = mockUsers.find(user => user.id === userId);
  
  // Si no se encuentra el usuario, mostrar error o navegar atrás
  if (!userData) {
    React.useEffect(() => {
      navigation.goBack();
    }, [navigation]);
    return null;
  }

  // Manejar botón físico de Android para volver atrás
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true; // Indica que hemos manejado el evento
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [navigation])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMorePress = () => {
    console.log('More options pressed for user:', userId);
    // TODO: Mostrar menú de opciones para otros usuarios
  };

  const handleFollowPress = () => {
    console.log('Follow button pressed for user:', userId);
    // TODO: Implementar funcionalidad de seguir
  };
  
  // Obtener datos de seguidores/seguidos desde mockData
  const followers = getUserFollowers(userData.id);
  const following = getUserFollowing(userData.id);
  const followersCount = followers.length;
  const followingCount = following.length;
  
  // Verificar si ya seguimos a este usuario
  const isFollowing = isUserFollowing(currentUser.id, userData.id);

  // Header para perfil de otro usuario
  const headerComponent = (
    <ProfileHeader 
      username={userData.username}
      onBackPress={handleBackPress}
      onMorePress={handleMorePress}
      isVerified={userData.isVerified}
      showBackButton={true}
      showPrivacyIndicator={false} // No mostrar en perfiles de otros usuarios
    />
  );

  // Botón de acción para perfil de otro usuario
  const actionButton = isFollowing ? (
    <ResizingButton
      icon={<Icon source="check" size={18} color={Colors.white} />}
      title="Siguiendo"
      onPress={handleFollowPress}
      backgroundColor={Colors.backgroundUltraSoft}
      textColor={Colors.white}
      height={42}
    />
  ) : (
    <ResizingButton
      title="Seguir"
      onPress={handleFollowPress}
      backgroundColor={Colors.white}
      textColor={Colors.background}
      borderColor="transparent"
      height={42}
    />
  );

  // Contenido adicional específico para perfiles de otros usuarios
  const additionalContent = !userData.isPublic && !isFollowing ? (
    // Cuenta privada y no la seguimos
    <View style={styles.privateContentSection}>
      <View style={styles.privateIconContainer}>
        <Icon
          source="lock"
          size={64}
          color={Colors.mutedWhite}
        />
      </View>
      <AppText
        variant="h4"
        fontFamily="inter"
        fontWeight="medium"
        color={Colors.white}
        style={styles.privateTitle}
      >
        Esta cuenta es privada
      </AppText>
      <AppText
        variant="body"
        fontFamily="inter"
        color={Colors.mutedWhite}
        style={styles.privateDescription}
      >
        Sigue a esta cuenta para ver sus publicaciones
      </AppText>
    </View>
  ) : (
    // Cuenta pública o la seguimos
    <View style={styles.postsSection}>
      <AppText
        variant="h4"
        fontFamily="inter"
        fontWeight="medium"
        color={Colors.white}
        style={styles.postsPlaceholder}
      >
        Aquí van las publicaciones
      </AppText>
    </View>
  );

  return (
    <ProfileContent
      userData={userData}
      followersCount={followersCount}
      followingCount={followingCount}
      headerComponent={headerComponent}
      actionButton={actionButton}
      scrollViewProps={{
        scrollEnabled: true,
        bounces: false,
      }}
    >
      {additionalContent}
    </ProfileContent>
  );
};

const styles = StyleSheet.create({
  privateContentSection: {
    paddingTop: 80,
    alignItems: 'center',
  },
  privateIconContainer: {
    marginBottom: 10,
  },
  privateTitle: {
    marginBottom: 8,
  },
  privateDescription: {
    textAlign: 'center',
    width: '80%',
  },
  postsSection: {
    paddingHorizontal: 0,
    paddingTop: 24,
    alignItems: 'center',
  },
  postsPlaceholder: {
    textAlign: 'center',
  },
}); 