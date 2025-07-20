import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

// Interfaz para el perfil del usuario basada en la tabla profiles de Supabase
export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  updated_at: string;
  avatar_url: string;
  refresh_token: string | null;
  bio: string;
  is_verified: boolean;
  is_public: boolean;
}

// Interfaz para los campos que se pueden actualizar
export interface ProfileUpdateFields {
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  is_verified?: boolean;
  is_public?: boolean;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updatedFields: ProfileUpdateFields) => Promise<void>;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile debe ser usado dentro de un ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el perfil completo desde Supabase
  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, display_name, email, updated_at, avatar_url, refresh_token, bio, is_verified, is_public')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        // Si el usuario no existe en profiles, crear un perfil básico
        if (fetchError.code === 'PGRST116') {
          console.log('[ProfileContext] Usuario no encontrado en profiles, creando perfil básico');
          setProfile({
            id: session.user.id,
            username: '',
            display_name: '',
            email: session.user.email || '',
            updated_at: new Date().toISOString(),
            avatar_url: 'default_avatar',
            refresh_token: null,
            bio: '',
            is_verified: false,
            is_public: true,
          });
          return;
        }
        throw fetchError;
      }

      if (data) {
        // Asegurar que los campos no sean null
        setProfile({
          ...data,
          username: data.username || '',
          display_name: data.display_name || '',
          email: data.email || '',
          avatar_url: data.avatar_url || 'default_avatar',
          bio: data.bio || '',
          is_verified: data.is_verified || false,
          is_public: data.is_public !== undefined ? data.is_public : true,
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('[ProfileContext] Error al obtener perfil:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async (updatedFields: ProfileUpdateFields) => {
    if (!session?.user?.id || !profile) {
      throw new Error('No hay sesión activa o perfil disponible');
    }

    try {
      setIsLoading(true);
      setError(null);

      const updates = {
        id: session.user.id,
        ...updatedFields,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (updateError) {
        throw updateError;
      }

      // Refrescar los datos del perfil desde Supabase para actualizar el estado local
      await fetchProfile();

      console.log('[ProfileContext] Perfil actualizado correctamente');
    } catch (err) {
      console.error('[ProfileContext] Error al actualizar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para refetch manual
  const refetch = async () => {
    await fetchProfile();
  };

  // Efecto para obtener el perfil cuando cambia la sesión
  useEffect(() => {
    fetchProfile();
  }, [session?.user?.id]);

  const contextValue: ProfileContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}; 