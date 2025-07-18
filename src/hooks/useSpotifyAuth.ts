import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert } from 'react-native';
import { getRedirectUrl, supabase } from '../utils/supabase';

// Configurar el navegador para que regrese a la app
WebBrowser.maybeCompleteAuthSession();

export const useSpotifyAuth = () => {
  const [loading, setLoading] = useState(false);

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