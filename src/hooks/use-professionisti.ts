import { useState, useEffect } from 'react';
import { servizioProfessionisti } from '@/services/professionisti';
import type { Professionista } from '@/types/entita';

// Hook per gestire i professionisti
export function useProfessionisti() {
  const [professionisti, setProfessionisti] = useState<Professionista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const caricaProfessionisti = async () => {
      try {
        setIsLoading(true);
        const data = await servizioProfessionisti.getTuttiProfessionisti();
        setProfessionisti(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    caricaProfessionisti();
  }, []);

  const getProfessionistiPerTipo = async (tipo: string) => {
    try {
      setIsLoading(true);
      const data = await servizioProfessionisti.getProfessionistiPerTipo(tipo);
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getProfessionistiPerCitta = async (citta: string) => {
    try {
      setIsLoading(true);
      const data = await servizioProfessionisti.getProfessionistiPerCitta(citta);
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const creaProfessionista = async (datiProfessionista: any) => {
    try {
      setIsLoading(true);
      const data = await servizioProfessionisti.creaProfessionista(datiProfessionista);
      setProfessionisti([...professionisti, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    professionisti,
    isLoading,
    error,
    getProfessionistiPerTipo,
    getProfessionistiPerCitta,
    creaProfessionista
  };
}
