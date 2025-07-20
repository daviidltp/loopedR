import { ProfileUpdateFields } from '../contexts/ProfileContext';
import { supabase } from './supabase';

export interface SupabaseUser {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  is_verified: boolean;
  updated_at: string;
}

/**
 * Obtiene todos los usuarios de Supabase (excluyendo al usuario actual)
 */
export const getSupabaseUsers = async (currentUserId?: string): Promise<SupabaseUser[]> => {
  try {
    let query = supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, is_public, is_verified, updated_at')
      .order('updated_at', { ascending: false });

    // Si hay un usuario actual, excluirlo de los resultados
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[getSupabaseUsers] Error al obtener usuarios:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[getSupabaseUsers] Error:', error);
    return [];
  }
};

/**
 * Busca usuarios por nombre de usuario o display_name
 */
export const searchSupabaseUsers = async (
  searchText: string, 
  currentUserId?: string
): Promise<SupabaseUser[]> => {
  try {
    if (!searchText.trim()) {
      return await getSupabaseUsers(currentUserId);
    }

    const searchTerm = searchText.toLowerCase();

    let query = supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, is_public, is_verified, updated_at')
      .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false });

    // Si hay un usuario actual, excluirlo de los resultados
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[searchSupabaseUsers] Error al buscar usuarios:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[searchSupabaseUsers] Error:', error);
    return [];
  }
};

/**
 * Obtiene un usuario específico por ID
 */
export const getSupabaseUserById = async (userId: string): Promise<SupabaseUser | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, is_public, is_verified, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[getSupabaseUserById] Error al obtener usuario:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[getSupabaseUserById] Error:', error);
    return null;
  }
};

/**
 * Convierte un usuario de Supabase al formato compatible con la interfaz User
 */
export const convertSupabaseUserToUser = (supabaseUser: SupabaseUser) => {
  return {
    id: supabaseUser.id,
    username: supabaseUser.username,
    displayName: supabaseUser.display_name,
    bio: supabaseUser.bio || '',
    avatarUrl: supabaseUser.avatar_url || 'default_avatar',
    isVerified: supabaseUser.is_verified || false,
    isPublic: supabaseUser.is_public !== undefined ? supabaseUser.is_public : true,
  };
};

/**
 * Actualiza el perfil del usuario en Supabase
 */
export const updateUserProfile = async (
  userId: string, 
  updatedFields: ProfileUpdateFields
): Promise<void> => {
  try {
    const updates = {
      id: userId,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates);

    if (error) {
      console.error('[updateUserProfile] Error al actualizar perfil:', error);
      throw error;
    }

    console.log('[updateUserProfile] Perfil actualizado correctamente');
  } catch (error) {
    console.error('[updateUserProfile] Error:', error);
    throw error;
  }
}; 