import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useSearchBarAnimation } from '../../hooks/useSearchBarAnimation';
import { currentUser, hasAnyFollowing } from '../../utils/mockData';
import { SearchBar } from '../ui';
import { Header } from '../ui/headers';
import { Layout } from '../ui/layout';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Home'>;

const SEARCH_BAR_INITIAL_POSITION = 230;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const userHasFriends = hasAnyFollowing(currentUser.id);
  
  const { 
    fadeAnimatedStyle, 
    searchBarAnimatedStyle, 
    handleSearchFocus,
    resetAnimations 
  } = useSearchBarAnimation({
    initialPosition: SEARCH_BAR_INITIAL_POSITION,
    targetPosition: insets.top
  });

  // Usar useFocusEffect para resetear animaciones
  useFocusEffect(
    React.useCallback(() => {
      resetAnimations();
    }, [resetAnimations])
  );

  return (
    <Layout>
      <View style={styles.container}>
        <Animated.View style={fadeAnimatedStyle}>
          <Header />
        </Animated.View>

        <ScrollView 
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {!userHasFriends ? (
            <View style={styles.emptyStateContainer}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.textAndSearchSection}>
                  <Animated.View style={fadeAnimatedStyle}>
                    <AppText fontSize={32} fontFamily='inter' fontWeight='semiBold' color={Colors.white} lineHeight={36} style={{marginBottom: 16}}>
                      Esto está un poco vacío...
                    </AppText>
                    <AppText fontSize={16} fontFamily='inter' fontWeight='regular' color={Colors.gray[400]} lineHeight={24}>Empieza añadiendo a un amigo</AppText>
                  </Animated.View>
                  
                  <View style={styles.searchSpaceholder} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.feedContainer}>
                <AppText fontSize={18} color={Colors.gray[400]} fontFamily='raleway'>Feed con amigos (próximamente)</AppText>
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
        
        {!userHasFriends && (
          <Animated.View 
            style={[
              styles.absoluteSearchBar,
              { top: SEARCH_BAR_INITIAL_POSITION },
              searchBarAnimatedStyle
            ]}
          >
            <SearchBar 
              placeholder="Buscar usuarios"
              onFocus={handleSearchFocus}
              showSoftInputOnFocus={false}
              disableFocusBackgroundChange={true}
            />
          </Animated.View>
        )}
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
    paddingTop: 16,
    minHeight: '100%',
  },
  textAndSearchSection: {
    // Sección que SÍ puede cerrar el teclado
  },
  searchSpaceholder: {
    height: 72,
    marginTop: 16,
  },
  absoluteSearchBar: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 1000,
  },
  feedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minHeight: 400,
  },
}); 