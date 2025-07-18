import { useEffect, useState } from 'react';
import { mockUsers } from '../utils/mockData';
import { useCurrentUser } from './useCurrentUser';

// Interfaz unificada que combina User de mockData con CurrentUser de Supabase
export interface UnifiedUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isPublic: boolean;
  email?: string; // Solo disponible para el usuario actual
}

export const useUser = (userId: string) => {
  const { currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      setIsLoading(true);

      // Si es el usuario actual y tenemos datos de Supabase
      if (currentUser && currentUser.id === userId) {
        const unifiedUser: UnifiedUser = {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          bio: currentUser.bio,
          avatarUrl: currentUser.avatarUrl,
          isVerified: currentUser.isVerified,
          isPublic: currentUser.isPublic,
          email: currentUser.email,
        };
        setUser(unifiedUser);
        setIsLoading(false);
        return;
      }

      // Si no es el usuario actual o no tenemos datos de Supabase, usar mockData
      const mockUser = mockUsers.find(u => u.id === userId);
      if (mockUser) {
        const unifiedUser: UnifiedUser = {
          id: mockUser.id,
          username: mockUser.username,
          displayName: mockUser.displayName,
          bio: mockUser.bio,
          avatarUrl: mockUser.avatarUrl,
          isVerified: mockUser.isVerified,
          isPublic: mockUser.isPublic,
        };
        setUser(unifiedUser);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    // Solo ejecutar cuando tengamos la información del usuario actual o cuando no esté cargando
    if (!currentUserLoading) {
      fetchUser();
    }
  }, [userId, currentUser, currentUserLoading]);

  return {
    user,
    isLoading: isLoading || currentUserLoading,
  };
}; 