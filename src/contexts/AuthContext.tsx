import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id?: string;
  display_name?: string;
  email?: string;
  images?: Array<{ url: string; height: number; width: number }>;
  followers?: { total: number };
  country?: string;
  username: string;
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasCompletedProfile: boolean;
  setUser: (user: UserProfile | null) => void;
  setUserProfileData: (username: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@user_data',
  AUTH_STATUS: '@auth_status',
  PROFILE_COMPLETED: '@profile_completed',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [userData, profileCompleted] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETED),
      ]);

      console.log('AuthContext - Datos cargados:', {
        hasUserData: !!userData,
        profileCompleted
      });

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setHasCompletedProfile(profileCompleted === 'true');
      } else {
        // Asegurarnos que los estados estén limpios si no hay datos
        setUser(null);
        setHasCompletedProfile(false);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      // En caso de error, también limpiamos los estados
      setUser(null);
      setHasCompletedProfile(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in'),
      ]);
      setUser(userData);
    } catch (error) {
      console.error('Error guardando datos del usuario:', error);
    }
  };

  const setUserProfileData = async (username: string, name: string) => {
    const userData = {
      username,
      name,
      // Si hay un usuario previo, mantener sus datos de Spotify
      ...(user || {}),
    };
    
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, 'true'),
      ]);
      setUser(userData);
      setHasCompletedProfile(true);
    } catch (error) {
      console.error('Error guardando datos del perfil:', error);
    }
  };

  const logout = async () => {
    try {
      // Pequeño delay para evitar conflictos de renderizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATUS),
        AsyncStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED),
      ]);
      setUser(null);
      setHasCompletedProfile(false);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const handleSetUser = (userData: UserProfile | null) => {
    if (userData) {
      saveUserData(userData);
    } else {
      logout();
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: hasCompletedProfile,
    hasCompletedProfile,
    setUser: handleSetUser,
    setUserProfileData,
    logout,
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