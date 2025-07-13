import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser, getUserFollowers, getUserFollowing } from '../../utils/mockData';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { ProfileHeader } from '../ui/headers/ProfileHeader';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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
      // Eliminar .0 si existe
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
      // Eliminar .0 si existe
      return formatted.endsWith('.0') ? `${Math.floor(millions)}M` : `${formatted}M`;
    }
  }
};

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
  const followersCount = followers.length;
  const followingCount = following.length;

  return (
    <Layout>
    <View style={styles.container}>
      {/* Header */}
      <ProfileHeader 
        username={userData.username}
        onMenuPress={openSettings}
        isVerified={userData.isVerified}
        isPublicProfile={userData.isPublic}
        showPrivacyIndicator={true} // Solo mostrar en mi perfil
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
                variant="h5" 
                fontFamily="inter" 
                fontWeight='bold'
                color={Colors.white}
              >
                {formatFollowersCount(followersCount)}
              </AppText>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.gray[400]}
              >
                {followersCount == 1 ? ' seguidor · ' : ' seguidores · '}
              </AppText>
              <AppText 
                variant="h5" 
                fontFamily="inter" 
                fontWeight='bold'
                color={Colors.white}
              >
                {formatFollowersCount(followingCount)}
              </AppText>
              <AppText 
                variant="body" 
                fontFamily="inter" 
                color={Colors.gray[400]}
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

        {/* Botón de editar perfil */}
        <View style={[
          styles.buttonSection,
          // Condicionar el padding top basado en si hay bio
          userData.bio && userData.bio.trim() !== '' 
            ? styles.buttonSectionWithBio 
            : styles.buttonSectionNoBio
        ]}>
          <ResizingButton
            title="Editar perfil"
            onPress={handleEditProfile}
            backgroundColor={Colors.background}
            textColor={Colors.white}
            borderColor={Colors.white}
            height={42}
          />
        </View>
      </ScrollView>
    </View>
    </Layout>
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
    paddingBottom: 100, // Espacio para el bottom navigation
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
    gap: 6
  },
  displayName: {
    marginBottom: 4,
  },
  followStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
}); 