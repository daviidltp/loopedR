import { useEffect, useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { convertSupabaseUserToUser, getSupabaseUserById } from '../utils/userActions';

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

export const useUser = (userId: string, userDataFromParams?: any) => {
  const { profile: currentUser, isLoading: currentUserLoading } = useProfile();
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        // Si es el usuario actual, usar los datos del contexto
        if (currentUser && currentUser.id === userId) {
          const unifiedUser: UnifiedUser = {
            id: currentUser.id,
            username: currentUser.username,
            displayName: currentUser.display_name,
            bio: currentUser.bio,
            avatarUrl: currentUser.avatar_url,
            isVerified: currentUser.is_verified,
            isPublic: currentUser.is_public,
            email: currentUser.email,
          };
          setUser(unifiedUser);
          setIsLoading(false);
          return;
        }

        // Si no es el usuario actual, obtener de Supabase
        const supabaseUser = await getSupabaseUserById(userId);
        if (supabaseUser) {
          const convertedUser = convertSupabaseUserToUser(supabaseUser);
          const unifiedUser: UnifiedUser = {
            id: convertedUser.id,
            username: convertedUser.username,
            displayName: convertedUser.displayName,
            bio: convertedUser.bio,
            avatarUrl: convertedUser.avatarUrl,
            isVerified: convertedUser.isVerified,
            isPublic: convertedUser.isPublic,
          };
          setUser(unifiedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('[useUser] Error al obtener usuario:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
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