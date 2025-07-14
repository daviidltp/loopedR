import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';

interface UserProfile {
  id?: string;
  display_name?: string;
  email?: string;
  images?: Array<{ url: string; height: number; width: number }>;
  followers?: { total: number };
  country?: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: any; // Avatar seleccionado (puede ser una imagen o DEFAULT_AVATAR_ID)
  avatarBackgroundColor?: string; // Color de fondo específico del avatar seleccionado
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasCompletedProfile: boolean;
  setUser: (user: UserProfile | null) => void;
  setUserProfileData: (username: string, name: string, avatar?: any, avatarBackgrounds?: string[]) => void;
  logout: () => Promise<void>;
  connectSpotify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@user_data',
  AUTH_STATUS: '@auth_status',
  PROFILE_COMPLETED: '@profile_completed',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  useEffect(() => {
    console.log('AuthProvider: Initializing Supabase auth session');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session loaded:', !!session);
      setSession(session);
      if (session?.user) {
        loadUserFromSession(session);
      } else {
        loadUserData(); // Fallback to local storage for users without Spotify
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, !!session);
      setSession(session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('AuthProvider: User signed in with Spotify');
        await handleSpotifySignIn(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: User signed out');
        await handleSignOut();
      }
      
      setIsLoading(false);
    });

    // Handle deep link for OAuth callback
    const handleDeepLink = (url: string) => {
      console.log('AuthProvider: Deep link received:', url);
      
      // Check if this is an auth callback
      if (url.includes('auth-callback') || url.includes('#access_token=') || url.includes('?access_token=')) {
        console.log('AuthProvider: Processing OAuth callback from deep link');
        
        try {
          // Extract the fragment/query from the URL
          let fragment = '';
          
          if (url.includes('#')) {
            fragment = url.split('#')[1];
          } else if (url.includes('?')) {
            fragment = url.split('?')[1];
          }
          
          if (fragment) {
            console.log('AuthProvider: Parsing URL fragment:', fragment);
            
            // Parse the fragment parameters
            const params = new URLSearchParams(fragment);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const tokenType = params.get('token_type');
            const expiresIn = params.get('expires_in');
            
            if (accessToken) {
              console.log('AuthProvider: Setting session from deep link callback');
              
              // Create session object
              const sessionData = {
                access_token: accessToken,
                refresh_token: refreshToken || '',
                token_type: tokenType || 'bearer',
                expires_in: expiresIn ? parseInt(expiresIn) : 3600,
              };
              
              supabase.auth.setSession(sessionData);
            } else {
              console.warn('AuthProvider: No access token found in deep link');
            }
          } else {
            console.warn('AuthProvider: No fragment or query found in deep link URL');
          }
        } catch (error) {
          console.error('AuthProvider: Error processing deep link:', error);
        }
      }
    };

    // Listen for deep links
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription?.remove();
    };
  }, []);

  const loadUserFromSession = async (session: Session) => {
    try {
      console.log('AuthProvider: Loading user from Spotify session');
      
      // Get Spotify user data from the session
      const spotifyUser = session.user.user_metadata;
      
      if (spotifyUser) {
        // Create user profile from Spotify data
        const userProfile: UserProfile = {
          id: session.user.id,
          display_name: spotifyUser.full_name || spotifyUser.name,
          email: session.user.email,
          images: spotifyUser.avatar_url ? [{ url: spotifyUser.avatar_url, height: 300, width: 300 }] : [],
          username: spotifyUser.preferred_username || spotifyUser.user_name || session.user.email?.split('@')[0] || 'spotify_user',
          name: spotifyUser.full_name || spotifyUser.name || 'Usuario de Spotify',
          country: spotifyUser.country,
        };

        await saveUserData(userProfile);
        setUser(userProfile);
        
        // Check if user needs to complete profile setup
        // For Spotify users, we navigate to CreateProfile to let them customize their profile
        console.log('AuthProvider: Spotify user loaded, needs to complete profile setup');
        setHasCompletedProfile(false); // Force them to go through CreateProfile
      }
    } catch (error) {
      console.error('AuthProvider: Error loading user from session:', error);
    }
  };

  const handleSpotifySignIn = async (session: Session) => {
    try {
      console.log('AuthProvider: Handling Spotify sign in');
      await loadUserFromSession(session);
      console.log('AuthProvider: Spotify user loaded, will navigate to CreateProfile');
    } catch (error) {
      console.error('AuthProvider: Error handling Spotify sign in:', error);
      Alert.alert('Error', 'No se pudo completar la autenticación con Spotify');
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('AuthProvider: Handling sign out');
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATUS),
        AsyncStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETED),
      ]);
      setUser(null);
      setHasCompletedProfile(false);
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error);
    }
  };

  // Fallback: Load user data from AsyncStorage (for users without Spotify)
  const loadUserData = async () => {
    try {
      const [userData, profileCompleted] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETED),
      ]);

      console.log('AuthProvider: Loading local user data:', {
        hasUserData: !!userData,
        profileCompleted
      });

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setHasCompletedProfile(profileCompleted === 'true');
      } else {
        setUser(null);
        setHasCompletedProfile(false);
      }
    } catch (error) {
      console.error('AuthProvider: Error loading local user data:', error);
      setUser(null);
      setHasCompletedProfile(false);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in'),
        // Don't set profile as completed for Spotify users until they go through CreateProfile
      ]);
      setUser(userData);
    } catch (error) {
      console.error('AuthProvider: Error saving user data:', error);
    }
  };

  const setUserProfileData = async (username: string, name: string, avatar?: any, avatarBackgrounds?: string[]) => {
    // Array de avatares preestablecidos (mismo orden que en PresetAvatarGrid)
    const PRESET_AVATARS = [
      require('../../assets/images/profilePics/profileicon1.png'),
      require('../../assets/images/profilePics/profileicon2.png'),
      require('../../assets/images/profilePics/profileicon6.png'),
      require('../../assets/images/profilePics/profileicon4.png'),
      require('../../assets/images/profilePics/profileicon5.png'),
    ];

    const DEFAULT_AVATAR_ID = 'default_avatar';

    // Determinar el color de fondo correcto basándose en el avatar seleccionado
    let avatarBackgroundColor = '#222222'; // Color por defecto
    if (avatarBackgrounds) {
      if (avatar === DEFAULT_AVATAR_ID) {
        // DefaultAvatar está en el índice 5
        avatarBackgroundColor = avatarBackgrounds[5] || '#222222';
      } else {
        // Buscar el índice del avatar preestablecido
        const avatarIndex = PRESET_AVATARS.findIndex(presetAvatar => presetAvatar === avatar);
        if (avatarIndex !== -1) {
          avatarBackgroundColor = avatarBackgrounds[avatarIndex] || '#222222';
        }
      }
    }

    console.log('AuthProvider: Saving profile data and completing profile setup:', {
      avatar: avatar === DEFAULT_AVATAR_ID ? 'DEFAULT_AVATAR' : 'PRESET_AVATAR',
      avatarBackgroundColor,
    });

    const userData = {
      username,
      name,
      avatar,
      avatarBackgroundColor,
      // Si hay un usuario previo, mantener sus datos de Spotify
      ...(user || {}),
    };
    
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in'),
        AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, 'true'), // Now mark profile as completed
      ]);
      setUser(userData);
      setHasCompletedProfile(true); // This will trigger navigation to main app
      
      console.log('AuthProvider: Profile setup completed, navigation will trigger automatically');
    } catch (error) {
      console.error('AuthProvider: Error saving profile data:', error);
    }
  };

  /**
   * Connect with Spotify using Supabase OAuth
   * Uses WebBrowser to open OAuth URL in React Native
   */
  const connectSpotify = async (): Promise<void> => {
    try {
      console.log('AuthProvider: Initiating Spotify OAuth with Supabase');
      
      const redirectTo = `loopedr://auth-callback`;
      console.log('AuthProvider: Using redirect URL:', redirectTo);
      
      // Get the OAuth URL from Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: 'user-read-email user-read-recently-played user-top-read',
          redirectTo: redirectTo,
          skipBrowserRedirect: true, // Important for React Native
        },
      });

      if (error) {
        console.error('AuthProvider: Spotify OAuth error:', error);
        throw error;
      }

      if (!data?.url) {
        console.error('AuthProvider: No OAuth URL received from Supabase');
        throw new Error('No OAuth URL received from Supabase');
      }

      console.log('AuthProvider: Opening Spotify OAuth URL in browser');
      
      // Open the OAuth URL in the browser
      const result = await WebBrowser.openBrowserAsync(data.url, {
        showTitle: false,
        showInRecents: false,
      });

      console.log('AuthProvider: Browser result:', result.type);
      
      // The OAuth flow will continue via deep linking
      // onAuthStateChange will handle the session when the user returns
      
    } catch (error) {
      console.error('AuthProvider: Error connecting to Spotify:', error);
      throw error;
    }
  };

  /**
   * Logout function using Supabase auth
   * Maintains the same interface as the original function
   */
  const logout = async () => {
    try {
      console.log('AuthProvider: Initiating logout process');
      
      // Small delay to prevent rendering conflicts during state transitions
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Sign out from Supabase (this will trigger onAuthStateChange)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Supabase logout error:', error);
        // Continue with local cleanup even if Supabase logout fails
      }
      
      console.log('AuthProvider: Logout completed successfully');
    } catch (error) {
      console.error('AuthProvider: Error during logout process:', error);
      // Ensure state is cleared even if logout fails
      await handleSignOut();
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
    session,
    isLoading,
    isLoggedIn: hasCompletedProfile,
    hasCompletedProfile,
    setUser: handleSetUser,
    setUserProfileData,
    logout,
    connectSpotify,
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