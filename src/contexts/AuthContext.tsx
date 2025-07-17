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
  profileCompletionStep: number; // 0: sin datos, 1: solo display_name, 2: completo
  logout: () => Promise<void>;
  setUserProfileData: (username: string, displayName: string, avatar?: any, avatarBackgrounds?: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletionStep, setProfileCompletionStep] = useState(0);



  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[Auth] ===== SESIÓN INICIAL =====');
      console.log('[Auth] Sesión encontrada:', !!session);
      
      try {
        if (session) {
          console.log('[Auth] ID de usuario:', session.user?.id);
          console.log('[Auth] Email:', session.user?.email);
          console.log('[Auth] Provider:', session.user?.app_metadata?.provider);
          
          // Asumir directamente step 0 (sin verificación)
          setProfileCompletionStep(0);
        }
      } catch (error) {
        console.error('[Auth] 💥 Error en sesión inicial:', error);
        setProfileCompletionStep(0);
      }
      
      console.log('[Auth] 📱 Finalizando carga inicial...');
      setSession(session);
      setIsLoading(false);
      console.log('[Auth] ===============================');
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] ===== CAMBIO DE ESTADO =====');
      console.log('[Auth] Evento:', event);
      console.log('[Auth] Tiene sesión:', !!session);
      
      try {
        if (session) {
          console.log('[Auth] ✅ Usuario autenticado:', session.user?.email);
          console.log('[Auth] Provider:', session.user?.app_metadata?.provider);
          
          // Asumir directamente step 0 (sin verificación)
          setProfileCompletionStep(0);
        } else {
          console.log('[Auth] ❌ Sin sesión');
          setProfileCompletionStep(0);
        }
      } catch (error) {
        console.error('[Auth] 💥 Error en onAuthStateChange:', error);
        setProfileCompletionStep(0);
      }
      
      console.log('[Auth] 📱 Actualizando estado final...');
      setSession(session);
      setIsLoading(false);
      console.log('[Auth] ===============================');
    });

    return () => subscription.unsubscribe();

  }, []);

  // ✅ SOLUCIÓN ADICIONAL: Listener de cambios en tiempo real en la tabla profiles
  useEffect(() => {
    let profileSubscription: any = null;

    if (session?.user?.id) {
      console.log('[Auth] 🔄 Configurando listener de cambios en perfil...');
      
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
            console.log('[Auth] 🔔 Cambio detectado en perfil:', payload);
            
            // Asumir perfil completo cuando hay cambios en la tabla
            console.log('[Auth] 🎯 Perfil actualizado via listener - asumiendo completo');
            setProfileCompletionStep(2);
          }
        )
        .subscribe();
        
      console.log('[Auth] ✅ Listener de perfil configurado');
    }

    return () => {
      if (profileSubscription) {
        console.log('[Auth] 🔇 Desconectando listener de perfil');
        profileSubscription.unsubscribe();
      }
    };
  }, [session?.user?.id]);

  const logout = async () => {
    try {
      console.log('[Auth] Iniciando proceso de cierre de sesión...');
      
      // Limpiar el estado local primero
      setSession(null);
      setProfileCompletionStep(0);
      
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
      setProfileCompletionStep(0);
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
      
      // Asumir perfil completo después de guardar
      setProfileCompletionStep(2);
      console.log('[Auth] Estado actualizado - profileCompletionStep: 2 (completo)');
      
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