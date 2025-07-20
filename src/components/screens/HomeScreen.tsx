import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { currentUser, hasAnyFollowing } from '../../utils/mockData';
import { SearchBar } from '../ui/forms/SearchBar';
import { HomeHeader } from '../ui/headers';
import { Layout } from '../ui/layout';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Home'>;

const SEARCH_BAR_INITIAL_POSITION = 230;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const userHasFriends = hasAnyFollowing(currentUser.id);
  const navigation = useNavigation<BottomTabNavigationProp<BottomNavigationParamList, 'Home'>>();
  

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
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.feedContainer}>
                <AppText variant='body' fontFamily='inter' fontWeight='regular' color={Colors.mutedWhite}>Feed con amigos (próximamente)</AppText>
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
    paddingTop: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minHeight: 400,
  },
}); 