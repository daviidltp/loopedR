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
  followersCount?: number;
  followingCount?: number;
  followStatus?: 'none' | 'pending' | 'accepted';
}

/**
 * Obtiene todos los usuarios de Supabase (excluyendo al usuario actual)
 */
export const getSupabaseUsers = async (
  currentUserId: string | undefined,
  fetchFollowersCount: (userId: string) => Promise<number>,
  fetchFollowingCount: (userId: string) => Promise<number>,
  fetchFollowStatus: (targetUserId: string, sourceUserId: string) => Promise<'none' | 'pending' | 'accepted'>
): Promise<SupabaseUser[]> => {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        bio,
        avatar_url,
        is_public,
        is_verified
      `)
      .order('display_name', { ascending: false });

    // Si hay un usuario actual, excluirlo de los resultados
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[getSupabaseUsers] Error al obtener usuarios:', error);
      throw error;
    }

    // Para cada usuario, obtener followersCount, followingCount y followStatus usando las funciones del contexto
    const users = await Promise.all((data || []).map(async (user: any) => {
      const followersCount = await fetchFollowersCount(user.id);
      const followingCount = await fetchFollowingCount(user.id);
      let followStatus: 'none' | 'pending' | 'accepted' = 'none';
      if (currentUserId) {
        followStatus = await fetchFollowStatus(user.id, currentUserId);
      }
      return {
        ...user,
        followersCount,
        followingCount,
        followStatus,
      };
    }));
    return users;
  } catch (error) {
    console.error('[getSupabaseUsers] Error:', error);
    return [];
  }
};

/**
 * Busca usuarios por nombre de usuario o display_name
 */
// Ahora searchSupabaseUsers recibe las funciones como argumentos
export const searchSupabaseUsers = async (
  searchText: string,
  currentUserId: string | undefined,
  fetchFollowersCount: (userId: string) => Promise<number>,
  fetchFollowingCount: (userId: string) => Promise<number>,
  fetchFollowStatus: (targetUserId: string, sourceUserId: string) => Promise<'none' | 'pending' | 'accepted'>
): Promise<SupabaseUser[]> => {
  try {
    if (!searchText.trim()) {
      return await getSupabaseUsers(
        currentUserId,
        fetchFollowersCount,
        fetchFollowingCount,
        fetchFollowStatus
      );
    }

    const searchTerm = searchText.toLowerCase();

    let query = supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        bio,
        avatar_url,
        is_public,
        is_verified
      `)
      .or(`username.ilike.${searchTerm}%,display_name.ilike.${searchTerm}%`)
      .order('display_name', { ascending: false });

    // Si hay un usuario actual, excluirlo de los resultados
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[searchSupabaseUsers] Error al buscar usuarios:', error);
      throw error;
    }

    // Para cada usuario, obtener followersCount, followingCount y followStatus usando las funciones del contexto
    const users = await Promise.all((data || []).map(async (user: any) => {
      const followersCount = await fetchFollowersCount(user.id);
      const followingCount = await fetchFollowingCount(user.id);
      let followStatus: 'none' | 'pending' | 'accepted' = 'none';
      if (currentUserId) {
        followStatus = await fetchFollowStatus(user.id, currentUserId);
      }
      return {
        ...user,
        followersCount,
        followingCount,
        followStatus,
      };
    }));
    return users;
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
    followersCount: supabaseUser.followersCount || 0,
    followingCount: supabaseUser.followingCount || 0,
    followStatus: supabaseUser.followStatus || 'none',
  };
};

/**
 * Obtiene solo followersCount, followingCount y followStatus de un usuario por su ID
 */
export const getUserStatsById = async (
  userId: string,
  currentUserId: string | undefined,
  fetchFollowersCount: (userId: string) => Promise<number>,
  fetchFollowingCount: (userId: string) => Promise<number>,
  fetchFollowStatus: (targetUserId: string, sourceUserId: string) => Promise<'none' | 'pending' | 'accepted'>
): Promise<{
  followersCount: number;
  followingCount: number;
  followStatus: 'none' | 'pending' | 'accepted';
}> => {
  const followersCount = await fetchFollowersCount(userId);
  const followingCount = await fetchFollowingCount(userId);
  let followStatus: 'none' | 'pending' | 'accepted' = 'none';
  if (currentUserId) {
    followStatus = await fetchFollowStatus(userId, currentUserId);
  }
  return {
    followersCount,
    followingCount,
    followStatus,
  };
};

