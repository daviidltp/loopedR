import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = useAuth();

  // Función para abrir Settings con animación horizontal
  const openSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.placeholder} />
        
        <Text style={styles.usernameTitle}>
          @{user?.username || 'usuario'}
        </Text>
        
        <Pressable
          style={styles.menuButton}
          onPress={openSettings}
          android_ripple={{ 
            color: 'rgba(255, 255, 255, 0.2)',
            borderless: true,
            radius: 20
          }}
        >
          <Icon
            source="menu"
            size={24}
            color={Colors.white}
          />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://pbs.twimg.com/profile_images/1594446880498401282/o4L2z8Ay_400x400.jpg' }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.displayName}>
            {user?.name || 'Cristiano Ronaldo'}
          </Text>
          
          <Text style={styles.username}>
            @{user?.username || 'Cristiano'}
          </Text>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
          </View>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.emptyState}>
            <Icon
              source="music-note"
              size={48}
              color={Colors.gray[600]}
            />
            <Text style={styles.emptyStateText}>
              Aún no tienes publicaciones
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Comparte tu primera canción para comenzar
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Mismo ancho que menuButton para centrar el título
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para el bottom navigation
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: Colors.gray[400],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  bioSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray[300],
    textAlign: 'center',
  },
  postsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.gray[400],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.gray[500],
    textAlign: 'center',
  },
}); 