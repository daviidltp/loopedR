import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { BackHandler, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser, getUserFollowers, getUserFollowing, isUserFollowing, mockUsers } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { AppText } from '../ui/Text/AppText';

type UserProfileScreenProps = StackScreenProps<RootStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Función para formatear números de seguidores
const formatFollowersCount = (count: number): string => {
  if (count < 10000) {
    return count.toString();
  } else if (count < 100000) {
    const thousands = count / 1000;
    if (thousands % 1 === 0) {
      return `${Math.floor(thousands)}k`;
    } else {
      const formatted = thousands.toFixed(1);
      return formatted.endsWith('.0') ? `${Math.floor(thousands)}k` : `${formatted}k`;
    }
  } else if (count < 1000000) {
    return `${Math.floor(count / 1000)}k`;
  } else {
    const millions = count / 1000000;
    if (millions % 1 === 0) {
      return `${Math.floor(millions)}M`;
    } else {
      const formatted = millions.toFixed(1);
      return formatted.endsWith('.0') ? `${Math.floor(millions)}M` : `${formatted}M`;
    }
  }
};

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

  return (
    <View style={styles.container}>
      {/* Header personalizado con botón de atrás */}
      <ProfileHeader 
        username={userData.username}
        onBackPress={handleBackPress}
        onMorePress={handleMorePress}
        isVerified={userData.isVerified}
        showBackButton={true}
        showPrivacyIndicator={false} // No mostrar en perfiles de otros usuarios
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        // Permitir que el gesto de retroceso funcione incluso con ScrollView
        scrollEnabled={true}
        bounces={false}
      >
        {/* Profile Info Row */}
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userData.avatarUrl }}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.profileInfo}>
            <AppText 
              variant="h3" 
              fontFamily="inter" 
              fontWeight="bold" 
              color={Colors.white}
              style={styles.displayName}
            >
              {userData.displayName}
            </AppText>
            
            <View style={styles.followStatsContainer}>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.white}
                style={styles.followNumber}
              >
                {formatFollowersCount(followersCount)}
              </AppText>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.gray[400]}
                style={styles.followText}
              >
                {followersCount == 1 ? ' seguidor · ' : ' seguidores · '}
              </AppText>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.white}
                style={styles.followNumber}
              >
                {formatFollowersCount(followingCount)}
              </AppText>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.gray[400]}
                style={styles.followText}
              >
                {followingCount == 1 ? ' seguido' : ' seguidos'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Bio Section - Solo renderizar si hay bio */}
        {userData.bio && userData.bio.trim() !== '' && (
          <View style={styles.bioSection}>
            <AppText 
              variant="body" 
              fontFamily="inter" 
              color={Colors.gray[300]}
              style={styles.bioText}
            >
              {userData.bio}
            </AppText>
          </View>
        )}

        {/* Botón de seguir */}
        <View style={[
          styles.buttonSection,
          // Condicionar el padding top basado en si hay bio
          userData.bio && userData.bio.trim() !== '' 
            ? styles.buttonSectionWithBio 
            : styles.buttonSectionNoBio
        ]}>
          {isFollowing ? (
            <ResizingButton
              title="Siguiendo"
              onPress={handleFollowPress}
              backgroundColor={Colors.background}
              textColor={Colors.white}
              borderColor={Colors.white}
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
          )}
        </View>

        {/* Contenido condicional según privacidad */}
        {!userData.isPublic && !isFollowing ? (
          // Cuenta privada y no la seguimos
          <View style={styles.privateContentSection}>
            <View style={styles.privateIconContainer}>
              <Icon
                source="lock"
                size={64}
                color={Colors.white}
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
              fontSize={14}
              color={Colors.gray[400]}
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
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  displayName: {
    marginBottom: 4,
  },
  followStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  followNumber: {
    lineHeight: 20,
  },
  followText: {
    lineHeight: 20,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  bioText: {
    lineHeight: 22,
  },
  buttonSection: {
    paddingHorizontal: 16,
  },
  buttonSectionWithBio: {
    paddingTop: 24, // Distancia estándar desde la bio
  },
  buttonSectionNoBio: {
    paddingTop: 32, // Un poco más de espacio cuando no hay bio
  },
  privateContentSection: {
    paddingHorizontal: 16,
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
    width: '60%',
  },
  postsSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  postsPlaceholder: {
    textAlign: 'center',
  },
}); 