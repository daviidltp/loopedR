import { mockPosts } from '@/src/utils/mockData';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useFollowers } from '../../contexts/FollowersContext';
import { useProfile } from '../../contexts/ProfileContext';
import { SearchBar } from '../ui/forms/SearchBar';
import { HomeHeader } from '../ui/headers';
import { Layout } from '../ui/layout';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { Post } from '../ui/Post/Post';
import { AppText } from '../ui/Text/AppText';

const SEARCH_BAR_INITIAL_POSITION = 230;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { profile: currentUser } = useProfile();
  const { followingCount } = useFollowers();
  const userHasFriends = followingCount > 0;
  const navigation = useNavigation<BottomTabNavigationProp<BottomNavigationParamList, 'Home'>>();

  useFocusEffect(
    React.useCallback(() => {
      if (currentUser?.id) {
        // getFollowingCount(currentUser.id).then(count => setUserHasFriends(count > 0)).catch(() => setUserHasFriends(false));
      }
    }, [currentUser?.id, followingCount])
  );

  // Componente interno para el estado vacío
  const EmptyState: React.FC = () => (
    <View style={styles.emptyStateContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.emptyStateColumn}>
          <AppText variant='h1' fontFamily='inter' fontWeight='semiBold' lineHeight={36} color={Colors.white}>
            Vaya, esto está un poco vacío...
          </AppText>
          <AppText variant='body' fontFamily='inter' fontWeight='regular' color={Colors.mutedWhite}>
            Empieza añadiendo a un amigo
          </AppText>
          <SearchBar
            placeholder="Buscar amigos"
            onSearchPress={() => navigation.navigate('Search', { fromSearchAnimation: true })}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <HomeHeader />

        <ScrollView 
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {!userHasFriends ? (
            <EmptyState />
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.feedContainer}>
              <Post user={mockPosts[3].user} description={mockPosts[3].description} topSongs={mockPosts[3].topSongs} colorName='yellow' type='welcome' />
                <Post user={mockPosts[0].user} description={mockPosts[0].description} topSongs={mockPosts[0].topSongs} colorName='red' type='top-3-songs'/>
                <Post user={mockPosts[1].user} description={mockPosts[1].description} topSongs={mockPosts[1].topSongs} colorName='purple' type='top-3-songs' />
                <Post user={mockPosts[2].user} description={mockPosts[2].description} topSongs={mockPosts[2].topSongs} colorName='blue' type='top-3-songs' />
              </View>
            </TouchableWithoutFeedback>
          )}
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
    paddingTop: 12,
    
  },
  emptyStateContainer: {
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  emptyStateColumn: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 16,
  },
  feedContainer: {
    flex: 1,
    gap: 30,
    marginBottom: 100,

  },
}); 