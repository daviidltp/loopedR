import React, { createContext, useCallback, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface FollowersContextType {
  getFollowersCount: (userId: string) => Promise<number>;
  getFollowingCount: (userId: string) => Promise<number>;
  isFollowing: (userId: string) => Promise<boolean>;
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
}

const FollowersContext = createContext<FollowersContextType | undefined>(undefined);

export const useFollowers = () => {
  const context = useContext(FollowersContext);
  if (!context) throw new Error('useFollowers debe usarse dentro de FollowersProvider');
  return context;
};

export const FollowersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();

  // Devuelve el número de seguidores de un usuario
  const getFollowersCount = useCallback(async (userId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);
    if (error) throw error;
    return count || 0;
  }, []);

  // Devuelve el número de seguidos de un usuario
  const getFollowingCount = useCallback(async (userId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    if (error) throw error;
    return count || 0;
  }, []);

  // Devuelve si el usuario actual sigue a userId
  const isFollowing = useCallback(async (userId: string) => {
    if (!session?.user?.id) return false;
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', session.user.id)
      .eq('following_id', userId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  }, [session?.user?.id]);

  // Seguir a un usuario
  const follow = useCallback(async (userId: string) => {
    if (!session?.user?.id) throw new Error('No hay sesión');
    const { error } = await supabase
      .from('followers')
      .insert([{ follower_id: session.user.id, following_id: userId }]);
    if (error) throw error;
  }, [session?.user?.id]);

  // Dejar de seguir a un usuario
  const unfollow = useCallback(async (userId: string) => {
    if (!session?.user?.id) throw new Error('No hay sesión');
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', session.user.id)
      .eq('following_id', userId);
    if (error) throw error;
  }, [session?.user?.id]);

  return (
    <FollowersContext.Provider value={{
      getFollowersCount,
      getFollowingCount,
      isFollowing,
      follow,
      unfollow,
    }}>
      {children}
    </FollowersContext.Provider>
  );
}; 