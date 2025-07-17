import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

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

interface UserData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  isVerified: boolean;
  isPublic: boolean;
}

interface ProfileContentProps {
  userData: UserData;
  followersCount: number;
  followingCount: number;
  headerComponent: React.ReactNode;
  actionButton: React.ReactNode;
  children?: React.ReactNode; // Para contenido adicional (como posts, contenido privado, etc.)
  scrollViewProps?: any; // Props adicionales para el ScrollView
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  userData,
  followersCount,
  followingCount,
  headerComponent,
  actionButton,
  children,
  scrollViewProps = {}
}) => {
  return (
    <Layout>
      <View style={styles.container}>
        {/* Header personalizable */}
        {headerComponent}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {/* === CONTENEDOR PRINCIPAL DE INFO DE PERFIL (avatar, nombre, stats, bio, botón) === */}
          <View style={styles.profileInfoMainContainer}>
            {/* === ROW: Avatar + DisplayName + Stats === */}
            <View style={styles.profileRow}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: userData.avatarUrl }}
                  style={styles.avatar}
                />
              </View>
              {/* Contenedor: DisplayName + Stats */}
              <View style={styles.profileInfoContainer}>
                <AppText 
                  variant="h3" 
                  fontFamily="inter" 
                  fontWeight="bold" 
                  color={Colors.white}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userData.displayName}
                </AppText>
                <View style={styles.statsRow}>
                  {/* Seguidores */}
                  <View style={styles.statBox}>
                    <View style={styles.statInnerRow}>
                      <AppText 
                        variant="bodySmall" 
                        fontFamily="inter" 
                        fontWeight='bold'
                        color={Colors.white}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ marginRight: 4 }}
                      >
                        {formatFollowersCount(followersCount)}
                          <AppText 
                          variant="bodySmall" 
                          fontFamily="inter" 
                          color={Colors.mutedWhite}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {followersCount === 1 ? ' seguidor' : ' seguidores'}
                        </AppText>
                      </AppText>
                      
                    </View>
                  </View>
                  {/* Seguidos */}
                  <View style={styles.statBox}>
                    <View style={styles.statInnerRow}>
                      <AppText 
                        variant="bodySmall" 
                        fontFamily="inter" 
                        fontWeight='bold'
                        color={Colors.white}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ marginRight: 4 }}
                      >
                        {formatFollowersCount(followingCount)}
                        <AppText 
                        variant="bodySmall" 
                        fontFamily="inter" 
                        color={Colors.mutedWhite}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {followingCount === 1 ? ' seguido' : ' seguidos'}
                      </AppText>
                      </AppText>   
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* === BIO (descripción) === */}
            {userData.bio && userData.bio.trim() !== '' && (
              <View>
                <AppText 
                  variant="body" 
                  fontFamily="inter" 
                  color={Colors.lessMutedWhite}
                >
                  {userData.bio}
                </AppText>
              </View>
            )}

            {/* === BOTÓN DE ACCIÓN (editar perfil, seguir, etc) === */}
            <View>
              {actionButton}
            </View>
          </View>

          {/* Contenido adicional personalizable */}
          {children}
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
  // Nuevo contenedor para displayName y stats
  profileInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  // Fila para los stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Cada box ocupa como máximo el 50%
  statBox: {
    maxWidth: '50%',
    minWidth: 0, // Para que el texto pueda truncarse
  },
  statInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Contenedor principal de la info de perfil
  profileInfoMainContainer: {
    paddingHorizontal: 16,
    gap: 24,
  },
}); 