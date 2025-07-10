import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { currentUser, hasAnyFollowing, mockUsers } from '../../utils/mockData';
import { SearchBar } from '../ui';
import { Header, Layout } from '../ui/layout';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const userHasFriends = hasAnyFollowing(currentUser.id);
  
  // Usuarios sugeridos (todos excepto el usuario actual)
  const suggestedUsers = mockUsers.filter(user => user.id !== currentUser.id);

  // Animated values para el efecto - siempre inician en valores correctos
  const fadeOpacity = useRef(new Animated.Value(1)).current;
  const searchBarTranslateY = useRef(new Animated.Value(0)).current;

  // Asegurar reset correcto en desarrollo (hot reload)
  useEffect(() => {
    if (__DEV__) {
      fadeOpacity.setValue(1);
      searchBarTranslateY.setValue(0);
    }
  }, []);

  // Usar useFocusEffect para resetear animaciones correctamente
  useFocusEffect(
    React.useCallback(() => {
      // Resetear inmediatamente sin animación
      fadeOpacity.setValue(1);
      searchBarTranslateY.setValue(0);
    }, [fadeOpacity, searchBarTranslateY])
  );

  const handleSearchFocus = () => {
    // Calcular la distancia que debe moverse el SearchBar
    const targetPosition = insets.top;
    const currentPosition = 230;
    const translateDistance = targetPosition - currentPosition;

    // Ejecutar animaciones en paralelo
    Animated.parallel([
      Animated.timing(fadeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchBarTranslateY, {
        toValue: translateDistance,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start((finished) => {
      if (finished.finished) {
        setTimeout(() => {
          navigation.navigate('Search', { fromSearchAnimation: true });
        }, 0);
      }
    });
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeOpacity }}>
          <Header />
        </Animated.View>

        {/* ScrollView vertical para todo el contenido */}
        <ScrollView 
          style={styles.mainScrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Contenido principal */}
          {!userHasFriends ? (
            <View style={styles.emptyStateContainer}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.textAndSearchSection}>
                  <Animated.View style={{ opacity: fadeOpacity }}>
                    <AppText fontSize={32} fontFamily='inter' fontWeight='semiBold' color={Colors.white} lineHeight={36} style={{marginBottom: 16}}>
                      Esto está un poco vacío...
                    </AppText>
                    <AppText fontSize={16} fontFamily='inter' fontWeight='regular' color={Colors.gray[400]} lineHeight={24}>Empieza añadiendo a un amigo</AppText>
                  </Animated.View>
                  
                  {/* Espacio reservado para el SearchBar */}
                  <View style={styles.searchSpaceholder} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            // Aquí irá el feed cuando el usuario tenga amigos
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.feedContainer}>
                <AppText fontSize={18} color={Colors.gray[400]} fontFamily='raleway'>Feed con amigos (próximamente)</AppText>
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
        
        {/* SearchBar único posicionado de forma absoluta */}
        <Animated.View 
          style={[
            styles.absoluteSearchBar,
            {
              top: 230, // Posición inicial que puedes ajustar
              transform: [{ translateY: searchBarTranslateY }]
            }
          ]}
        >
          <SearchBar 
            placeholder="Buscar usuarios"
            onFocus={handleSearchFocus}
            showSoftInputOnFocus={false}
            disableFocusBackgroundChange={true}
          />
        </Animated.View>
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
  emptyStateContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    minHeight: '100%', // Asegurar altura mínima para el scroll
  },
  textAndSearchSection: {
    // Sección que SÍ puede cerrar el teclado
  },
  searchSpaceholder: {
    height: 72, // Altura del SearchBar + margins (56 + 16)
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
    minHeight: 400, // Altura mínima para el contenido del feed
  },
}); 