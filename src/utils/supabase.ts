import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client configuration for React Native
 * Uses AsyncStorage for session persistence across app restarts
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

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
  
  console.log('🔗 Supabase: Redirect URI configured:', redirectUri);
  return redirectUri;
};

console.log('Supabase client initialized for React Native with AsyncStorage persistence'); 