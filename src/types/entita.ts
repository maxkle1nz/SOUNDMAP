// Definizione dei tipi per le nuove entità
import { Database } from './types/supabase';

// Tipi per professionisti
export type Professionista = Database['public']['Tables']['professionals']['Row'];
export type NuovoProfessionista = Omit<Database['public']['Tables']['professionals']['Insert'], 'id' | 'created_at' | 'updated_at'>;
export type AggiornamentoProfessionista = Partial<Database['public']['Tables']['professionals']['Update']>;

// Tipi per locali
export type Locale = Database['public']['Tables']['locali']['Row'];
export type NuovoLocale = Omit<Database['public']['Tables']['locali']['Insert'], 'id' | 'created_at' | 'updated_at'>;
export type AggiornamentoLocale = Partial<Database['public']['Tables']['locali']['Update']>;

// Tipi per filtri
export type PresetFiltro = Database['public']['Tables']['preset_filtri']['Row'];
export type NuovoPresetFiltro = Omit<Database['public']['Tables']['preset_filtri']['Insert'], 'id' | 'created_at' | 'updated_at'>;

// Interfacce per i filtri della mappa
export interface FiltriMappa {
  mostra_artisti: boolean;
  mostra_professionisti: boolean;
  mostra_locali: boolean;
  mostra_scene: boolean;
  filtri_artisti?: FiltriArtisti;
  filtri_professionisti?: FiltriProfessionisti;
  filtri_locali?: FiltriLocali;
  filtri_scene?: FiltriScene;
  filtri_geografici?: FiltriGeografici;
}

export interface FiltriArtisti {
  generi?: string[];
  citta?: string;
  verificato?: boolean;
  in_evidenza?: boolean;
}

export interface FiltriProfessionisti {
  tipi?: string[];
  specializzazioni?: string[];
  citta?: string;
  verificato?: boolean;
  in_evidenza?: boolean;
}

export interface FiltriLocali {
  tipi?: string[];
  citta?: string;
  verificato?: boolean;
  in_evidenza?: boolean;
}

export interface FiltriScene {
  generi?: string[];
  citta?: string;
  attiva?: boolean;
}

export interface FiltriGeografici {
  citta?: string;
  raggio?: number; // in km
  latitudine?: number;
  longitudine?: number;
}
