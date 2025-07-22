import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { UserProfile } from '../contexts/ProfileContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { convertSupabaseUserToUser, getSupabaseUserById, searchSupabaseUsers } from '../utils/userActions';

export type SearchStatus = 'idle' | 'searching' | 'success' | 'empty' | 'error';

export function useUserSearch(currentUser: UserProfile | null) {
  const stackNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const searchBarRef = useRef<any>(null);

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
        const supabaseUsers = await searchSupabaseUsers(searchText, currentUser.id);
        setAllUsers(prevAllUsers => {
          return supabaseUsers.map(supabaseUser => {
            const prevUser = prevAllUsers.find(u => u.id === supabaseUser.id);
            return prevUser
              ? { ...prevUser, ...convertSupabaseUserToUser(supabaseUser) }
              : convertSupabaseUserToUser(supabaseUser);
          });
        });
        setStatus(supabaseUsers.length > 0 ? 'success' : 'empty');
      } catch {
        setStatus('error');
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText, currentUser?.id]);

  const handleUserPress = (
    userId: string,
    navigation: any,
    currentUserId: string | undefined
  ) => {
    if (userId === currentUserId) {
      navigation.navigate('Profile');
    } else {
      const user = filteredUsers.find(u => u.id === userId);
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

  const handleClearSearch = () => {
    setSearchText('');
    searchBarRef.current?.clear?.();
    setAllUsers([]);
    setStatus('idle');
  };

  return {
    users: filteredUsers,
    status,
    searchText,
    setSearchText,
    handleUserPress,
    handleClearSearch,
    searchBarRef,
  };
} 