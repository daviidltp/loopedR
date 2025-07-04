import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { clearSpotifySession, exchangeCodeForTokens, getUserProfile, SPOTIFY_CONFIG } from '../utils/spotifyAuth';

// Importante: Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

interface UseSpotifyAuthParams {
  onSuccess?: (userProfile: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export const useSpotifyAuth = ({ onSuccess, onError, onCancel }: UseSpotifyAuthParams) => {
  // Generar redirect URI basado en el entorno
  const redirectUri = Constants.appOwnership === 'expo' 
    ? AuthSession.makeRedirectUri() 
    : 'loopedr://callback';

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

  // Manejar autenticación completa con tokens
  const handleSpotifyAuth = async (authorizationCode: string) => {
    try {
      const tokens = await exchangeCodeForTokens(authorizationCode, redirectUri);
      const userProfile = await getUserProfile(tokens.access_token);
      if (onSuccess) {
        onSuccess(userProfile);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      if (onError) {
        onError(error);
      }
      Alert.alert(
        'Error de autenticación',
        'No se pudo completar la autenticación con Spotify'
      );
    }
  };

  // Manejar respuesta de OAuth
  useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        const { code } = response.params;
        if (code) {
          handleSpotifyAuth(code);
        } else {
          onError?.({ error: 'No authorization code received' });
        }
      } else if (response.type === 'error') {
        onError?.(response.params);
        Alert.alert(
          'Error de autorización',
          response.params?.error_description || 'Error desconocido'
        );
      } else if (response.type === 'dismiss' || response.type === 'cancel') {
        onCancel?.();
      }
    }
  }, [response]);

  const connectSpotify = async () => {
    try {
      await clearSpotifySession();
      await promptAsync({ showInRecents: true });
    } catch (error) {
      console.error('Error abriendo OAuth:', error);
      Alert.alert('Error', 'No se pudo abrir la autenticación de Spotify');
    }
  };

  return {
    connectSpotify,
    isLoading: !request,
  };
}; 