import { useState, useEffect } from 'react';
import { servizioFiltriMappa } from '@/services/filtri-mappa';
import type { FiltriMappa, PresetFiltro } from '@/types/entita';

// Hook per gestire i filtri della mappa
export function useFiltriMappa(userId?: string) {
  const [filtriAttivi, setFiltriAttivi] = useState<FiltriMappa>({
    mostra_artisti: true,
    mostra_professionisti: true,
    mostra_locali: true,
    mostra_scene: true
  });
  const [presetSalvati, setPresetSalvati] = useState<PresetFiltro[]>([]);
  const [risultatiFiltrati, setRisultatiFiltrati] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Carica i preset salvati dell'utente
  useEffect(() => {
    const caricaPreset = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await servizioFiltriMappa.getPresetFiltriUtente(userId);
        setPresetSalvati(data);
        
        // Se c'è un preset predefinito, caricalo
        const presetPredefinito = data.find(preset => preset.predefinito);
        if (presetPredefinito) {
          setFiltriAttivi(presetPredefinito.filtri as FiltriMappa);
        }
        
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    caricaPreset();
  }, [userId]);

  // Applica i filtri e ottieni i risultati
  const applicaFiltri = async (filtri?: FiltriMappa) => {
    const filtriDaApplicare = filtri || filtriAttivi;
    
    try {
      setIsLoading(true);
      const risultati = await servizioFiltriMappa.applicaFiltri(filtriDaApplicare);
      setRisultatiFiltrati(risultati);
      
      if (filtri) {
        setFiltriAttivi(filtri);
      }
      
      setError(null);
      return risultati;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Salva un preset di filtri
  const salvaPreset = async (nome: string) => {
    if (!userId) {
      throw new Error('Utente non autenticato');
    }
    
    try {
      setIsLoading(true);
      const nuovoPreset = await servizioFiltriMappa.salvaPresetFiltri(nome, filtriAttivi, userId);
      setPresetSalvati([nuovoPreset, ...presetSalvati]);
      setError(null);
      return nuovoPreset;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Imposta un preset come predefinito
  const impostaPresetPredefinito = async (presetId: string) => {
    if (!userId) {
      throw new Error('Utente non autenticato');
    }
    
    try {
      setIsLoading(true);
      await servizioFiltriMappa.impostaPresetPredefinito(presetId, userId);
      
      // Aggiorna la lista dei preset
      const updatedPresets = presetSalvati.map(preset => ({
        ...preset,
        predefinito: preset.id === presetId
      }));
      
      setPresetSalvati(updatedPresets);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Elimina un preset
  const eliminaPreset = async (presetId: string) => {
    if (!userId) {
      throw new Error('Utente non autenticato');
    }
    
    try {
      setIsLoading(true);
      await servizioFiltriMappa.eliminaPreset(presetId, userId);
      
      // Rimuovi il preset dalla lista
      const updatedPresets = presetSalvati.filter(preset => preset.id !== presetId);
      setPresetSalvati(updatedPresets);
      
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    filtriAttivi,
    setFiltriAttivi,
    presetSalvati,
    risultatiFiltrati,
    isLoading,
    error,
    applicaFiltri,
    salvaPreset,
    impostaPresetPredefinito,
    eliminaPreset
  };
}
