import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert } from 'react-native';
import { getRedirectUrl, supabase } from '../utils/supabase';

// Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

export const useSpotifyAuth = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Guarda los 5 artistas top del usuario en el último mes en la tabla top_month_artists,
   * solo si no existen registros previos para ese user_id.
   * @param {string} userId - ID del usuario en Supabase
   * @param {string} provider_token - Access token de Spotify
   */
  const saveInitialTopArtists = async (userId: string, provider_token: string) => {
    try {
      // 1. Comprobar si ya existen registros para este usuario
      const { data: existing, error: checkError } = await supabase
        .from('top_month_artists')
        .select('user_id')
        .eq('user_id', userId)
        .limit(1);
      if (checkError) {
        console.error('[SpotifyAuth] Error comprobando top_month_artists:', checkError);
        return;
      }
      if (existing && existing.length > 0) {
        // Ya existen registros, no hacer nada
        return;
      }

      // 2. Llamar a la API de Spotify para obtener los 5 artistas top
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term', {
        headers: {
          Authorization: `Bearer ${provider_token}`,
        },
      });
      if (!response.ok) {
        console.error('[SpotifyAuth] Error obteniendo top artists de Spotify:', response.status, await response.text());
        return;
      }
      const data = await response.json();
      const artists = data.items || [];
      if (artists.length === 0) {
        console.log('[SpotifyAuth] El usuario no tiene artistas top para guardar.');
        return;
      }

      // 3. Preparar los registros para insertar
      const now = new Date().toISOString();
      const records = artists.map((artist: any, index: number) => ({
        user_id: userId,
        artist_id: artist.id || null,
        artist_name: artist.name || '',
        artist_image_url: artist.images?.[0]?.url || null,
        position: index + 1,
        retrieved_at: now,
      }));

      // 4. Insertar en la tabla
      const { error: insertError } = await supabase.from('top_month_artists').insert(records);
      if (insertError) {
        console.error('[SpotifyAuth] Error insertando top_month_artists:', insertError);
      } else {
        console.log('[SpotifyAuth] Top 5 artistas guardados correctamente en top_month_artists.');
      }
    } catch (err) {
      console.error('[SpotifyAuth] Error inesperado en saveInitialTopArtists:', err);
    }
  };

  const signInWithSpotify = async () => {
    setLoading(true);
    console.log('[SpotifyAuth] Iniciando autenticación con Spotify...');

    const redirectUri = getRedirectUrl();

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: redirectUri,
          scopes: 'user-read-email user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative',
          queryParams: { prompt: 'login', show_dialog: 'true' },
        }
      });

      if (error) {
        console.error('[SpotifyAuth] Error:', error);
        Alert.alert('Error', error.message);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );
        
        if (result.type === 'cancel') {
          console.log('[SpotifyAuth] Autenticación cancelada por el usuario');
          Alert.alert('Cancelado', 'Autenticación cancelada');
        } else if (result.type === 'success') {
          console.log('[SpotifyAuth] Autenticación exitosa, procesando tokens...');
          // Extraer tokens de la URL
          try {
            const url = new URL(result.url);
            const fragment = url.hash.substring(1); // Remove '#'
            const params = new URLSearchParams(fragment);
            
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
			const provider_token = params.get('provider_token');
			const providerRefreshToken = params.get('provider_refresh_token');
            
            if (accessToken && refreshToken) {
              // Establecer la sesión manualmente en Supabase
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (sessionError) {
                console.error('[SpotifyAuth] Error estableciendo sesión:', sessionError);
                Alert.alert('Error', 'No se pudo establecer la sesión');
              } else {
                console.log('[SpotifyAuth] Sesión establecida correctamente');
				if (providerRefreshToken) {
					// Obtener el usuario actual
					const { data: { user }, error: userError } = await supabase.auth.getUser();
					if (user && !userError) {
					  const { error: updateError } = await supabase
						.from('profiles')
						.update({ refresh_token: providerRefreshToken })
						.eq('id', user.id);
					  if (updateError) {
						console.error('[SpotifyAuth] Error guardando provider_refresh_token en profiles:', updateError);
						Alert.alert('Error', 'No se pudo guardar el refresh token de Spotify');
					  }
					  if (provider_token) {
					    await saveInitialTopArtists(user.id, provider_token);
					  } else {
					    console.warn('[SpotifyAuth] provider_token no disponible, no se puede guardar top artists');
					  }
					}
				  }
              }
            } else {
              console.error('[SpotifyAuth] Tokens faltantes en la URL');
              Alert.alert('Error', 'No se pudieron extraer los tokens de autenticación');
            }
          } catch (parseError) {
            console.error('[SpotifyAuth] Error procesando URL:', parseError);
            Alert.alert('Error', 'No se pudo procesar la respuesta de autenticación');
          }
        } else if (result.type === 'dismiss') {
          // Usuario cerró el navegador sin completar
        }
      } else {
        console.error('[SpotifyAuth] No se recibió URL de Supabase');
        Alert.alert('Error', 'No se pudo generar la URL de autenticación');
      }
    } catch (error) {
      console.error('[SpotifyAuth] Error inesperado:', error);
      Alert.alert('Error', 'Error al conectar con Spotify');
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithSpotify,
    loading,
  };
}; 