import { supabase } from '@/lib/supabase';
import type { Professionista, NuovoProfessionista, AggiornamentoProfessionista } from '@/types/entita';

// Servizio per i professionisti del settore
export const servizioProfessionisti = {
  // Ottenere tutti i professionisti
  async getTuttiProfessionisti() {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('nome_attivita');
    
    if (error) {
      console.error('Errore nel recupero dei professionisti:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere professionisti per tipo
  async getProfessionistiPerTipo(tipo: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('tipo_professione', tipo)
      .order('nome_attivita');
    
    if (error) {
      console.error(`Errore nel recupero dei professionisti di tipo ${tipo}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere professionisti per città
  async getProfessionistiPerCitta(citta: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('citta', citta)
      .order('nome_attivita');
    
    if (error) {
      console.error(`Errore nel recupero dei professionisti della città ${citta}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Ottenere un professionista per ID
  async getProfessionistaById(id: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        recensioni_professionisti (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Errore nel recupero del professionista con id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Creare un nuovo professionista
  async creaProfessionista(datiProfessionista: NuovoProfessionista) {
    const { data, error } = await supabase
      .from('professionals')
      .insert(datiProfessionista)
      .select()
      .single();
    
    if (error) {
      console.error('Errore nella creazione del professionista:', error);
      throw error;
    }
    
    return data;
  },
  
  // Aggiornare un professionista esistente
  async aggiornaProfessionista(id: string, aggiornamenti: AggiornamentoProfessionista) {
    const { data, error } = await supabase
      .from('professionals')
      .update(aggiornamenti)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Errore nell'aggiornamento del professionista con id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Eliminare un professionista
  async eliminaProfessionista(id: string) {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Errore nell'eliminazione del professionista con id ${id}:`, error);
      throw error;
    }
    
    return true;
  },
  
  // Aggiungere una recensione a un professionista
  async aggiungiRecensione(professionistaId: string, recensoreId: string, valutazione: number, commento?: string) {
    const { data, error } = await supabase
      .from('recensioni_professionisti')
      .insert({
        professionista_id: professionistaId,
        recensore_id: recensoreId,
        valutazione,
        commento
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Errore nell'aggiunta della recensione al professionista ${professionistaId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Ottenere professionisti nelle vicinanze
  async getProfessionistiVicini(latitudine: number, longitudine: number, raggioKm: number = 10) {
    // Utilizzo di PostGIS per calcolare la distanza
    const { data, error } = await supabase.rpc('professionisti_nel_raggio', {
      lat: latitudine,
      lng: longitudine,
      raggio_km: raggioKm
    });
    
    if (error) {
      console.error(`Errore nel recupero dei professionisti nel raggio di ${raggioKm}km:`, error);
      throw error;
    }
    
    return data || [];
  }
};
