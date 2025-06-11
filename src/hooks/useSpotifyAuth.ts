import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { clearSpotifySession, exchangeCodeForTokens, getUserProfile, SPOTIFY_CONFIG } from '../utils/spotifyAuth';

// Importante: Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

interface UseSpotifyAuthParams {
  onSuccess?: (userProfile: any) => void;
  onError?: (error: any) => void;
}

export const useSpotifyAuth = ({ onSuccess, onError }: UseSpotifyAuthParams) => {
  // Generar el redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'loopedr',
  });
  
  console.log('Redirect URI generado:', redirectUri);

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
      // Intercambiar código por tokens usando el mismo redirect URI
      const tokens = await exchangeCodeForTokens(authorizationCode, redirectUri);
      console.log('Tokens obtenidos:', tokens);
      
      // Obtener perfil del usuario
      const userProfile = await getUserProfile(tokens.access_token);
      console.log('Perfil de usuario:', userProfile);
      
      // Llamar callback de éxito
      onSuccess?.(userProfile);
    } catch (error) {
      console.error('Error en autenticación:', error);
      onError?.(error);
    }
  };

  // Manejar respuesta de OAuth
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      if (code) {
        handleSpotifyAuth(code);
      }
    } else if (response?.type === 'error') {
      Alert.alert(
        'Error de autorización',
        response.params?.error_description || 'Error desconocido'
      );
    }
  }, [response]);

  const connectSpotify = async () => {
    try {
      // Cerrar cualquier sesión existente antes de conectar
      await clearSpotifySession();
      
      // Proceder con la autenticación
      await promptAsync();
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