import * as WebBrowser from 'expo-web-browser';


// Configuración de Spotify OAuth
export const SPOTIFY_CONFIG = {
  CLIENT_ID: 'd00eaa071cf24e6aabb399d1efcfb2dc',
  CLIENT_SECRET: '57fd0f14d6884a91bb9c2c0dcbb3b541',
  REDIRECT_URI: 'https://example.com/callback', // Deep link para la app
  SCOPES: [
    'user-read-private',
    'user-read-email', 
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative'
  ]
};

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
}

// Obtener perfil del usuario
export const getUserProfile = async (accessToken: string): Promise<SpotifyUserProfile> => {
  try {
    console.log('Obteniendo perfil de usuario con token:', accessToken?.substring(0, 10) + '...');
    
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Respuesta de API getUserProfile:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en getUserProfile - Detalles:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}, body: ${errorText}`);
    }

    const userProfile: SpotifyUserProfile = await response.json();
    console.log('Perfil obtenido exitosamente:', userProfile.display_name);
    return userProfile;
  } catch (error) {
    console.error('Error obteniendo perfil de usuario:', error);
    throw error;
  }
};

// Intercambiar código de autorización por tokens de acceso
export const exchangeCodeForTokens = async (authorizationCode: string, redirectUri: string): Promise<SpotifyTokenResponse> => {
  
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  
  console.log('Intercambiando código de autorización:', authorizationCode?.substring(0, 10) + '...');
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: redirectUri,
  });

  // Crear header de autorización Basic
  const authString = `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`;
  const encodedAuth = btoa(authString); // Nota: En React Native podrías necesitar una librería para base64

  console.log('Datos de intercambio:', {
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedAuth}`,
      },
      body: body.toString(),
    });

    console.log('Respuesta de API exchangeCodeForTokens:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en exchangeCodeForTokens - Detalles:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}, body: ${errorText}`);
    }

    const tokenData: SpotifyTokenResponse = await response.json();
    console.log('Tokens obtenidos exitosamente, expires_in:', tokenData.expires_in);
    return tokenData;
  } catch (error) {
    console.error('Error intercambiando código por tokens:', error);
    throw error;
  }
};

// Refrescar token de acceso
export const refreshAccessToken = async (refreshToken: string): Promise<SpotifyTokenResponse> => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const authString = `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`;
  const encodedAuth = btoa(authString);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedAuth}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tokenData: SpotifyTokenResponse = await response.json();
    return tokenData;
  } catch (error) {
    console.error('Error refrescando token:', error);
    throw error;
  }
};

// Generar state aleatorio para seguridad OAuth
export const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Construir URL de autorización de Spotify
export const buildSpotifyAuthUrl = (): string => {
  const state = generateRandomState();
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    scope: SPOTIFY_CONFIG.SCOPES.join(' '),
    state: state,
    show_dialog: 'true' // Forzar mostrar diálogo de login
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Función para cerrar sesión/limpiar navegador
export const clearSpotifySession = async (): Promise<void> => {
  try {
    // Cerrar cualquier sesión del navegador web
    await WebBrowser.dismissBrowser();
    console.log('Sesión de navegador cerrada');
  } catch (error) {
    console.log('No hay sesión de navegador activa o error al cerrar:', error);
  }
}; 