import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client configuration for React Native
 * Uses AsyncStorage for session persistence across app restarts
 */
const supabaseUrl = 'https://vdiuponydezwqnhxbtfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaXVwb255ZGV6d3FuaHhidGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2OTM3NjYsImV4cCI6MjA2ODI2OTc2Nn0.DYgk-91uD3Sejqw-Ozhz_aXcYckB24kPc-hylGVHCqs';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure AsyncStorage for React Native session persistence
    storage: AsyncStorage,
    // Automatically refresh tokens when they expire
    autoRefreshToken: true,
    // Persist the session in AsyncStorage
    persistSession: true,
    // Detect session from URL (important for OAuth callbacks)
    detectSessionInUrl: true,
  },
});

/**
 * Get the appropriate redirect URL based on the environment
 */
export const getRedirectUrl = (): string => {
  const redirectUri = Constants.appOwnership === 'expo' 
    ? 'exp://192.168.1.60:8081' 
    : 'loopedr://callback';
  
  return redirectUri;
};

/**
 * Cierra la sesión del usuario autenticado en Supabase
 */
export const signOutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Elimina la cuenta del usuario autenticado en Supabase
 * (Requiere configuración de Supabase y puede necesitar lógica adicional)
 */
export const deleteUserAccount = async (): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No hay usuario autenticado');
  // Aquí deberías llamar a una función RPC o endpoint seguro para eliminar la cuenta
  // Ejemplo:
  // const { error } = await supabase.rpc('delete_user', { user_id: user.id });
  // if (error) throw error;
  throw new Error('Funcionalidad de eliminación de cuenta no implementada');
};

console.log('Supabase inicializado correctamente'); 