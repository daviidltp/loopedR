import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useFollowers } from '../../contexts/FollowersContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useUserSearch } from '../../hooks/useUserSearch';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getUserStatsById } from '../../utils/userActions';
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

  // Este screen es solo para usuarios ajenos
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

  const [externalFollowersCount, setExternalFollowersCount] = React.useState(
    typeof userDataFromParams?.followersCount === 'number' ? userDataFromParams.followersCount : 0
  );
  const [externalFollowingCount, setExternalFollowingCount] = React.useState(
    typeof userDataFromParams?.followingCount === 'number' ? userDataFromParams.followingCount : 0
  );
  const [externalFollowStatus, setExternalFollowStatus] = React.useState<'none' | 'pending' | 'accepted'>(
    typeof userDataFromParams?.followStatus === 'string' ? userDataFromParams.followStatus : 'accepted'
  );
  const [isFollowLoading, setIsFollowLoading] = React.useState(false);

  // Si no hay datos completos, podrías hacer un fetch aquí (opcional)
  React.useEffect(() => {
    if (!userDataFromParams) {
      setIsLoading(true);
      // Aquí podrías llamar a tu función para obtener datos completos si lo necesitas
      // Por ahora, simulamos que no hay datos extra
      setIsLoading(false);
    }
  }, [userId, userDataFromParams]);

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

  // Este screen es solo para usuarios ajenos
  if (currentUser?.id === userData?.id) {
    // Si por error se navega aquí con el propio usuario, volvemos atrás
    React.useEffect(() => {
      navigation.goBack();
    }, [navigation]);
    return null;
  }

  // Obtener la función de acción optimista desde el hook global
  const { handleFollowAction } = useUserSearch(currentUser);

  const handleFollowPress = async () => {
    if (!userData?.id) return;
    setIsFollowLoading(true);
    if (externalFollowStatus === 'accepted') {
      await handleFollowAction(userData.id, 'unfollow');
    } else if (externalFollowStatus === 'pending') {
      await handleFollowAction(userData.id, 'cancel');
    } else {
      await handleFollowAction(userData.id, 'follow');
    }
    // Actualizar contadores y status desde Supabase
    if (fetchFollowersCount && fetchFollowingCount && fetchFollowStatus && currentUser?.id) {
      const stats = await getUserStatsById(
        userData.id,
        currentUser.id,
        fetchFollowersCount,
        fetchFollowingCount,
        fetchFollowStatus
      );
      setExternalFollowersCount(stats.followersCount);
      setExternalFollowingCount(stats.followingCount);
      setExternalFollowStatus(stats.followStatus);
    }
    setIsFollowLoading(false);
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

  // Header para el perfil
  const headerComponent = (
    <ProfileHeader 
      username={userData.username}
      onBackPress={handleBackPress}
      onMorePress={handleMorePress}
      isVerified={userData.isVerified}
      isMyProfile={false}
    />
  );

  // Botón de acción
  const actionButton = (
    <ResizingButton
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
  const additionalContent = !userData.isPublic && externalFollowStatus !== 'accepted' ? (
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

  // Convertir userData a formato seguro para ProfileContent
  const safeUserData = {
    ...userData,
    displayName: (userData.displayName || '').trim(),
    username: (userData.username || '').trim(),
    bio: (userData.bio || '').trim(),
    email: (userData.email || '').trim(),
    avatarUrl: userData.avatarUrl || '',
  };

  return (
    <ProfileContent
      userData={safeUserData}
      followersCount={externalFollowersCount}
      followingCount={externalFollowingCount}
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