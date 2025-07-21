import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../contexts/ProfileContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { convertSupabaseUserToUser, getSupabaseUserById, getSupabaseUsers, searchSupabaseUsers } from '../utils/userActions';

export function useUserSearch(currentUser: UserProfile | null) {
  const stackNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
  const searchBarRef = useRef<any>(null);

  useEffect(() => {
    if (currentUser?.id) {
      loadUsers();
      setHasLoadedUsers(true);
    }
  }, [currentUser?.id]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const supabaseUsers = await getSupabaseUsers(currentUser?.id);
      const convertedUsers = supabaseUsers.map(convertSupabaseUserToUser);
      setUsers(convertedUsers);
    } catch (error) {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    if (searchText.trim() !== '') {
      setIsLoading(true);
    }
  }, [searchText]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const searchUsers = async () => {
      if (searchText.trim() === '') {
        setUsers([]); // <-- Limpia los resultados
        return;
      }
      try {
        setIsLoading(true);
        const supabaseUsers = await searchSupabaseUsers(searchText, currentUser.id);
        const convertedUsers = supabaseUsers.map(convertSupabaseUserToUser);
        setUsers(convertedUsers);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText, currentUser?.id, hasLoadedUsers]);

  const handleUserPress = (
    userId: string,
    navigation: NavigationProp<any>,
    currentUserId: string | undefined
  ) => {
    if (userId === currentUserId) {
      navigation.navigate('Profile');
    } else {
      const user = users.find(u => u.id === userId);
      if (user) {
        stackNavigation.navigate('UserProfile', { userId, userData: user });
      } else {
        loadUserAndNavigate(userId);
      }
    }
  };

  const loadUserAndNavigate = async (userId: string) => {
    try {
      setIsLoading(true);
      const supabaseUser = await getSupabaseUserById(userId);
      if (!supabaseUser) return;
      const user = convertSupabaseUserToUser(supabaseUser);
      setUsers(prevUsers => [...prevUsers, user]);
      stackNavigation.navigate('UserProfile', { userId, userData: user });
    } catch (error) {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    searchBarRef.current?.clear?.();
    setHasLoadedUsers(false);
  };

  return {
    users,
    isLoading,
    searchText,
    setSearchText,
    handleUserPress,
    handleClearSearch,
    searchBarRef,
  };
} 