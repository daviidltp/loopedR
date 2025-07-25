import { RealtimeChannel } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { getSupabaseUserById } from '../utils/userActions';
import { useAuth } from './AuthContext';

// Interfaz para el perfil del usuario basada en la tabla profiles de Supabase
export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  updated_at: string;
  avatar_url: string;
  bio: string;
  is_verified: boolean;
  is_public: boolean;
}

// Nueva interfaz para las canciones más escuchadas del mes
export interface TopMonthlySong {
  song_id: string;
  song_name: string;
  user_id: string;
  artist_name: string;
  album_cover_url: string;
  position: number;
  retrieved_at: string;
}

// Nueva interfaz para las canciones más escuchadas de la semana
export interface TopWeeklySong {
  id: string;
  user_id: string;
  song_id: string;
  song_name: string;
  artist_name: string;
  album_cover_url: string;
  total_play_count: number;
  week_start_date: string;
  position: number;
  created_at: string;
}

// Interfaz para los campos que se pueden actualizar
export interface ProfileUpdateFields {
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  is_verified?: boolean;
  is_public?: boolean;
}

// Nueva interfaz para los artistas más escuchados del mes
export interface TopMonthlyArtist {
  user_id: string;
  artist_id: string;
  retrieved_at: string;
  artist_name: string;
  artist_image_url: string;
  position: number;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updatedFields: ProfileUpdateFields) => Promise<void>;
  refetch: () => Promise<void>;
  topMonthlySongs: TopMonthlySong[];
  refetchTopMonthlySongs: () => Promise<void>;
  topWeeklySongs: TopWeeklySong[];
  refetchTopWeeklySongs: () => Promise<void>;
  topMonthlyArtists: TopMonthlyArtist[];
  refetchTopMonthlyArtists: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile debe ser usado dentro de un ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topMonthlySongs, setTopMonthlySongs] = useState<TopMonthlySong[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [topWeeklySongs, setTopWeeklySongs] = useState<TopWeeklySong[]>([]);
  const [isLoadingWeeklySongs, setIsLoadingWeeklySongs] = useState(false);
  const [topMonthlyArtists, setTopMonthlyArtists] = useState<TopMonthlyArtist[]>([]);
  const [isLoadingMonthlyArtists, setIsLoadingMonthlyArtists] = useState(false);
  // Guardar referencias a los canales para limpiar después
  const [monthlyChannel, setMonthlyChannel] = useState<RealtimeChannel | null>(null);
  const [weeklyChannel, setWeeklyChannel] = useState<RealtimeChannel | null>(null);
  const [monthlyArtistsChannel, setMonthlyArtistsChannel] = useState<RealtimeChannel | null>(null);

  // Función para obtener el perfil completo desde Supabase
  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getSupabaseUserById(session.user.id);

      if (!data) {
        // Si el usuario no existe en profiles, crear un perfil básico
        setProfile({
          id: session.user.id,
          username: '',
          display_name: '',
          avatar_url: 'default_avatar',
          bio: '',
          is_verified: false,
          is_public: true,
          updated_at: new Date().toISOString(), 
        });
        return;
      }

      setProfile({
        ...data,
        username: data.username || '',
        display_name: data.display_name || '',
        avatar_url: data.avatar_url || 'default_avatar',
        bio: data.bio || '',
        is_verified: data.is_verified || false,
        is_public: data.is_public !== undefined ? data.is_public : true,
        updated_at: data.updated_at || new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función para obtener las 5 canciones más escuchadas del mes
  const fetchTopMonthlySongs = async () => {
    if (!session?.user?.id) {
      setTopMonthlySongs([]);
      setIsLoadingSongs(false);
      return;
    }
    setIsLoadingSongs(true);
    try {
      // 1. Obtener el retrieved_at más reciente para este usuario
      const { data: latest, error: errorLatest } = await supabase
        .from('top_monthly_songs')
        .select('retrieved_at')
        .eq('user_id', session.user.id)
        .order('retrieved_at', { ascending: false })
        .limit(1)
        .single();
      if (errorLatest || !latest) {
        setTopMonthlySongs([]);
        setIsLoadingSongs(false);
        return;
      }
      // 2. Obtener las 5 canciones más escuchadas para ese retrieved_at
      const { data, error } = await supabase
        .from('top_monthly_songs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('retrieved_at', latest.retrieved_at)
        .order('position', { ascending: true })
        .limit(5);
      if (!error && data) {
        setTopMonthlySongs(data);
      } else {
        setTopMonthlySongs([]);
      }
    } catch (err) {
      setTopMonthlySongs([]);
    } finally {
      setIsLoadingSongs(false);
    }
  };

  // Nueva función para obtener las 3 canciones más escuchadas de la semana
  const fetchTopWeeklySongs = async () => {
    if (!session?.user?.id) {
      setTopWeeklySongs([]);
      setIsLoadingWeeklySongs(false);
      return;
    }
    setIsLoadingWeeklySongs(true);
    try {
      // 1. Obtener la semana más reciente para este usuario
      const { data: latest, error: errorLatest } = await supabase
        .from('weekly_loop')
        .select('week_start_date')
        .eq('user_id', session.user.id)
        .order('week_start_date', { ascending: false })
        .limit(1)
        .single();
      if (errorLatest || !latest) {
        setTopWeeklySongs([]);
        setIsLoadingWeeklySongs(false);
        return;
      }
      // 2. Obtener las 3 canciones más escuchadas para esa semana
      const { data, error } = await supabase
        .from('weekly_loop')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('week_start_date', latest.week_start_date)
        .order('position', { ascending: true })
        .limit(3);
      if (!error && data) {
        setTopWeeklySongs(data);
      } else {
        setTopWeeklySongs([]);
      }
    } catch (err) {
      setTopWeeklySongs([]);
    } finally {
      setIsLoadingWeeklySongs(false);
    }
  };

  // Nueva función para obtener los 3 artistas más escuchados del mes
  const fetchTopMonthlyArtists = async () => {
    if (!session?.user?.id) {
      setTopMonthlyArtists([]);
      setIsLoadingMonthlyArtists(false);
      return;
    }
    setIsLoadingMonthlyArtists(true);
    try {
      // 1. Obtener el retrieved_at más reciente para este usuario
      const { data: latest, error: errorLatest } = await supabase
        .from('top_monthly_artists')
        .select('retrieved_at')
        .eq('user_id', session.user.id)
        .order('retrieved_at', { ascending: false })
        .limit(1)
        .single();
      if (errorLatest || !latest) {
        setTopMonthlyArtists([]);
        setIsLoadingMonthlyArtists(false);
        return;
      }
      // 2. Obtener los 3 artistas más escuchados para ese retrieved_at
      const { data, error } = await supabase
        .from('top_monthly_artists')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('retrieved_at', latest.retrieved_at)
        .order('position', { ascending: true })
        .limit(3);
      if (!error && data) {
        setTopMonthlyArtists(data);
      } else {
        setTopMonthlyArtists([]);
      }
    } catch (err) {
      setTopMonthlyArtists([]);
    } finally {
      setIsLoadingMonthlyArtists(false);
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async (updatedFields: ProfileUpdateFields) => {
    if (!session?.user?.id || !profile) {
      throw new Error('No hay sesión activa o perfil disponible');
    }

    try {
      setIsLoading(true);
      setError(null);

      const updates = {
        id: session.user.id,
        ...updatedFields,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (updateError) {
        throw updateError;
      }

      // Refrescar los datos del perfil desde Supabase para actualizar el estado local
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para refetch manual
  const refetch = async () => {
    await fetchProfile();
    await fetchTopMonthlySongs();
    await fetchTopWeeklySongs();
    await fetchTopMonthlyArtists();
  };

  // Permitir refetch manual solo de canciones/artistas
  const refetchTopMonthlySongs = async () => {
    await fetchTopMonthlySongs();
  };
  const refetchTopWeeklySongs = async () => {
    await fetchTopWeeklySongs();
  };
  const refetchTopMonthlyArtists = async () => {
    await fetchTopMonthlyArtists();
  };

  // Efecto para obtener el perfil y las canciones/artistas cuando cambia la sesión
  useEffect(() => {
    fetchProfile();
    fetchTopMonthlySongs();
    fetchTopWeeklySongs();
    fetchTopMonthlyArtists();
    // Limpiar canales anteriores si cambia el usuario
    if (monthlyChannel) {
      supabase.removeChannel(monthlyChannel);
      setMonthlyChannel(null);
    }
    if (weeklyChannel) {
      supabase.removeChannel(weeklyChannel);
      setWeeklyChannel(null);
    }
    if (monthlyArtistsChannel) {
      supabase.removeChannel(monthlyArtistsChannel);
      setMonthlyArtistsChannel(null);
    }
    // Suscripción realtime para top_monthly_songs
    if (session?.user?.id) {
      const channelMonthly = supabase.channel('realtime-top-monthly-songs')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'top_monthly_songs',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            fetchTopMonthlySongs();
          }
        )
        .subscribe();
      setMonthlyChannel(channelMonthly);
      // Suscripción realtime para weekly_loop
      const channelWeekly = supabase.channel('realtime-weekly-loop')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'weekly_loop',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            fetchTopWeeklySongs();
          }
        )
        .subscribe();
      setWeeklyChannel(channelWeekly);
      // Suscripción realtime para top_monthly_artists
      const channelMonthlyArtists = supabase.channel('realtime-top-monthly-artists')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'top_monthly_artists',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            fetchTopMonthlyArtists();
          }
        )
        .subscribe();
      setMonthlyArtistsChannel(channelMonthlyArtists);
    }
    // Limpiar al desmontar
    return () => {
      if (monthlyChannel) supabase.removeChannel(monthlyChannel);
      if (weeklyChannel) supabase.removeChannel(weeklyChannel);
      if (monthlyArtistsChannel) supabase.removeChannel(monthlyArtistsChannel);
    };
  }, [session?.user?.id]);

  const contextValue: ProfileContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
    topMonthlySongs,
    refetchTopMonthlySongs,
    topWeeklySongs,
    refetchTopWeeklySongs,
    topMonthlyArtists,
    refetchTopMonthlyArtists,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}; 