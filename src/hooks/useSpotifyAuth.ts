import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { clearSpotifySession, exchangeCodeForTokens, getUserProfile, SPOTIFY_CONFIG } from '../utils/spotifyAuth';

// Importante: Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

interface UseSpotifyAuthParams {
  onSuccess?: (userProfile: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export const useSpotifyAuth = ({ onSuccess, onError, onCancel }: UseSpotifyAuthParams) => {
  // iOS timeout reference for emergency fallback to prevent infinite loading
  const iOSTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);
  
  // Memoize redirect URI to prevent constant re-calculation
  const redirectUri = useMemo(() => {
    const uri = Constants.appOwnership === 'expo' 
      ? AuthSession.makeRedirectUri() 
      : 'loopedr://callback';
    console.log('useSpotifyAuth: Redirect URI configured:', uri);
    return uri;
  }, []);

  // Configurar la solicitud de autorización de Spotify
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CONFIG.CLIENT_ID,
      scopes: SPOTIFY_CONFIG.SCOPES,
      usePKCE: false,
      redirectUri: redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        show_dialog: 'true',
      },
    },
    {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    }
  );

  // Clear any existing iOS timeout when component unmounts
  useEffect(() => {
    return () => {
      if (iOSTimeoutRef.current) {
        clearTimeout(iOSTimeoutRef.current);
        iOSTimeoutRef.current = null;
      }
    };
  }, []);

  // Manejar autenticación completa con tokens
  const handleSpotifyAuth = useCallback(async (authorizationCode: string) => {
    try {
      console.log('useSpotifyAuth: Processing authorization code');
      const tokens = await exchangeCodeForTokens(authorizationCode, redirectUri);
      const userProfile = await getUserProfile(tokens.access_token);
      onSuccess?.(userProfile);
    } catch (error) {
      console.error('useSpotifyAuth: Authentication error:', error);
      onError?.(error);
      Alert.alert(
        'Error de autenticación',
        'No se pudo completar la autenticación con Spotify'
      );
    } finally {
      isProcessingRef.current = false;
    }
  }, [redirectUri, onSuccess, onError]);

  // Clear iOS timeout helper function
  const clearIOSTimeout = useCallback(() => {
    if (iOSTimeoutRef.current) {
      clearTimeout(iOSTimeoutRef.current);
      iOSTimeoutRef.current = null;
      console.log('useSpotifyAuth: iOS timeout cleared');
    }
  }, []);

  // Force cancel for iOS timeout
  const forceCancel = useCallback(() => {
    console.log('useSpotifyAuth: Force cancel triggered (timeout)');
    clearIOSTimeout();
    isProcessingRef.current = false;
    onCancel?.();
  }, [clearIOSTimeout, onCancel]);

  // Manejar respuesta de OAuth
  useEffect(() => {
    if (response && !isProcessingRef.current) {
      console.log('useSpotifyAuth: OAuth response received:', response.type);
      
      // Clear iOS timeout since we got a response
      clearIOSTimeout();
      isProcessingRef.current = true;
      
      if (response.type === 'success') {
        const { code } = response.params;
        if (code) {
          handleSpotifyAuth(code);
        } else {
          console.error('useSpotifyAuth: No authorization code in success response');
          onError?.({ error: 'No authorization code received' });
          isProcessingRef.current = false;
        }
      } else if (response.type === 'error') {
        console.error('useSpotifyAuth: OAuth error response:', response.params);
        onError?.(response.params);
        isProcessingRef.current = false;
        Alert.alert(
          'Error de autorización',
          response.params?.error_description || 'Error desconocido'
        );
      } else if (response.type === 'dismiss' || response.type === 'cancel') {
        console.log('useSpotifyAuth: OAuth cancelled or dismissed');
        onCancel?.();
        isProcessingRef.current = false;
      }
    }
  }, [response, clearIOSTimeout, handleSpotifyAuth, onError, onCancel]);

  const connectSpotify = useCallback(async () => {
    if (isProcessingRef.current) {
      console.log('useSpotifyAuth: Already processing, ignoring duplicate call');
      return;
    }

    try {
      console.log('useSpotifyAuth: Initiating Spotify connection');
      isProcessingRef.current = true;
      
      // Clear any existing timeout
      clearIOSTimeout();
      
      // Clear previous session
      await clearSpotifySession();
      
      // Set iOS-specific timeout for emergency fallback
      if (Platform.OS === 'ios') {
        console.log('useSpotifyAuth: Setting iOS emergency timeout (10 seconds)');
        iOSTimeoutRef.current = setTimeout(() => {
          console.log('useSpotifyAuth: iOS timeout reached - forcing cancel');
          forceCancel();
        }, 10000); // Reduced to 10 seconds for faster feedback
      }
      
      // Launch OAuth flow
      console.log('useSpotifyAuth: Launching OAuth browser');
      const result = await promptAsync({ 
        showInRecents: true,
        // iOS-specific configuration to ensure proper behavior
        ...(Platform.OS === 'ios' && {
          dismissButtonStyle: 'cancel',
          readerMode: false,
        })
      });
      
      console.log('useSpotifyAuth: promptAsync result:', result);
      
    } catch (error) {
      console.error('useSpotifyAuth: Error launching OAuth:', error);
      clearIOSTimeout();
      isProcessingRef.current = false;
      Alert.alert('Error', 'No se pudo abrir la autenticación de Spotify');
      onError?.(error);
    }
  }, [clearIOSTimeout, forceCancel, promptAsync, onError]);

  return {
    connectSpotify,
    isLoading: !request,
  };
}; 
