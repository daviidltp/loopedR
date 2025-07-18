import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

// Interfaz para el usuario actual basada en los datos de Supabase
export interface CurrentUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string; // Ahora viene de la BD
  isVerified: boolean; // Ahora viene de la BD
  isPublic: boolean; // Ahora viene de la BD
}

export const useCurrentUser = () => {
  const { session } = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir avatar_url de BD a avatarUrl completo
  const getFullAvatarUrl = (avatarUrl: string | null): string => {
    if (!avatarUrl || avatarUrl === 'default_avatar') {
      return 'default_avatar';
    }
    
    // Si es un archivo de imagen local, construir la URL completa
    const profileIcons = [
      'profileicon1.png',
      'profileicon2.png', 
      'profileicon6.png',
      'profileicon4.png',
      'profileicon5.png'
    ];
    
    if (profileIcons.includes(avatarUrl)) {
      // Para React Native, devolvemos el nombre del archivo
      // El componente que lo use sabrá cómo manejarlo
      return avatarUrl;
    }
    
    return avatarUrl;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!session?.user?.id) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, email, avatar_url, bio, is_verified, is_public')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const user: CurrentUser = {
            id: data.id,
            username: data.username || '',
            displayName: data.display_name || '',
            email: data.email || session.user.email || '',
            avatarUrl: getFullAvatarUrl(data.avatar_url),
            bio: data.bio ?? '',
            isVerified: data.is_verified ?? false,
            isPublic: data.is_public ?? true,
          };

          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('[useCurrentUser] Error al obtener usuario:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [session?.user?.id]);

  return {
    currentUser,
    isLoading,
    error,
    refetch: () => {
      if (session?.user?.id) {
        setIsLoading(true);
        // Re-ejecutar el efecto
      }
    }
  };
}; 