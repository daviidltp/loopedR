import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockUsers } from '../../utils/mockData';
import { Layout, SearchBar, UserList } from '../ui';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';

type SearchScreenProps = BottomTabScreenProps<BottomNavigationParamList, 'Search'>;
type SearchScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Search'>;
type MainStackNavigationProp = StackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenProps['route']>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const stackNavigation = useNavigation<MainStackNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const searchBarRef = useRef<any>(null);
  const { currentUser } = useCurrentUser();
  
  // Verificar si viene de la animación del SearchBar
  const fromSearchAnimation = route.params?.fromSearchAnimation || false;
  
  // Filtrar usuarios excluyendo al usuario actual
  const allUsers = mockUsers.filter(user => user.id !== currentUser?.id);
  
  // Filtrar usuarios según el texto de búsqueda
  const filteredUsers = searchText.trim() === '' 
    ? allUsers 
    : allUsers.filter(user => 
        user.displayName.toLowerCase().startsWith(searchText.toLowerCase()) ||
        user.username.toLowerCase().startsWith(searchText.toLowerCase())
      );

  
  // Hacer focus solo si viene de HomeScreen, sin animación
  useFocusEffect(
    React.useCallback(() => {
      if (fromSearchAnimation) {
        const focusTimer = setTimeout(() => {
          if (searchBarRef.current && searchBarRef.current.focus) {
            searchBarRef.current.focus();
          }
        }, 200);
        return () => {
          clearTimeout(focusTimer);
        };
      }
    }, [fromSearchAnimation])
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

  // Función para manejar navegación a perfiles
  const handleUserPress = (userId: string) => {
    // Si es el usuario actual, navegar a tab de Profile
    if (userId === currentUser?.id) {
      navigation.navigate('Profile');
    } else {
      // Si es otro usuario, navegar a UserProfileScreen (stack navigation)
      stackNavigation.navigate('UserProfile', { userId });
    }
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchText('');
    searchBarRef.current?.clear();
  };

  return (
    <Layout style={styles.container}>
      {/* SearchBar siempre visible */}
      <View style={styles.searchContainer}>
        <SearchBar
          ref={searchBarRef}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar usuarios..."
          autoFocus={fromSearchAnimation}
        />
      </View>

      {/* Lista de usuarios */}
      <View style={styles.userListContainer}>
        <UserList
          users={filteredUsers}
          onUserPress={handleUserPress}
        />
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  userListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
}); 