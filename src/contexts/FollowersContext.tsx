import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

interface FollowersContextType {
  followers: string[]; // IDs de usuarios que me siguen
  following: string[]; // IDs de usuarios a los que sigo
  followersCount: number;
  followingCount: number;
  isLoading: boolean;
  error: string | null;
  isFollowing: (userId: string) => boolean;
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  refetch: () => Promise<void>;
  // Para otros usuarios (fetch puntual, no cache):
  fetchFollowersCount: (userId: string) => Promise<number>;
  fetchFollowingCount: (userId: string) => Promise<number>;
  fetchIsFollowing: (targetUserId: string, sourceUserId: string) => Promise<boolean>;
}

const FollowersContext = createContext<FollowersContextType | undefined>(undefined);

export const useFollowers = () => {
  const context = useContext(FollowersContext);
  if (!context) throw new Error('useFollowers debe usarse dentro de FollowersProvider');
  return context;
};

export const FollowersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar followers y following del usuario actual
  const fetchFollowersData = useCallback(async () => {
    if (!userId) {
      setFollowers([]);
      setFollowing([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Followers: usuarios que me siguen
      const { data: followersData, error: followersError } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId);
      if (followersError) throw followersError;
      setFollowers(followersData?.map((f: any) => f.follower_id) || []);

      // Following: usuarios a los que sigo
      const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);
      if (followingError) throw followingError;
      setFollowing(followingData?.map((f: any) => f.following_id) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setFollowers([]);
      setFollowing([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Cargar datos al iniciar sesión o cambiar usuario
  useEffect(() => {
    fetchFollowersData();
  }, [fetchFollowersData]);

  // Función para saber si sigo a un usuario
  const isFollowing = useCallback((targetUserId: string) => {
    return following.includes(targetUserId);
  }, [following]);

  // Seguir a un usuario
  const follow = useCallback(async (targetUserId: string) => {
    if (!userId || !targetUserId || userId === targetUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('followers')
        .insert([{ follower_id: userId, following_id: targetUserId }]);
      if (error) throw error;
      setFollowing(prev => [...prev, targetUserId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Dejar de seguir a un usuario
  const unfollow = useCallback(async (targetUserId: string) => {
    if (!userId || !targetUserId || userId === targetUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId);
      if (error) throw error;
      setFollowing(prev => prev.filter(id => id !== targetUserId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Refrescar datos manualmente
  const refetch = fetchFollowersData;

  // Fetch puntual para otros usuarios (no cache)
  const fetchFollowersCount = useCallback(async (targetUserId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetUserId);
    if (error) throw error;
    return count || 0;
  }, []);

  const fetchFollowingCount = useCallback(async (targetUserId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', targetUserId);
    if (error) throw error;
    return count || 0;
  }, []);

  const fetchIsFollowing = useCallback(async (targetUserId: string, sourceUserId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', sourceUserId)
      .eq('following_id', targetUserId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  }, []);

  const followersCount = followers.length;
  const followingCount = following.length;

  return (
    <FollowersContext.Provider value={{
      followers,
      following,
      followersCount,
      followingCount,
      isLoading,
      error,
      isFollowing,
      follow,
      unfollow,
      refetch,
      fetchFollowersCount,
      fetchFollowingCount,
      fetchIsFollowing,
    }}>
      {children}
    </FollowersContext.Provider>
  );
}; 