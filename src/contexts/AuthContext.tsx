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
  console.log('[AppState] Estado actual:', state);
  if (state === 'active') {
    console.log('[Supabase] Iniciando auto-refresh de sesión');
    supabase.auth.startAutoRefresh();
  } else {
    console.log('[Supabase] Deteniendo auto-refresh de sesión');
    supabase.auth.stopAutoRefresh();
  }
});

interface AuthContextType {
  session: Session | null;
  user: any;
  isLoading: boolean;
  hasCompletedProfile: boolean;
  logout: () => Promise<void>;
  setUserProfileData: (username: string, displayName: string, avatar?: any, avatarBackgrounds?: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // Función para verificar si el usuario tiene un perfil completado
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('[Auth] Error al verificar perfil:', error);
        return false;
      }

      const isComplete = data && data.username && data.display_name;
      console.log('[Auth] Perfil verificado:', { 
        hasUsername: !!data?.username, 
        hasDisplayName: !!data?.display_name,
        isComplete 
      });
      
      return isComplete;
    } catch (error) {
      console.error('[Auth] Error al verificar perfil:', error);
      return false;
    }
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[Auth] ===== SESIÓN INICIAL =====');
      console.log('[Auth] Sesión encontrada:', !!session);
      if (session) {
        console.log('[Auth] ID de usuario:', session.user?.id);
        console.log('[Auth] Email:', session.user?.email);
        console.log('[Auth] Provider:', session.user?.app_metadata?.provider);
        console.log('[Auth] Datos completos del usuario:', JSON.stringify(session.user, null, 2));
        
        // Verificar si el usuario tiene perfil completado
        const profileComplete = await checkProfileCompletion(session.user.id);
        setHasCompletedProfile(profileComplete);
      }
      console.log('[Auth] ===============================');
      setSession(session);
      setIsLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] ===== CAMBIO DE ESTADO =====');
      console.log('[Auth] Evento:', event);
      console.log('[Auth] Tiene sesión:', !!session);
      if (session) {
        console.log('[Auth] ✅ Usuario autenticado:', session.user?.email);
        console.log('[Auth] Provider:', session.user?.app_metadata?.provider);
        
        // Verificar si el usuario tiene perfil completado
        const profileComplete = await checkProfileCompletion(session.user.id);
        setHasCompletedProfile(profileComplete);
      } else {
        console.log('[Auth] ❌ Sin sesión');
        setHasCompletedProfile(false);
      }
      console.log('[Auth] ===============================');
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();

  }, []);

  const logout = async () => {
    try {
      console.log('[Auth] Iniciando proceso de cierre de sesión...');
      
      // Limpiar el estado local primero
      setSession(null);
      setHasCompletedProfile(false);
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[Auth] Error al cerrar sesión en Supabase:', error);
        throw error;
      }
      
      console.log('[Auth] ✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('[Auth] ❌ Error durante el cierre de sesión:', error);
      // Asegurar que el estado se limpie incluso si hay error
      setSession(null);
      setHasCompletedProfile(false);
      throw error;
    }
  };

  const setUserProfileData = async (username: string, displayName: string, avatar?: any, avatarBackgrounds?: string[]) => {
    try {
      setIsLoading(true);
      if (!session?.user) throw new Error('No hay usuario en la sesión');

      const updates = {
        id: session.user.id,
        username,
        display_name: displayName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      console.log('[Auth] Perfil actualizado correctamente');
      
      // Actualizar el estado de hasCompletedProfile después de guardar
      setHasCompletedProfile(true);
      
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
    hasCompletedProfile,
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