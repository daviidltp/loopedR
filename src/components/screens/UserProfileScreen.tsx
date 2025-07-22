import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Alert, BackHandler, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useFollowers } from '../../contexts/FollowersContext';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { AppText } from '../ui/Text/AppText';
import { ProfileContent } from './ProfileContent';

type UserProfileScreenProps = StackScreenProps<RootStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const route = useRoute<UserProfileScreenProps['route']>();
  // Obtener userId y datos del usuario desde los parámetros de navegación
  const { userId, userData: userDataFromParams } = route.params as { userId: string, userData?: any };

  // Estado local para los datos del usuario
  const [userData, setUserData] = React.useState(userDataFromParams);
  const [isLoading, setIsLoading] = React.useState(!userDataFromParams);
  const { profile: currentUser } = useProfile();
  const {
    followersCount,
    followingCount,
    getFollowStatus,
    follow,
    unfollow,
    cancelFollowRequest,
    fetchFollowersCount,
    fetchFollowingCount,
    fetchFollowStatus,
  } = useFollowers();

  const [externalFollowersCount, setExternalFollowersCount] = React.useState(0);
  const [externalFollowingCount, setExternalFollowingCount] = React.useState(0);
  const [externalFollowStatus, setExternalFollowStatus] = React.useState<'none' | 'pending' | 'accepted'>('none');
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);

  React.useEffect(() => {
    if (!userDataFromParams) {
      setIsLoading(true);
      // Aquí podrías llamar a tu función para obtener datos completos
      // Ejemplo: fetchUserData(userId).then(data => { setUserData(data); setIsLoading(false); });
      // Por ahora, simulamos que no hay datos extra
      setIsLoading(false);
    }
  }, [userId, userDataFromParams]);

  useFocusEffect(
    React.useCallback(() => {
      if (!userData?.id) return;
      if (currentUser?.id === userData.id) {
        // No hace falta fetch, usamos el contexto
        return;
      }
      // Para otros usuarios, fetch puntual
      fetchFollowersCount(userData.id).then(setExternalFollowersCount).catch(() => setExternalFollowersCount(0));
      fetchFollowingCount(userData.id).then(setExternalFollowingCount).catch(() => setExternalFollowingCount(0));
      if (currentUser?.id) {
        fetchFollowStatus(userData.id, currentUser.id).then(setExternalFollowStatus).catch(() => setExternalFollowStatus('none'));
      }
    }, [userData?.id, currentUser?.id, fetchFollowersCount, fetchFollowingCount, fetchFollowStatus])
  );

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

  const isOwnProfile = currentUser?.id === userData?.id;

  const handleFollowPress = async () => {
    if (!userData?.id) return;
    if (isOwnProfile) return;
    if (externalFollowStatus === 'accepted') {
      Alert.alert(
        'Dejar de seguir',
        `¿Estás seguro de que quieres dejar de seguir a @${userData.username}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Dejar de seguir', style: 'destructive', onPress: async () => {
              setIsFollowLoading(true);
              try {
                await unfollow(userData.id);
                setExternalFollowStatus('none');
                setExternalFollowersCount(f => Math.max(0, f - 1));
              } catch {}
              setIsFollowLoading(false);
            }
          }
        ]
      );
    } else if (externalFollowStatus === 'pending') {
      Alert.alert(
        'Cancelar solicitud',
        `¿Quieres cancelar tu solicitud de seguimiento a @${userData.username}?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Cancelar solicitud', style: 'destructive', onPress: async () => {
              setIsFollowLoading(true);
              try {
                await cancelFollowRequest(userData.id);
                setExternalFollowStatus('none');
              } catch {}
              setIsFollowLoading(false);
            }
          }
        ]
      );
    } else {
      setIsFollowLoading(true);
      try {
        await follow(userData.id);
        setExternalFollowStatus('pending');
      } catch {}
      setIsFollowLoading(false);
    }
  };

  let buttonTitle = 'Seguir';
  if (externalFollowStatus === 'pending') buttonTitle = 'Pendiente';
  if (externalFollowStatus === 'accepted') buttonTitle = 'Siguiendo';

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
  // const isFollowing = currentUser ? isUserFollowing(currentUser.id, userData.id) : false; // This line is no longer needed

  // Verificar si es el perfil del usuario actual
  // const isOwnProfile = currentUser?.id === userData.id; // This line is now calculated above

  // Obtener estadísticas de seguimiento
  // const followers = getUserFollowers(userData.id); // This line is no longer needed
  // const following = getUserFollowing(userData.id); // This line is no longer needed

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
  ) : (
    <ResizingButton
      icon={externalFollowStatus === 'accepted' ? <Icon source="check" size={18} color={Colors.white} /> : undefined}
      title={buttonTitle}
      onPress={handleFollowPress}
      backgroundColor={externalFollowStatus === 'accepted' ? Colors.backgroundUltraSoft : Colors.white}
      textColor={externalFollowStatus === 'accepted' ? Colors.white : Colors.background}
      borderColor={externalFollowStatus === 'accepted' ? undefined : 'transparent'}
      height={42}
      isLoading={isFollowLoading}
      isDisabled={isFollowLoading}
    />
  );

  // Contenido adicional específico para perfiles de otros usuarios
  const additionalContent = !isOwnProfile && !userData.isPublic && externalFollowStatus !== 'accepted' ? (
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
      followersCount={isOwnProfile ? followersCount : externalFollowersCount}
      followingCount={isOwnProfile ? followingCount : externalFollowingCount}
      headerComponent={headerComponent}
      isPublic={userData.isPublic}
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