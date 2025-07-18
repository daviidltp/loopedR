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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletionStep, setProfileCompletionStep] = useState(0);



  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session) {
          // Asumir directamente step 0 (sin verificación)
          setProfileCompletionStep(0);
        }
      } catch (error) {
        console.error('[Auth] Error en sesión inicial:', error);
        setProfileCompletionStep(0);
      }
      
      setSession(session);
      setIsLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          console.log('[Auth] Usuario autenticado:', session.user?.email);
          // Asumir directamente step 0 (sin verificación)
          setProfileCompletionStep(0);
        } else {
          console.log('[Auth] Sesión cerrada');
          setProfileCompletionStep(0);
        }
      } catch (error) {
        console.error('[Auth] Error en onAuthStateChange:', error);
        setProfileCompletionStep(0);
      }
      
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Listener de cambios en tiempo real en la tabla profiles
  useEffect(() => {
    let profileSubscription: any = null;

    if (session?.user?.id) {
      profileSubscription = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          },
          async (payload) => {
            // Asumir perfil completo cuando hay cambios en la tabla
            setProfileCompletionStep(2);
          }
        )
        .subscribe();
    }

    return () => {
      if (profileSubscription) {
        profileSubscription.unsubscribe();
      }
    };
  }, [session?.user?.id]);

  const logout = async () => {
    try {
      console.log('[Auth] Cerrando sesión...');
      
      // Limpiar el estado local primero
      setSession(null);
      setProfileCompletionStep(0);
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Auth] Error al cerrar sesión:', error);
        throw error;
      }
      
      console.log('[Auth] Sesión cerrada correctamente');
    } catch (error) {
      console.error('[Auth] Error durante el cierre de sesión:', error);
      // Asegurar que el estado se limpie incluso si hay error
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
      const getAvatarUrl = (selectedAvatar: any): string | null => {
        // Si es el avatar por defecto (con iniciales)
        if (selectedAvatar === 'default_avatar') {
          return 'default_avatar';
        }
        
        // Si es uno de los avatares preset, obtener su índice
        const presetAvatars = [
          require('@assets/images/profilePics/profileicon1.png'),
          require('@assets/images/profilePics/profileicon2.png'),
          require('@assets/images/profilePics/profileicon6.png'),
          require('@assets/images/profilePics/profileicon4.png'),
          require('@assets/images/profilePics/profileicon5.png'),
        ];
        
        const avatarIndex = presetAvatars.findIndex(presetAvatar => presetAvatar === selectedAvatar);
        if (avatarIndex !== -1) {
          // Mapear índice a nombre de archivo
          const avatarFileNames = [
            'profileicon1.png',
            'profileicon2.png', 
            'profileicon6.png',
            'profileicon4.png',
            'profileicon5.png'
          ];
          return avatarFileNames[avatarIndex];
        }
        
        // Si no se reconoce el avatar, usar default
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

      console.log('[Auth] Perfil creado correctamente con avatar:', avatarUrl);
      // Asumir perfil completo después de guardar
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