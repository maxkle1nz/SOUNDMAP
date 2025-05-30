import { supabase } from '@/lib/supabase';
import type { Locale, NuovoLocale, AggiornamentoLocale } from '@/types/entita';

// Servizio per i locali/venue
export const servizioLocali = {
  // Ottenere tutti i locali
  async getTuttiLocali() {
    const { data, error } = await supabase
      .from('locali')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Errore nel recupero dei locali:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere locali per tipo
  async getLocaliPerTipo(tipo: string) {
    const { data, error } = await supabase
      .from('locali')
      .select('*')
      .eq('tipo_locale', tipo)
      .order('nome');
    
    if (error) {
      console.error(`Errore nel recupero dei locali di tipo ${tipo}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere locali per città
  async getLocaliPerCitta(citta: string) {
    const { data, error } = await supabase
      .from('locali')
      .select('*')
      .eq('citta', citta)
      .order('nome');
    
    if (error) {
      console.error(`Errore nel recupero dei locali della città ${citta}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere un locale per ID
  async getLocaleById(id: string) {
    const { data, error } = await supabase
      .from('locali')
      .select(`
        *,
        recensioni_locali (*),
        locali_scene (
          scene:scenes (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Errore nel recupero del locale con id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Creare un nuovo locale
  async creaLocale(datiLocale: NuovoLocale) {
    const { data, error } = await supabase
      .from('locali')
      .insert(datiLocale)
      .select()
      .single();
    
    if (error) {
      console.error('Errore nella creazione del locale:', error);
      throw error;
    }
    
    return data;
  },
  
  // Aggiornare un locale esistente
  async aggiornaLocale(id: string, aggiornamenti: AggiornamentoLocale) {
    const { data, error } = await supabase
      .from('locali')
      .update(aggiornamenti)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Errore nell'aggiornamento del locale con id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Eliminare un locale
  async eliminaLocale(id: string) {
    const { error } = await supabase
      .from('locali')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Errore nell'eliminazione del locale con id ${id}:`, error);
      throw error;
    }
    
    return true;
  },
  
  // Aggiungere una recensione a un locale
  async aggiungiRecensione(localeId: string, recensoreId: string, valutazione: number, commento?: string) {
    const { data, error } = await supabase
      .from('recensioni_locali')
      .insert({
        locale_id: localeId,
        recensore_id: recensoreId,
        valutazione,
        commento
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Errore nell'aggiunta della recensione al locale ${localeId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Associare un locale a una scena musicale
  async associaScena(localeId: string, sceneId: string) {
    const { data, error } = await supabase
      .from('locali_scene')
      .insert({
        locale_id: localeId,
        scene_id: sceneId
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Errore nell'associazione del locale ${localeId} alla scena ${sceneId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Ottenere locali nelle vicinanze
  async getLocaliVicini(latitudine: number, longitudine: number, raggioKm: number = 10) {
    // Utilizzo di PostGIS per calcolare la distanza
    const { data, error } = await supabase.rpc('locali_nel_raggio', {
      lat: latitudine,
      lng: longitudine,
      raggio_km: raggioKm
    });
    
    if (error) {
      console.error(`Errore nel recupero dei locali nel raggio di ${raggioKm}km:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere eventi futuri in un locale
  async getEventiFuturi(localeId: string) {
    const oggi = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_artists (
          artists (*)
        )
      `)
      .eq('venue', localeId)
      .gte('date', oggi)
      .order('date');
    
    if (error) {
      console.error(`Errore nel recupero degli eventi futuri per il locale ${localeId}:`, error);
      throw error;
    }
    
    return data || [];
  }
};
