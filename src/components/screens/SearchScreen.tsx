import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser, mockUsers } from '../../utils/mockData';
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
  // Eliminar fadeOpacity y animación
  // const fadeOpacity = useRef(new Animated.Value(1)).current;
  
  // Verificar si viene de la animación del SearchBar
  const fromSearchAnimation = route.params?.fromSearchAnimation || false;
  
  // Filtrar usuarios excluyendo al usuario actual
  const allUsers = mockUsers.filter(user => user.id !== currentUser.id);
  
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

  const handleUserPress = (userId: string) => {
    console.log('Navegando al perfil de usuario:', userId);
    // Navegar al UserProfileScreen con el userId del usuario seleccionado
    stackNavigation.navigate('UserProfile', { userId });
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar 
            ref={searchBarRef}
            placeholder="Buscar usuarios"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {/* Eliminar Animated.View y usar View normal */}
        <View style={styles.contentContainer}>
          {filteredUsers.length > 0 && (
            <UserList 
              users={filteredUsers}
              onUserPress={handleUserPress}
              showSeparator={true}
            />
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 12,
    
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 0,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
  },
}); 