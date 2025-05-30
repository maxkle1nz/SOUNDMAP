import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Scene = Database['public']['Tables']['scenes']['Row'];

export function useScenes() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('scenes')
          .select('*')
          .order('name');

        if (error) throw error;

        setScenes(data || []);
      } catch (err) {
        console.error('Erro ao buscar cenas musicais:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenes();
  }, []);

  const getScenesByCity = async (city: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('city', city)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`Erro ao buscar cenas musicais da cidade ${city}:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSceneById = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scenes')
        .select(`
          *,
          artist_scenes!inner (
            artists (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Erro ao buscar cena musical com id ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createScene = async (sceneData: Omit<Database['public']['Tables']['scenes']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scenes')
        .insert(sceneData)
        .select()
        .single();

      if (error) throw error;
      setScenes((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar cena musical:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scenes,
    isLoading,
    error,
    getScenesByCity,
    getSceneById,
    createScene,
  };
}
