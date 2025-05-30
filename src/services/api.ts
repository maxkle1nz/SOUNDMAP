import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type Artist = Database['public']['Tables']['artists']['Row'];
export type Scene = Database['public']['Tables']['scenes']['Row'];
export type Track = Database['public']['Tables']['tracks']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Serviços para Artistas
export const artistService = {
  // Buscar todos os artistas
  async getAllArtists() {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar artistas:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar artistas por cidade
  async getArtistsByCity(city: string) {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('city', city)
      .order('name');
    
    if (error) {
      console.error(`Erro ao buscar artistas da cidade ${city}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar artista por ID
  async getArtistById(id: string) {
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        tracks (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar artista com id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Criar novo artista
  async createArtist(artistData: Omit<Database['public']['Tables']['artists']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('artists')
      .insert(artistData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar artista:', error);
      throw error;
    }
    
    return data;
  },
  
  // Atualizar artista existente
  async updateArtist(id: string, updates: Partial<Database['public']['Tables']['artists']['Update']>) {
    const { data, error } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar artista com id ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};

// Serviços para Cenas Musicais
export const sceneService = {
  // Buscar todas as cenas
  async getAllScenes() {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar cenas musicais:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar cenas por cidade
  async getScenesByCity(city: string) {
    const { data, error } = await supabase
      .from('scenes')
      .select('*')
      .eq('city', city)
      .order('name');
    
    if (error) {
      console.error(`Erro ao buscar cenas da cidade ${city}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar cena específica com artistas associados
  async getSceneWithArtists(id: string) {
    const { data, error } = await supabase
      .from('scenes')
      .select(`
        *,
        artist_scenes (
          artist_id,
          artists (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar cena musical com id ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};

// Serviços para Músicas/Tracks
export const trackService = {
  // Buscar todas as músicas
  async getAllTracks() {
    const { data, error } = await supabase
      .from('tracks')
      .select(`
        *,
        artists (name, id)
      `)
      .order('title');
    
    if (error) {
      console.error('Erro ao buscar músicas:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar músicas de um artista específico
  async getTracksByArtist(artistId: string) {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('artist_id', artistId)
      .order('title');
    
    if (error) {
      console.error(`Erro ao buscar músicas do artista ${artistId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Incrementar contador de reproduções
  async incrementPlays(trackId: string) {
    const { data, error } = await supabase.rpc('increment_track_plays', {
      track_id: trackId
    });
    
    if (error) {
      console.error(`Erro ao incrementar reproduções da faixa ${trackId}:`, error);
      return false;
    }
    
    return true;
  }
};

// Serviços para gestão de arquivos no Supabase Storage
export const storageService = {
  // Upload de imagem
  async uploadImage(file: File, bucket: string = 'images', path: string = '') {
    const filename = `${Date.now()}-${file.name}`;
    const fullPath = path ? `${path}/${filename}` : filename;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
    
    // Retorna URL pública do arquivo
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  },
  
  // Upload de áudio
  async uploadAudio(file: File, bucket: string = 'tracks', path: string = '') {
    const filename = `${Date.now()}-${file.name}`;
    const fullPath = path ? `${path}/${filename}` : filename;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Erro ao fazer upload do áudio:', error);
      throw error;
    }
    
    // Retorna URL pública do arquivo
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  }
};
