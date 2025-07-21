import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useProfile } from '../../contexts/ProfileContext';
import { useUserSearch } from '../../hooks/useUserSearch';
import { DeleteUserIcon } from '../icons/DeleteUserIcon';
import { SearchBar } from '../ui/forms/SearchBar';
import { Layout } from '../ui/layout/Layout';
import { UserList } from '../ui/list/UserList';
import { UserListItemSkeleton } from '../ui/list/UserListItemSkeleton';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type SearchScreenProps = BottomTabScreenProps<BottomNavigationParamList, 'Search'>;
type SearchScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Search'>;

export const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenProps['route']>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { profile: currentUser } = useProfile();
  const {
    users,
    isLoading,
    searchText,
    setSearchText,
    handleUserPress,
    handleClearSearch,
    searchBarRef,
  } = useUserSearch(currentUser);
  // Verificar si viene de la animación del SearchBar
  const fromSearchAnimation = route.params?.fromSearchAnimation || false;

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

  const isSearchEmpty = searchText.trim() === '';

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.userListContainer}>
          {isSearchEmpty && !isLoading ? (
            <View style={styles.defaultContainer}>
              <AppText
                variant="body"
                fontFamily="inter"
                color={Colors.mutedWhite}
                style={{ textAlign: 'left', fontSize: 16 }}
              >
                Busca usuarios para empezar a conectar 🎵
              </AppText>
            </View>
          ) : isLoading ? (
            <View>
              {[...Array(3)].map((_, i) => (
                <UserListItemSkeleton key={i} />
              ))}
            </View>
          ) : users.length > 0 ? (
            <UserList
              users={users}
              onUserPress={userId => handleUserPress(userId, navigation, currentUser?.id)}
            />
          ) : (
            // Solo mostrar este mensaje si la búsqueda terminó y no hay resultados
            <View style={styles.emptyContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: Colors.background,
                  borderWidth: 2,
                  borderColor: Colors.backgroundSoft,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <DeleteUserIcon size={28} color={Colors.mutedWhite} />
                </View>
                <AppText
                  variant="body"
                  fontFamily="inter"
                  color={Colors.mutedWhite}
                  style={{ textAlign: 'left', fontSize: 16 }}
                >
                  {`No se ha encontrado ningún \nusuario`}
                </AppText>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
}); 