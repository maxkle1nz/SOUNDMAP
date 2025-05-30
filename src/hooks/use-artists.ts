import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Artist = Database['public']['Tables']['artists']['Row'];

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .order('name');

        if (error) throw error;

        setArtists(data || []);
      } catch (err) {
        console.error('Erro ao buscar artistas:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const getArtistsByCity = async (city: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('city', city)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Erro ao buscar artistas da cidade ${city}:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getArtistById = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          tracks (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Erro ao buscar artista com id ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createArtist = async (artistData: Omit<Database['public']['Tables']['artists']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .insert(artistData)
        .select()
        .single();

      if (error) throw error;
      setArtists((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar artista:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateArtist = async (id: string, updates: Partial<Database['public']['Tables']['artists']['Update']>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setArtists((prev) => prev.map((artist) => (artist.id === id ? data : artist)));
      return data;
    } catch (err) {
      console.error(`Erro ao atualizar artista com id ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    artists,
    isLoading,
    error,
    getArtistsByCity,
    getArtistById,
    createArtist,
    updateArtist,
  };
}
