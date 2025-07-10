import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { currentUser, mockUsers } from '../../utils/mockData';
import { Layout, SearchBar, UserList } from '../ui';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';

type SearchScreenProps = BottomTabScreenProps<BottomNavigationParamList, 'Search'>;
type SearchScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Search'>;

export const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<SearchScreenProps['route']>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const searchBarRef = useRef<any>(null);
  const fadeOpacity = useRef(new Animated.Value(1)).current; // Inicia en 1 por defecto
  
  // Verificar si viene de la animación del SearchBar
  const fromSearchAnimation = route.params?.fromSearchAnimation || false;
  
  // Filtrar usuarios excluyendo al usuario actual
  const allUsers = mockUsers.filter(user => user.id !== currentUser.id);
  
  // Filtrar usuarios según el texto de búsqueda
  const filteredUsers = searchText.trim() === '' 
    ? allUsers 
    : allUsers.filter(user => 
        user.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase())
      );

  // Solo hacer autofocus y fadein si viene de la animación
  useFocusEffect(
    React.useCallback(() => {
      if (fromSearchAnimation) {
        fadeOpacity.setValue(0);
        
        const fadeTimer = setTimeout(() => {
          Animated.timing(fadeOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 0);
        
        const focusTimer = setTimeout(() => {
          if (searchBarRef.current && searchBarRef.current.focus) {
            searchBarRef.current.focus();
          }
        }, 200);

        return () => {
          clearTimeout(focusTimer);
          clearTimeout(fadeTimer);
        };
      }
    }, [fromSearchAnimation, fadeOpacity])
  );

  // Limpiar parámetro al salir de la pantalla
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (fromSearchAnimation) {
          navigation.setParams({ fromSearchAnimation: undefined });
        }
      };
    }, [fromSearchAnimation, navigation])
  );

  const handleUserPress = (userId: string) => {
    console.log('Ver perfil de usuario:', userId);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <Layout>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.searchContainer}>
          <SearchBar 
            ref={searchBarRef}
            placeholder="Buscar usuarios"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <Animated.View style={[styles.contentContainer, { opacity: fadeOpacity }]}>
          {filteredUsers.length > 0 && (
            <UserList 
              users={filteredUsers}
              onUserPress={handleUserPress}
              showSeparator={true}
            />
          )}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 0,
  },
  contentContainer: {
    flex: 1,
  },
}); 