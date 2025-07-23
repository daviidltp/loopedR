import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFollowers } from '../contexts/FollowersContext';
import { UserProfile } from '../contexts/ProfileContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { convertSupabaseUserToUser, getSupabaseUserById, getSupabaseUsers, searchSupabaseUsers } from '../utils/userActions';

// Definición extendida para los usuarios de búsqueda
export interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isPublic: boolean;
  followersCount: number;
  followingCount: number;
  followStatus: 'none' | 'pending' | 'accepted';
}

export type SearchStatus = 'idle' | 'searching' | 'success' | 'empty' | 'error';

export function useUserSearch(currentUser: UserProfile | null) {
  const stackNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const searchBarRef = useRef<any>(null);
  const [popularUsers, setPopularUsers] = useState<SearchUser[]>([]);
  const [popularStatus, setPopularStatus] = useState<SearchStatus>('idle');

  // Obtener funciones del contexto de followers
  const {
    fetchFollowersCount,
    fetchFollowingCount,
    fetchFollowStatus,
    follow,
    unfollow,
    cancelFollowRequest
  } = useFollowers();

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return [];
    const search = searchText.trim().toLowerCase();
    return allUsers.filter(
      u =>
        (u.username && u.username.toLowerCase().includes(search)) ||
        (u.displayName && u.displayName.toLowerCase().includes(search))
    );
  }, [searchText, allUsers]);

  useEffect(() => {
    if (!currentUser?.id || searchText.trim() === '') {
      setAllUsers([]);
      setStatus('idle');
      return;
    }

    if (allUsers.length > 0) {
      setStatus(filteredUsers.length === 0 ? 'empty' : 'searching');
    } else {
      setStatus('searching');
    }

    const timeoutId = setTimeout(async () => {
      try {
        const supabaseUsers = await searchSupabaseUsers(
          searchText,
          currentUser.id,
          fetchFollowersCount,
          fetchFollowingCount,
          fetchFollowStatus
        );
        setAllUsers(prevAllUsers => {
          return supabaseUsers.map(supabaseUser => {
            const prevUser = prevAllUsers.find(u => u.id === supabaseUser.id);
            // Siempre devolvemos el usuario completo, sobrescribiendo los datos antiguos
            return convertSupabaseUserToUser(supabaseUser);
          });
        });
        setStatus(supabaseUsers.length > 0 ? 'success' : 'empty');
      } catch {
        setStatus('error');
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText, currentUser?.id]);

  // Obtener los 5 usuarios más populares al montar o cambiar currentUser
  useEffect(() => {
    if (!currentUser?.id || status !== 'idle') {
      setPopularUsers([]);
      setPopularStatus('idle');
      return;
    }
    setPopularStatus('searching');
    getSupabaseUsers(
      currentUser.id,
      fetchFollowersCount,
      fetchFollowingCount,
      fetchFollowStatus
    )
      .then(users => {
        setPopularUsers(users.slice(0, 5).map(convertSupabaseUserToUser));
        setPopularStatus(users.length > 0 ? 'success' : 'empty');
      })
      .catch(() => {
        setPopularUsers([]);
        setPopularStatus('error');
      });
  }, [currentUser?.id, status]);

  const handleUserPress = (
    userId: string,
    navigation: any,
    currentUserId: string | undefined
  ) => {
    if (userId === currentUserId) {
      navigation.navigate('Profile');
    } else {
      // Buscar en ambos arrays
      const user = filteredUsers.find(u => u.id === userId) || popularUsers.find(u => u.id === userId);
      if (user) {
        stackNavigation.navigate('UserProfile', { userId, userData: user });
      } else {
        loadUserAndNavigate(userId);
      }
    }
  };

  const loadUserAndNavigate = async (userId: string) => {
    try {
      setStatus('searching');
      const supabaseUser = await getSupabaseUserById(userId);
      if (!supabaseUser) return;
      const user = convertSupabaseUserToUser(supabaseUser);
      setAllUsers(prevUsers => {
        const exists = prevUsers.some(u => u.id === user.id);
        return exists ? prevUsers : [...prevUsers, user];
      });
      setStatus('success');
      stackNavigation.navigate('UserProfile', { userId, userData: user });
    } catch {
      setStatus('error');
    }
  };

  const handleClearSearch = async () => {
    setSearchText('');
    searchBarRef.current?.clear?.();
    setAllUsers([]);
    setStatus('idle');
    if (currentUser?.id) {
      // No borres los populares antes de la recarga
      setPopularStatus('searching');
      try {
        const supabaseUsers = await getSupabaseUsers(
          currentUser.id,
          fetchFollowersCount,
          fetchFollowingCount,
          fetchFollowStatus
        );
        const newPopularUsers = supabaseUsers.slice(0, 5).map(convertSupabaseUserToUser);

        // Actualiza el array local solo con los cambios
        setPopularUsers(prevPopular => {
          // 1. Actualiza los que ya existen
          const updated = newPopularUsers.map(newUser => {
            const prev = prevPopular.find(u => u.id === newUser.id);
            return prev ? { ...prev, ...newUser } : newUser;
          });
          return updated;
        });

        setPopularStatus(newPopularUsers.length > 0 ? 'success' : 'empty');
      } catch {
        setPopularStatus('error');
      }
    }
  };

  // Nueva función para obtener los 5 usuarios más populares de Supabase
  const getPopularUsers = async () => {
    if (!currentUser?.id) return [];
    try {
      const supabaseUsers = await getSupabaseUsers(
        currentUser.id,
        fetchFollowersCount,
        fetchFollowingCount,
        fetchFollowStatus
      );
      return supabaseUsers.slice(0, 5).map(convertSupabaseUserToUser);
    } catch {
      return [];
    }
  };

  // Actualización optimista y acción de follow/unfollow/cancel
  const handleFollowAction = async (
    userId: string,
    action: 'follow' | 'unfollow' | 'cancel'
  ) => {
    let optimisticStatus: 'none' | 'pending' | 'accepted' = 'none';
    if (action === 'follow') optimisticStatus = 'pending';
    if (action === 'unfollow') optimisticStatus = 'none';
    if (action === 'cancel') optimisticStatus = 'none';

    // Guardar estado anterior
    const prevUsers = [...allUsers];
    const prevPopular = [...popularUsers];

    // Actualización optimista
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, followStatus: optimisticStatus } : u));
    setPopularUsers(prev => prev.map(u => u.id === userId ? { ...u, followStatus: optimisticStatus } : u));

    try {
      if (action === 'follow') await follow(userId);
      if (action === 'unfollow') await unfollow(userId);
      if (action === 'cancel') await cancelFollowRequest(userId);
    } catch (e) {
      // Revertir si falla
      setAllUsers(prevUsers);
      setPopularUsers(prevPopular);
      alert('Error al actualizar el seguimiento');
    }
  };

  return {
    users: filteredUsers,
    status,
    searchText,
    setSearchText,
    handleUserPress,
    handleClearSearch,
    searchBarRef,
    popularUsers,
    popularStatus,
    handleFollowAction,
    // Los usuarios ya incluyen followersCount y followingCount
  };
} 