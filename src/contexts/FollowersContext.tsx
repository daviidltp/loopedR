import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface FollowRequest {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  status: 'pending' | 'accepted';
  follower_profile?: any; // perfil del usuario que solicita seguirte
}

interface FollowersContextType {
  followers: string[]; // IDs de usuarios que me siguen (accepted)
  following: string[]; // IDs de usuarios a los que sigo (accepted)
  followersCount: number;
  followingCount: number;
  isLoading: boolean;
  error: string | null;
  getFollowStatus: (userId: string) => 'none' | 'pending' | 'accepted';
  isFollowing: (userId: string) => boolean;
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  cancelFollowRequest: (userId: string) => Promise<void>;
  refetch: () => Promise<void>;
  // Solicitudes recibidas (pending)
  followRequests: FollowRequest[];
  acceptFollowRequest: (requestId: string) => Promise<void>;
  rejectFollowRequest: (requestId: string) => Promise<void>;
  // Para otros usuarios (fetch puntual, no cache):
  fetchFollowersCount: (userId: string) => Promise<number>;
  fetchFollowingCount: (userId: string) => Promise<number>;
  fetchFollowStatus: (targetUserId: string, sourceUserId: string) => Promise<'none' | 'pending' | 'accepted'>;
  refreshMyFollowersCount: () => Promise<void>;
  refreshMyFollowingCount: () => Promise<void>;
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
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [relations, setRelations] = useState<Record<string, 'none' | 'pending' | 'accepted'>>({});

  // Cargar followers, following y solicitudes del usuario actual
  const fetchFollowersData = useCallback(async () => {
    if (!userId) {
      setFollowers([]);
      setFollowing([]);
      setFollowRequests([]);
      setRelations({});
      setFollowersCount(0);
      setFollowingCount(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Followers: usuarios que me siguen (accepted)
      const { data: followersData, error: followersError } = await supabase
        .from('followers')
        .select('follower_id, status')
        .eq('following_id', userId)
        .eq('status', 'accepted');
      if (followersError) throw followersError;
      setFollowers(followersData?.map((f: any) => f.follower_id) || []);
      setFollowersCount(followersData?.length || 0);

      // Following: usuarios a los que sigo (accepted)
      const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('following_id, status')
        .eq('follower_id', userId)
        .eq('status', 'accepted');
      if (followingError) throw followingError;
      setFollowing(followingData?.map((f: any) => f.following_id) || []);
      setFollowingCount(followingData?.length || 0);

      // Solicitudes recibidas (pending)
      const { data: requestsData, error: requestsError } = await supabase
        .from('followers')
        .select('id, follower_id, following_id, created_at, status, follower_profile:profiles!followers_follower_id_fkey(*)')
        .eq('following_id', userId)
        .eq('status', 'pending');
      if (requestsError) throw requestsError;
      setFollowRequests(requestsData || []);

      // Relaciones (para saber si sigo a alguien y el estado)
      const { data: relData, error: relError } = await supabase
        .from('followers')
        .select('following_id, status')
        .eq('follower_id', userId);
      if (relError) throw relError;
      const relMap: Record<string, 'none' | 'pending' | 'accepted'> = {};
      relData?.forEach((r: any) => {
        relMap[r.following_id] = r.status;
      });
      setRelations(relMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setFollowers([]);
      setFollowing([]);
      setFollowRequests([]);
      setRelations({});
      setFollowersCount(0);
      setFollowingCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowersData();
  }, [fetchFollowersData]);

  // Saber el estado de la relación con un usuario
  const getFollowStatus = useCallback((targetUserId: string): 'none' | 'pending' | 'accepted' => {
    return relations[targetUserId] || 'none';
  }, [relations]);

  // Saber si sigo a un usuario (accepted)
  const isFollowing = useCallback((targetUserId: string) => {
    return getFollowStatus(targetUserId) === 'accepted';
  }, [getFollowStatus]);

  // Seguir a un usuario (maneja público/privado)
  const follow = useCallback(async (targetUserId: string) => {
    if (!userId || !targetUserId || userId === targetUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      // Consultar si el usuario es público
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_public')
        .eq('id', targetUserId)
        .single();
      if (profileError) throw profileError;
      const isPublic = profile?.is_public;
      const status: 'pending' | 'accepted' = isPublic ? 'accepted' : 'pending';
      const { error } = await supabase
        .from('followers')
        .insert([{ follower_id: userId, following_id: targetUserId, status }]);
      if (error) throw error;
      await fetchFollowersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFollowersData]);

  // Dejar de seguir a un usuario (accepted)
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
      await fetchFollowersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFollowersData]);

  // Cancelar solicitud pendiente
  const cancelFollowRequest = useCallback(async (targetUserId: string) => {
    if (!userId || !targetUserId || userId === targetUserId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId)
        .eq('status', 'pending');
      if (error) throw error;
      await fetchFollowersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFollowersData]);

  // Aceptar solicitud de seguimiento
  const acceptFollowRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('followers')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      if (error) throw error;
      await fetchFollowersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFollowersData]);

  // Rechazar solicitud de seguimiento
  const rejectFollowRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('id', requestId);
      if (error) throw error;
      await fetchFollowersData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFollowersData]);

  // Fetch puntual para otros usuarios (no cache)
  const fetchFollowersCount = useCallback(async (targetUserId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetUserId)
      .eq('status', 'accepted');
    if (error) throw error;
    return count || 0;
  }, []);

  const fetchFollowingCount = useCallback(async (targetUserId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', targetUserId)
      .eq('status', 'accepted');
    if (error) throw error;
    return count || 0;
  }, []);

  const fetchFollowStatus = useCallback(async (targetUserId: string, sourceUserId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .select('status')
      .eq('follower_id', sourceUserId)
      .eq('following_id', targetUserId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return 'none';
    return data.status as 'pending' | 'accepted';
  }, []);

  const refreshMyFollowersCount = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const count = await fetchFollowersCount(userId);
      setFollowersCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFollowersCount]);

  const refreshMyFollowingCount = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const count = await fetchFollowingCount(userId);
      setFollowingCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFollowingCount]);

  return (
    <FollowersContext.Provider value={{
      followers,
      following,
      followersCount,
      followingCount,
      isLoading,
      error,
      getFollowStatus,
      isFollowing,
      follow,
      unfollow,
      cancelFollowRequest,
      refetch: fetchFollowersData,
      followRequests,
      acceptFollowRequest,
      rejectFollowRequest,
      fetchFollowersCount,
      fetchFollowingCount,
      fetchFollowStatus,
      refreshMyFollowersCount,
      refreshMyFollowingCount,
    }}>
      {children}
    </FollowersContext.Provider>
  );
}; 