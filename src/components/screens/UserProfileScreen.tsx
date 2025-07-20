import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useProfile } from '../../contexts/ProfileContext';
import { useUser } from '../../hooks/useUser';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getUserFollowers, getUserFollowing, isUserFollowing } from '../../utils/mockData';
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
  
  // Usar el nuevo hook para obtener datos del usuario
  const { user: userData, isLoading } = useUser(userId);
  const { profile: currentUser } = useProfile();
  
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

  // Navegar atrás si no se encuentra el usuario
  useFocusEffect(
    React.useCallback(() => {
      if (!isLoading && !userData) {
        navigation.goBack();
      }
    }, [isLoading, userData, navigation])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditProfile');
  };

  const handleMorePress = () => {
    console.log('More options pressed for user:', userId);
    // TODO: Mostrar menú de opciones para otros usuarios
  };

  const handleFollowPress = () => {
    console.log('Follow button pressed for user:', userId);
    // TODO: Implementar funcionalidad de seguir
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    const loadingHeaderComponent = (
      <ProfileHeader 
        username=""
        onBackPress={handleBackPress}
        isMyProfile={false}
        isVerified={false}
      />
    );

    const loadingActionButton = (
      <ResizingButton
        title=""
        onPress={() => {}}
        backgroundColor={Colors.backgroundUltraSoft}
        textColor={Colors.white}
        height={42}
      />
    );

    return (
      <ProfileContent
        userData={{
          id: '',
          username: '',
          displayName: '',
          avatarUrl: '',
          isVerified: false,
          isPublic: true
        }}
        followersCount={0}
        followingCount={0}
        headerComponent={loadingHeaderComponent}
        actionButton={loadingActionButton}
        scrollViewProps={{
          scrollEnabled: false,
          bounces: false,
        }}
      >
        <View style={[styles.postsSection, { opacity: 0.5 }]}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </ProfileContent>
    );
  }

  // Si no se encuentra el usuario, mostrar null (la navegación se maneja en useFocusEffect)
  if (!userData) {
    return null;
  }

  // Verificar si el usuario actual está siguiendo al usuario del perfil
  const isFollowing = currentUser ? isUserFollowing(currentUser.id, userData.id) : false;

  // Verificar si es el perfil del usuario actual
  const isOwnProfile = currentUser?.id === userData.id;

  // Obtener estadísticas de seguimiento
  const followers = getUserFollowers(userData.id);
  const following = getUserFollowing(userData.id);

  // Header para el perfil
  const headerComponent = (
    <ProfileHeader 
      username={userData.username}
      onBackPress={handleBackPress}
      onMorePress={!isOwnProfile ? handleMorePress : undefined}
      isVerified={userData.isVerified}
      isMyProfile={false}
    />
  );

  // Botón de acción
  const actionButton = isOwnProfile ? (
    <ResizingButton
      title="Editar perfil"
      onPress={handleEdit}
      backgroundColor={Colors.backgroundUltraSoft}
      textColor={Colors.white}
      height={42}
    />
  ) : isFollowing ? (
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
  const additionalContent = !isOwnProfile && !userData.isPublic && !isFollowing ? (
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
      followersCount={followers.length}
      followingCount={following.length}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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