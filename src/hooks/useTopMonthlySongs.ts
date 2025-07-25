import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export interface TopMonthlySong {
  song_id: string;
  song_name: string;
  user_id: string;
  artist_name: string;
  album_cover_url: string;
  position: number;
  retrieved_at: string;
}

export function useTopMonthlySongs(userId: string) {
  const [songs, setSongs] = useState<TopMonthlySong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchSongs = async () => {
      // 1. Obtener el retrieved_at más reciente para este usuario
      const { data: latest, error: errorLatest } = await supabase
        .from('top_monthly_songs')
        .select('retrieved_at')
        .eq('user_id', userId)
        .order('retrieved_at', { ascending: false })
        .limit(1)
        .single();

      if (errorLatest || !latest) {
        setSongs([]);
        setLoading(false);
        return;
      }

      // 2. Obtener las 3 canciones más escuchadas para ese retrieved_at
      const { data, error } = await supabase
        .from('top_monthly_songs')
        .select('*')
        .eq('user_id', userId)
        .eq('retrieved_at', latest.retrieved_at)
        .order('position', { ascending: true })
        .limit(3);

      if (!error && data) {
        setSongs(data);
      } else {
        setSongs([]);
      }
      setLoading(false);
    };

    fetchSongs();
  }, [userId]);

  return { songs, loading };
} 