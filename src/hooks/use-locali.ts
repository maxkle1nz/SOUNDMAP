import { useState, useEffect } from 'react';
import { servizioLocali } from '@/services/locali';
import type { Locale } from '@/types/entita';

// Hook per gestire i locali
export function useLocali() {
  const [locali, setLocali] = useState<Locale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const caricaLocali = async () => {
      try {
        setIsLoading(true);
        const data = await servizioLocali.getTuttiLocali();
        setLocali(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    caricaLocali();
  }, []);

  const getLocaliPerTipo = async (tipo: string) => {
    try {
      setIsLoading(true);
      const data = await servizioLocali.getLocaliPerTipo(tipo);
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getLocaliPerCitta = async (citta: string) => {
    try {
      setIsLoading(true);
      const data = await servizioLocali.getLocaliPerCitta(citta);
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const creaLocale = async (datiLocale: any) => {
    try {
      setIsLoading(true);
      const data = await servizioLocali.creaLocale(datiLocale);
      setLocali([...locali, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEventiFuturi = async (localeId: string) => {
    try {
      setIsLoading(true);
      const data = await servizioLocali.getEventiFuturi(localeId);
      return data;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locali,
    isLoading,
    error,
    getLocaliPerTipo,
    getLocaliPerCitta,
    creaLocale,
    getEventiFuturi
  };
}
