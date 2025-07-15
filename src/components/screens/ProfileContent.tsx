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
                  variant="bodySmall" 
                  fontFamily="inter" 
                  fontWeight='bold'
                  color={Colors.white}
                >
                  {formatFollowersCount(followersCount)}
                </AppText>
                <AppText 
                  variant="bodySmall" 
                  fontFamily="inter" 
                  color={Colors.gray[400]}
                >
                  {followersCount === 1 ? ' seguidor   ' : ' seguidores   '}
                </AppText>
                <AppText 
                  variant="bodySmall" 
                  fontFamily="inter" 
                  fontWeight='bold'
                  color={Colors.white}
                >
                  {formatFollowersCount(followingCount)}
                
                <AppText 
                  variant="bodySmall" 
                  fontFamily="inter" 
                  color={Colors.gray[400]}
                >
                  {followingCount === 1 ? ' seguido' : ' seguidos'}
                  </AppText>
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
                color={Colors.lessMutedWhite}
              >
                {userData.bio}
              </AppText>
            </View>
          )}

          {/* Botón de acción personalizable */}
          <View style={[
            styles.buttonSection,
            // Condicionar el padding top basado en si hay bio
            userData.bio && userData.bio.trim() !== '' 
              ? styles.buttonSectionWithBio 
              : styles.buttonSectionNoBio
          ]}>
            {actionButton}
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