import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { convertSupabaseUserToUser, getSupabaseUsers, searchSupabaseUsers } from '../../utils/userActions';
import { SearchBar } from '../ui/forms/SearchBar';
import { Layout } from '../ui/layout/Layout';
import { UserList } from '../ui/list/UserList';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';

type SearchScreenProps = BottomTabScreenProps<BottomNavigationParamList, 'Search'>;
type SearchScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Search'>;
type MainStackNavigationProp = StackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenProps['route']>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const stackNavigation = useNavigation<MainStackNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<any>(null);
  const { profile: currentUser } = useProfile();
  
  // Verificar si viene de la animación del SearchBar
  const fromSearchAnimation = route.params?.fromSearchAnimation || false;

  // Cargar usuarios cuando se dispone del currentUser
  useEffect(() => {
    if (currentUser?.id) {
      loadUsers();
    }
  }, [currentUser?.id]);

  // Cargar usuarios de Supabase
  const loadUsers = async () => {
    try {
      console.log('[SearchScreen] Cargando usuarios, currentUser ID:', currentUser?.id);
      setIsLoading(true);
      const supabaseUsers = await getSupabaseUsers(currentUser?.id);
      console.log('[SearchScreen] Usuarios obtenidos de Supabase:', supabaseUsers.length);
      const convertedUsers = supabaseUsers.map(convertSupabaseUserToUser);
      console.log('[SearchScreen] Usuarios convertidos:', convertedUsers.map(u => ({ id: u.id, username: u.username, avatarUrl: u.avatarUrl })));
      setUsers(convertedUsers);
    } catch (error) {
      console.error('[SearchScreen] Error al cargar usuarios:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar usuarios cuando cambia el texto de búsqueda
  useEffect(() => {
    if (!currentUser?.id) return; // No buscar si no tenemos currentUser

    const searchUsers = async () => {
      if (searchText.trim() === '') {
        await loadUsers();
        return;
      }

      try {
        console.log('[SearchScreen] Buscando usuarios con texto:', searchText);
        setIsLoading(true);
        const supabaseUsers = await searchSupabaseUsers(searchText, currentUser.id);
        console.log('[SearchScreen] Resultados de búsqueda:', supabaseUsers.length);
        const convertedUsers = supabaseUsers.map(convertSupabaseUserToUser);
        setUsers(convertedUsers);
      } catch (error) {
        console.error('[SearchScreen] Error al buscar usuarios:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce para evitar demasiadas llamadas a la API
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText, currentUser?.id]);

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
    console.log('[SearchScreen] Usuario presionado:', userId);
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
          placeholder="Buscar"
          autoFocus={fromSearchAnimation}
        />
      </View>

      {/* Lista de usuarios */}
      <View style={styles.userListContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        ) : users.length > 0 ? (
          <UserList
            users={users}
            onUserPress={handleUserPress}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
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
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  userListContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 