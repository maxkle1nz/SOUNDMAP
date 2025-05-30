import { supabase } from '@/lib/supabase';
import type { FiltriMappa } from '@/types/entita';

// Servizio per i filtri della mappa
export const servizioFiltriMappa = {
  // Applicare filtri e ottenere risultati
  async applicaFiltri(filtri: FiltriMappa) {
    // Costruire parametri di filtro per la funzione RPC
    const parametriFiltro = {
      mostra_artisti: filtri.mostra_artisti,
      mostra_professionisti: filtri.mostra_professionisti,
      mostra_locali: filtri.mostra_locali,
      mostra_scene: filtri.mostra_scene,
      filtri_artisti: filtri.filtri_artisti || {},
      filtri_professionisti: filtri.filtri_professionisti || {},
      filtri_locali: filtri.filtri_locali || {},
      filtri_scene: filtri.filtri_scene || {},
      filtri_geografici: filtri.filtri_geografici || {}
    };
    
    const { data, error } = await supabase.rpc('filtra_entita_mappa', {
      parametri_filtro: parametriFiltro
    });
    
    if (error) {
      console.error('Errore nell\'applicazione dei filtri:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Salvare preset di filtri
  async salvaPresetFiltri(nome: string, filtri: FiltriMappa, userId: string) {
    const { data, error } = await supabase
      .from('preset_filtri')
      .insert({
        nome,
        filtri,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Errore nel salvataggio del preset di filtri:', error);
      throw error;
    }
    
    return data;
  },
  
  // Caricare preset di filtri dell'utente
  async getPresetFiltriUtente(userId: string) {
    const { data, error } = await supabase
      .from('preset_filtri')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore nel caricamento dei preset di filtri:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Impostare un preset come predefinito
  async impostaPresetPredefinito(presetId: string, userId: string) {
    // Prima rimuovi il flag predefinito da tutti i preset dell'utente
    await supabase
      .from('preset_filtri')
      .update({ predefinito: false })
      .eq('user_id', userId);
    
    // Poi imposta il nuovo preset predefinito
    const { data, error } = await supabase
      .from('preset_filtri')
      .update({ predefinito: true })
      .eq('id', presetId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Errore nell\'impostazione del preset predefinito:', error);
      throw error;
    }
    
    return data;
  },
  
  // Eliminare un preset
  async eliminaPreset(presetId: string, userId: string) {
    const { error } = await supabase
      .from('preset_filtri')
      .delete()
      .eq('id', presetId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Errore nell\'eliminazione del preset:', error);
      throw error;
    }
    
    return true;
  }
};
