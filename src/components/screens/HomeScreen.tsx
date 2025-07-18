import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { hasAnyFollowing } from '../../utils/mockData';
import { SearchBar } from '../ui/forms/SearchBar';
import { Header } from '../ui/headers';
import { Layout } from '../ui/layout';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Home'>;

const SEARCH_BAR_INITIAL_POSITION = 230;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();
  const userHasFriends = currentUser ? hasAnyFollowing(currentUser.id) : false;
  const navigation = useNavigation<BottomTabNavigationProp<BottomNavigationParamList, 'Home'>>();
  

  return (
    <Layout>
      <View style={styles.container}>
        <Header />

        <ScrollView 
          style={styles.mainScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={true}
        >
          
          {/* SearchBar */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.searchSection}>
              <SearchBar
                placeholder="Buscar amigos"
                onSearchPress={() => {
                  navigation.navigate('Search', { fromSearchAnimation: true });
                }}
                showSoftInputOnFocus={false}
                disableFocusBackgroundChange={true}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            {userHasFriends ? (
              <View style={styles.friendsContent}>
                <AppText 
                  variant="h3" 
                  fontFamily="inter" 
                  fontWeight="bold" 
                  color={Colors.white}
                  style={styles.welcomeText}
                >
                  Feed de tus amigos
                </AppText>
                <AppText 
                  variant="body" 
                  fontFamily="inter" 
                  color={Colors.mutedWhite}
                  style={styles.subtitleText}
                >
                  Próximamente...
                </AppText>
              </View>
            ) : (
              <View style={styles.noFriendsContent}>
                <AppText 
                  variant="h3" 
                  fontFamily="inter" 
                  fontWeight="bold" 
                  color={Colors.white}
                  style={styles.welcomeText}
                >
                  ¡Encuentra a tus amigos!
                </AppText>
                <AppText 
                  variant="body" 
                  fontFamily="inter" 
                  color={Colors.mutedWhite}
                  style={styles.subtitleText}
                >
                  Conecta con personas que comparten tu pasión por la música
                </AppText>
              </View>
            )}
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
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para el bottom navigation
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsContent: {
    alignItems: 'center',
  },
  noFriendsContent: {
    alignItems: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: 'center',
    opacity: 0.8,
  },
}); 