import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useProfile } from '../../contexts/ProfileContext';
import { useUserSearch } from '../../hooks/useUserSearch';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { DeleteUserIcon } from '../icons/DeleteUserIcon';
import { SearchBar } from '../ui/forms/SearchBar';
import { Layout } from '../ui/layout/Layout';
import { UserList } from '../ui/list/UserList';
import { UserListItemSkeleton } from '../ui/list/UserListItemSkeleton';
import type { BottomNavigationParamList } from '../ui/navigation/BottomNavigationBar';
import { AppText } from '../ui/Text/AppText';

type SearchScreenProps = BottomTabScreenProps<BottomNavigationParamList, 'Search'>;
type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomNavigationParamList, 'Search'>,
  StackNavigationProp<RootStackParamList>
>;

export const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenProps['route']>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { profile: currentUser } = useProfile();
  const {
    users,
    status,
    searchText,
    setSearchText,
    handleUserPress,
    handleClearSearch,
    searchBarRef,
    popularUsers,
    popularStatus,
  } = useUserSearch(currentUser);

  const fromSearchAnimation = route.params?.fromSearchAnimation || false;

  useFocusEffect(
    React.useCallback(() => {
      if (!fromSearchAnimation) return;

      const focusTimer = setTimeout(() => {
        searchBarRef.current?.focus?.();
      }, 200);

      return () => clearTimeout(focusTimer);
    }, [fromSearchAnimation])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (fromSearchAnimation) {
          navigation.setParams({ fromSearchAnimation: undefined });
        }
      };
    }, [fromSearchAnimation, navigation])
  );

  // Recargar usuarios al volver a SearchScreen (solo si no hay búsqueda activa)
  useFocusEffect(
    React.useCallback(() => {
      if (!searchText) {
        // Forzar recarga de populares y limpiar resultados
        handleClearSearch();
      }
    }, [searchText])
  );

  const renderPopularUsers = () => (
    <View style={styles.defaultContainer}>
      <AppText 
        variant="body" 
        fontFamily="raleway" 
        fontWeight="bold" 
        color={Colors.mutedWhite} 
        style={styles.popularAccountsTitle}
      >
        Cuentas populares
      </AppText>

      {/* Solo muestra skeleton si no hay datos */}
      {popularStatus === 'searching' && popularUsers.length === 0 &&  
        <View style={styles.skeletonContainer}>
          {[...Array(7)].map((_, i) => (
            <UserListItemSkeleton key={i} />
          ))}
        </View>
      }

      {/* Muestra la lista si hay datos, aunque esté recargando */}
      {popularUsers.length > 0 && (
        <UserList 
          users={popularUsers} 
          onUserPress={userId => navigation.navigate('UserProfile', { userId, userData: popularUsers.find(u => u.id === userId) })} 
        />
      )}

      {popularStatus === 'empty' && popularUsers.length === 0 && (
        <AppText color={Colors.mutedWhite} style={styles.centeredText}>
          No hay cuentas populares.
        </AppText>
      )}

      {popularStatus === 'error' && (
        <AppText color={'red'} style={styles.centeredText}>
          Error al cargar cuentas populares.
        </AppText>
      )}
    </View>
  );

  const renderSearchResults = () => {
    if (status === 'searching' && users.length > 0) {
      return (
        <>
          <UserList
            users={users}
            onUserPress={userId => navigation.navigate('UserProfile', { userId, userData: users.find(u => u.id === userId) })}
          />
          <View style={styles.skeletonContainer}>
            {[...Array(3)].map((_, i) => (
              <UserListItemSkeleton key={i} />
            ))}
          </View>
        </>
      );
    }

    if (status === 'searching' && users.length === 0) {
      return (
        <View>
          {[...Array(6)].map((_, i) => (
            <UserListItemSkeleton key={i} />
          ))}
        </View>
      );
    }

    if (status === 'success') {
      return (
        <UserList
          users={users}
          onUserPress={userId => handleUserPress(userId, navigation, currentUser?.id)}
        />
      );
    }

    if (status === 'empty') {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIconContainer}>
              <DeleteUserIcon size={28} color={Colors.mutedWhite} />
            </View>
            <AppText
              variant="body"
              fontFamily="inter"
              color={Colors.mutedWhite}
              style={styles.emptyText}
            >
              {`No se ha encontrado ningún \nusuario`}
            </AppText>
          </View>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <View style={styles.emptyContainer}>
          <AppText
            variant="body"
            fontFamily="inter"
            color={Colors.mutedWhite}
            style={styles.errorText}
          >
            Ha ocurrido un error al buscar usuarios. Intenta de nuevo.
          </AppText>
        </View>
      );
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          ref={searchBarRef}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar"
          autoFocus={fromSearchAnimation}
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.userListContainer}>
          {status === 'idle' && renderPopularUsers()}
          {renderSearchResults()}
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
  defaultContainer: {
    flex: 1,
  },
  popularAccountsTitle: {
    paddingLeft: 20,
    paddingVertical: 12
  },
  centeredText: {
    textAlign: 'center'
  },
  skeletonContainer: {
    marginTop: 12
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.backgroundSoft,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'left',
    fontSize: 16
  },
  errorText: {
    textAlign: 'left',
    fontSize: 16
  }
});