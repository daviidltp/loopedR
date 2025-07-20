import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { supabase } from '../utils/supabase';

// Polyfill para structuredClone
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Monitoriza cambios de estado de la app
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

interface AuthContextType {
  session: Session | null;
  user: any;
  isLoading: boolean;
  profileCompletionStep: number; // 0: sin datos, 1: solo display_name, 2: completo
  logout: () => Promise<void>;
  setUserProfileData: (username: string, displayName: string, avatar?: any, bio?: string, avatarBackgrounds?: string[]) => Promise<void>;
  setProfileCompletionStep: (step: number) => void; // Agregar setter
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletionStep, setProfileCompletionStep] = useState(0);

  useEffect(() => {
    console.log('[Auth] Iniciando AuthProvider');

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[onAuthStateChange] Auth state change:', event, !!session);
      
      try {
        if (session?.user?.id) {
          console.log('[onAuthStateChange] Hay sesión');
          // No verificar perfil aquí, lo hará el WelcomeScreen
        } else {
          console.log('[onAuthStateChange] No hay sesión');
          setProfileCompletionStep(0);
        }
        
        setSession(session);
      } catch (error) {
        console.error('[onAuthStateChange] Error en auth state change:', error);
        setSession(null);
        setProfileCompletionStep(0);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('[onAuthStateChange] Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('[Auth] Cerrando sesión...');
      
      setSession(null);
      setProfileCompletionStep(0);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Auth] Error al cerrar sesión:', error);
        throw error;
      }
      
      console.log('[Auth] Sesión cerrada correctamente');
    } catch (error) {
      console.error('[Auth] Error durante el cierre de sesión:', error);
      setSession(null);
      setProfileCompletionStep(0);
      throw error;
    }
  };

  const setUserProfileData = async (username: string, displayName: string, avatar?: any, bio?: string, avatarBackgrounds?: string[]) => {
    try {
      setIsLoading(true);
      if (!session?.user) throw new Error('No hay usuario en la sesión');

      // Convertir el avatar seleccionado a un URL guardable
      const getAvatarUrl = (selectedAvatar: any): string => {
        // Si ya es un string válido, devuélvelo tal cual
        if (typeof selectedAvatar === 'string') {
          return selectedAvatar;
        }
        
        // Si no es string, asume que es default_avatar
        return 'default_avatar';
      };

      const avatarUrl = getAvatarUrl(avatar);

      const updates = {
        id: session.user.id,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: typeof bio === 'string' ? bio : '',
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      console.log('[Auth] Perfil creado correctamente');
      setProfileCompletionStep(2);
      
    } catch (error) {
      console.error('[Auth] Error al actualizar perfil:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    session,
    user: session?.user || null,
    isLoading,
    profileCompletionStep,
    logout,
    setUserProfileData,
    setProfileCompletionStep, // Exponer el setter
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 