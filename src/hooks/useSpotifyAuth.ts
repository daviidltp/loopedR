import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { getRedirectUrl, supabase } from '../utils/supabase';

// Importante: Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

interface UseSpotifyAuthParams {
  onSuccess?: (userProfile: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export const useSpotifyAuth = ({ onSuccess, onError, onCancel }: UseSpotifyAuthParams) => {
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Configurar la URL de redirección apropiada
  const redirectUri = useMemo(() => {
    return getRedirectUrl();
  }, []);

  // Función para limpiar el timeout
  const clearAuthTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log('⏰ useSpotifyAuth: Auth timeout cleared');
    }
  }, []);

  // Función para resetear el estado de procesamiento
  const resetProcessingState = useCallback(() => {
    isProcessingRef.current = false;
    clearAuthTimeout();
  }, [clearAuthTimeout]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      console.log('🔄 useSpotifyAuth: Component unmounting, cleaning up');
      resetProcessingState();
    };
  }, [resetProcessingState]);

  // Función para decodificar JWT token
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ useSpotifyAuth: Error decoding JWT:', error);
      return null;
    }
  };

  // Función para extraer tokens de la URL de respuesta
  const extractTokensFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const fragment = urlObj.hash.substring(1); // Remove '#'
      const params = new URLSearchParams(fragment);
      
      return {
        access_token: params.get('access_token'),
        refresh_token: params.get('refresh_token'),
        expires_at: params.get('expires_at'),
        expires_in: params.get('expires_in'),
        provider_token: params.get('provider_token'),
        provider_refresh_token: params.get('provider_refresh_token'),
        token_type: params.get('token_type')
      };
    } catch (error) {
      console.error('❌ useSpotifyAuth: Error parsing URL:', error);
      return null;
    }
  };

  // Función para extraer errores de la URL de respuesta
  const extractErrorsFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      // Buscar errores en los query parameters
      const queryParams = new URLSearchParams(urlObj.search);
      const queryError = queryParams.get('error');
      const queryErrorCode = queryParams.get('error_code');
      const queryErrorDescription = queryParams.get('error_description');
      
      // Buscar errores en el fragment
      const fragment = urlObj.hash.substring(1);
      const fragmentParams = new URLSearchParams(fragment);
      const fragmentError = fragmentParams.get('error');
      const fragmentErrorCode = fragmentParams.get('error_code');
      const fragmentErrorDescription = fragmentParams.get('error_description');
      
      // Retornar el primer error encontrado
      const error = queryError || fragmentError;
      const errorCode = queryErrorCode || fragmentErrorCode;
      const errorDescription = queryErrorDescription || fragmentErrorDescription;
      
      if (error) {
        return {
          error,
          error_code: errorCode,
          error_description: errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ useSpotifyAuth: Error parsing URL for errors:', error);
      return null;
    }
  };

  // Callbacks estabilizados para evitar re-renders
  const stableOnSuccess = useCallback((userProfile: any) => {
    onSuccess?.(userProfile);
  }, [onSuccess]);

  const stableOnError = useCallback((error: any) => {
    onError?.(error);
  }, [onError]);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 useSpotifyAuth: Auth state changed:', event, {
          hasSession: !!session,
          isProcessing: isProcessingRef.current,
          sessionUser: session?.user?.id
        });
        
        // Solo procesar SIGNED_IN y evitar procesamiento múltiple
        if (event === 'SIGNED_IN' && session && session.user && !isProcessingRef.current) {
          isProcessingRef.current = true;
          clearAuthTimeout(); // Limpiar cualquier timeout existente
          
          console.log('✅ useSpotifyAuth: User signed in with Spotify, processing...');
          
          // Configurar timeout de seguridad
          timeoutRef.current = setTimeout(() => {
            console.log('⏰ useSpotifyAuth: Auth processing timeout reached');
            resetProcessingState();
            stableOnError({ error: 'Authentication timeout' });
          }, 30000); // 30 segundos timeout
          
          try {
            // Pequeño delay para evitar condiciones de carrera
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log('👤 useSpotifyAuth: Processing user data from session...');
            const user = session.user;
            
            console.log('📋 useSpotifyAuth: User metadata:', {
              hasUserMetadata: !!user.user_metadata,
              provider: user.app_metadata?.provider,
              email: user.email,
              metadataKeys: user.user_metadata ? Object.keys(user.user_metadata) : []
            });
            
            // Extraer datos del usuario de Spotify
            const userProfile = {
              id: user.id,
              display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
              email: user.email || '',
              images: user.user_metadata?.avatar_url ? [{ 
                url: user.user_metadata.avatar_url, 
                height: 300, 
                width: 300 
              }] : [],
              followers: { total: 0 },
              country: user.user_metadata?.country || 'ES',
              username: user.user_metadata?.user_name || user.user_metadata?.preferred_username || user.email?.split('@')[0] || 'user',
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
              // Datos adicionales de Spotify si están disponibles
              spotify_id: user.user_metadata?.provider_id || user.user_metadata?.sub,
              spotify_data: user.user_metadata
            };
            
            console.log('🎉 useSpotifyAuth: User profile prepared:', {
              id: userProfile.id,
              display_name: userProfile.display_name,
              email: userProfile.email,
              username: userProfile.username,
              hasSpotifyData: !!userProfile.spotify_id
            });
            
            console.log('🚀 useSpotifyAuth: Calling onSuccess callback...');
            
            // Ejecutar callback en el siguiente tick para evitar problemas de renderizado
            setTimeout(() => {
              resetProcessingState();
              stableOnSuccess(userProfile);
            }, 0);
            
          } catch (error) {
            console.error('❌ useSpotifyAuth: Error processing user data:', error);
            resetProcessingState();
            stableOnError(error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('⏹️ useSpotifyAuth: User signed out');
          resetProcessingState();
        } else if (event === 'TOKEN_REFRESHED' && session && session.user && !isProcessingRef.current) {
          console.log('🔄 useSpotifyAuth: Token refreshed, checking if we need to process...');
          // A veces la sesión se establece después del refresh
          // Verificar si deberíamos procesar esta sesión
        }
        // Ignorar otros eventos como INITIAL_SESSION
      }
    );

    return () => {
      console.log('🔄 useSpotifyAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [resetProcessingState, clearAuthTimeout, stableOnSuccess, stableOnError]);

  // Función para iniciar la autenticación con Spotify
  const connectSpotify = useCallback(async () => {
    if (isProcessingRef.current) {
      console.log('⏳ useSpotifyAuth: Already processing, ignoring duplicate call');
      return;
    }

    try {
      console.log('🚀 useSpotifyAuth: Initiating Spotify authentication with Supabase');
      console.log('🔗 useSpotifyAuth: Using redirect URI:', redirectUri);
      
      // Verificar que Supabase esté configurado correctamente
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
      console.log('🔧 useSpotifyAuth: Supabase config check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_SET'
      });
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase no está configurado correctamente');
      }
      
      isProcessingRef.current = true;
      
      // Cerrar cualquier sesión anterior
      console.log('🔄 useSpotifyAuth: Signing out previous session...');
      await supabase.auth.signOut();
      
      // Crear la URL de autenticación con Supabase
      console.log('🔄 useSpotifyAuth: Creating OAuth URL...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: redirectUri,
          scopes: 'user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative',
          queryParams: {
            show_dialog: 'true',  // Forzar mostrar diálogo de autorización
            prompt: 'consent'     // Forzar consentimiento
          }
        }
      });

      console.log('📋 useSpotifyAuth: OAuth response:', { 
        hasData: !!data, 
        hasUrl: !!data?.url, 
        hasError: !!error,
        errorMessage: error?.message 
      });

      if (error) {
        console.error('❌ useSpotifyAuth: OAuth error:', error);
        resetProcessingState();
        stableOnError(error);
        Alert.alert('Error de autenticación', error.message);
        return;
      }

      if (data?.url) {
        console.log('🔗 useSpotifyAuth: Opening browser with URL:', data.url);
        
        // Validar que la URL sea válida antes de abrir el navegador
        try {
          const parsedUrl = new URL(data.url);
          console.log('✅ useSpotifyAuth: URL validation passed:', {
            protocol: parsedUrl.protocol,
            hostname: parsedUrl.hostname,
            pathname: parsedUrl.pathname
          });
        } catch (urlError) {
          console.error('❌ useSpotifyAuth: Invalid URL received:', urlError);
          resetProcessingState();
          stableOnError({ error: 'Invalid authentication URL received' });
          return;
        }
        
        // Abrir el navegador con la URL de autenticación
        console.log('🔄 useSpotifyAuth: About to call WebBrowser.openAuthSessionAsync...');
        
        try {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUri,
            {
              showInRecents: true,
              // Configuraciones adicionales para mejorar la experiencia
              ...(Platform.OS === 'ios' && {
                dismissButtonStyle: 'cancel',
                readerMode: false,
              })
            }
          );
          
          console.log('🔄 useSpotifyAuth: Browser result:', result);
          
          // Verificar que el resultado sea válido
          if (typeof result === 'object' && result !== null && 'type' in result) {
            // Si el usuario cancela o hay error, limpiar el flag
            if (result.type === 'cancel' || result.type === 'dismiss') {
              console.log('⏹️ useSpotifyAuth: User cancelled authentication');
              resetProcessingState();
              onCancel?.();
              return;
            }
            
            // Si el resultado es exitoso y contiene una URL, procesarla
            if (result.type === 'success' && 'url' in result && typeof result.url === 'string') {
              console.log('✅ useSpotifyAuth: Browser returned success with URL');
              
              // Primero verificar si la URL contiene errores
              const authError = extractErrorsFromUrl(result.url);
              if (authError) {
                console.error('❌ useSpotifyAuth: Authentication error received:', authError);
                resetProcessingState();
                
                // Crear un mensaje de error más descriptivo
                let errorMessage = 'Error de autenticación con Spotify';
                if (authError.error_description) {
                  switch (authError.error_code) {
                    case 'unexpected_failure':
                      if (authError.error_description.includes('Database error')) {
                        errorMessage = 'Error en la base de datos al crear el usuario. Por favor, inténtalo de nuevo más tarde.';
                      } else {
                        errorMessage = 'Fallo inesperado durante la autenticación. Por favor, inténtalo de nuevo.';
                      }
                      break;
                    case 'access_denied':
                      errorMessage = 'Acceso denegado. Has cancelado la autorización o no has otorgado los permisos necesarios.';
                      break;
                    default:
                      errorMessage = authError.error_description;
                  }
                }
                
                stableOnError({ 
                  error: authError.error,
                  error_code: authError.error_code,
                  error_description: authError.error_description,
                  message: errorMessage
                });
                
                Alert.alert('Error de autenticación', errorMessage);
                return;
              }
              
              // Verificar si la URL contiene tokens (deep link response)
              if (result.url.includes('access_token=') || result.url.includes('code=')) {
                console.log('🔑 useSpotifyAuth: URL contains auth tokens, processing...');
                
                // Extraer tokens de la URL
                const tokens = extractTokensFromUrl(result.url);
                
                if (tokens && tokens.access_token && tokens.refresh_token) {
                  console.log('✅ useSpotifyAuth: Tokens extracted successfully');
                  
                  // Decodificar el JWT token para obtener los datos del usuario
                  const tokenPayload = decodeJWT(tokens.access_token);
                  
                  if (tokenPayload) {
                    console.log('📋 useSpotifyAuth: Token payload decoded successfully');
                    
                    // Extraer datos del usuario desde el token
                    const userProfile = {
                      id: tokenPayload.sub,
                      display_name: tokenPayload.user_metadata?.full_name || tokenPayload.user_metadata?.name || tokenPayload.email?.split('@')[0] || 'Usuario',
                      email: tokenPayload.email || '',
                      images: tokenPayload.user_metadata?.avatar_url ? [{ 
                        url: tokenPayload.user_metadata.avatar_url, 
                        height: 300, 
                        width: 300 
                      }] : [],
                      followers: { total: 0 },
                      country: tokenPayload.user_metadata?.country || 'ES',
                      username: tokenPayload.user_metadata?.user_name || tokenPayload.user_metadata?.preferred_username || tokenPayload.email?.split('@')[0] || 'user',
                      name: tokenPayload.user_metadata?.full_name || tokenPayload.user_metadata?.name || tokenPayload.email?.split('@')[0] || 'Usuario',
                      // Datos adicionales de Spotify si están disponibles
                      spotify_id: tokenPayload.user_metadata?.provider_id || tokenPayload.user_metadata?.sub,
                      spotify_data: tokenPayload.user_metadata
                    };
                    
                    console.log('🎉 useSpotifyAuth: User profile prepared from token');
                    console.log('🚀 useSpotifyAuth: Calling onSuccess callback directly...');
                    
                    // Ejecutar callback directamente
                    setTimeout(() => {
                      resetProcessingState();
                      stableOnSuccess(userProfile);
                    }, 0);
                    
                    return;
                  } else {
                    console.error('❌ useSpotifyAuth: Failed to decode token payload');
                    resetProcessingState();
                    stableOnError({ error: 'Failed to decode token payload' });
                    return;
                  }
                } else {
                  console.error('❌ useSpotifyAuth: Failed to extract tokens from URL');
                  resetProcessingState();
                  stableOnError({ error: 'Failed to extract tokens from response' });
                  return;
                }
              }
            }
            
            // El listener de onAuthStateChange se encargará del resto
            console.log('⏳ useSpotifyAuth: Waiting for auth state change...');
          } else {
            console.log('⏳ useSpotifyAuth: Browser opened, waiting for auth state change...');
          }
          
        } catch (browserError) {
          console.error('❌ useSpotifyAuth: Error opening browser:', browserError);
          resetProcessingState();
          stableOnError({ error: 'Failed to open browser for authentication' });
          Alert.alert(
            'Error', 
            'No se pudo abrir el navegador para la autenticación. Verifica tu conexión a internet y vuelve a intentarlo.'
          );
          return;
        }
        
      } else {
        console.error('❌ useSpotifyAuth: No URL received from Supabase');
        resetProcessingState();
        stableOnError({ error: 'No authentication URL received' });
      }
      
    } catch (error) {
      console.error('❌ useSpotifyAuth: Error launching OAuth:', error);
      resetProcessingState();
      Alert.alert('Error', 'No se pudo iniciar la autenticación con Spotify');
      stableOnError(error);
    }
  }, [redirectUri, onError, onCancel, resetProcessingState, decodeJWT, extractTokensFromUrl, extractErrorsFromUrl, stableOnSuccess, stableOnError]);

  return {
    connectSpotify,
    isLoading: false,
  };
}; 