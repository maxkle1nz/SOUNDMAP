// Implementação da integração com Supabase Auth
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Configuração do cliente Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hook personalizado para autenticação
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar sessão atual
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Função para registro de usuário
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);

      // Registrar usuário no Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              ...userData,
              updated_at: new Date(),
            },
          ]);

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para login
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Função para recuperação de senha
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil de usuário
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}

// API para gerenciamento de perfis específicos
export const profilesAPI = {
  // Criar perfil de artista
  createArtistProfile: async (userId, artistData) => {
    try {
      // Atualizar tipo de usuário no perfil base
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          tipo_utente: 'artista',
          generi_preferiti: artistData.generi || [],
          updated_at: new Date(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Criar perfil de profissional
  createProfessionalProfile: async (userId, professionalData) => {
    try {
      // Atualizar tipo de usuário no perfil base
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          tipo_utente: 'professionista',
          updated_at: new Date(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Criar entrada na tabela de profissionais
      const { error: professionalError } = await supabase
        .from('professionals')
        .insert([
          {
            id: userId,
            nome_professionale: professionalData.nome_professionale,
            specializzazione: professionalData.specializzazione,
            servizi_offerti: professionalData.servizi_offerti || [],
            tariffa_oraria: professionalData.tariffa_oraria,
            disponibilita: professionalData.disponibilita || {},
            contatti: professionalData.contatti || {},
            posizione: professionalData.posizione,
            citta: professionalData.citta,
          },
        ]);

      if (professionalError) throw professionalError;

      // Adicionar categorias se fornecidas
      if (professionalData.categorie && professionalData.categorie.length > 0) {
        for (const categoriaId of professionalData.categorie) {
          const { error: categoriaError } = await supabase
            .from('professionisti_categorie')
            .insert([
              {
                professionista_id: userId,
                categoria_id: categoriaId,
              },
            ]);

          if (categoriaError) throw categoriaError;
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Criar perfil de local/venue
  createVenueProfile: async (userId, venueData) => {
    try {
      // Atualizar tipo de usuário no perfil base
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          tipo_utente: 'gestore_locale',
          updated_at: new Date(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Criar entrada na tabela de locais
      const { data, error: localeError } = await supabase
        .from('locali')
        .insert([
          {
            nome: venueData.nome,
            descrizione: venueData.descrizione,
            indirizzo: venueData.indirizzo,
            posizione: venueData.posizione,
            citta: venueData.citta,
            capacita: venueData.capacita,
            tipo_locale: venueData.tipo_locale,
            servizi_disponibili: venueData.servizi_disponibili || [],
            contatti: venueData.contatti || {},
            orari_apertura: venueData.orari_apertura || {},
            gestore_id: userId,
          },
        ])
        .select();

      if (localeError) throw localeError;

      // Adicionar cenas musicais se fornecidas
      if (venueData.scene && venueData.scene.length > 0 && data && data[0]) {
        for (const scenaId of venueData.scene) {
          const { error: scenaError } = await supabase
            .from('locali_scene')
            .insert([
              {
                locale_id: data[0].id,
                scena_id: scenaId,
              },
            ]);

          if (scenaError) throw scenaError;
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Criar perfil de ouvinte
  createListenerProfile: async (userId, listenerData) => {
    try {
      // Atualizar tipo de usuário no perfil base
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          tipo_utente: 'ascoltatore',
          generi_preferiti: listenerData.generi_preferiti || [],
          preferenze_ascolto: listenerData.preferenze_ascolto || {},
          updated_at: new Date(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Obter perfil de usuário por ID
  getProfileById: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter perfil profissional por ID
  getProfessionalById: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter locais gerenciados por um usuário
  getVenuesByManager: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('locali')
        .select('*')
        .eq('gestore_id', userId);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// API para gerenciamento de entidades no mapa
export const mapAPI = {
  // Obter entidades filtradas para o mapa
  getFilteredEntities: async (filters) => {
    try {
      const { data, error } = await supabase.rpc('filter_map_entities', {
        p_tipo_entita: filters.tipo_entita || null,
        p_genere_musicale: filters.genere_musicale || null,
        p_citta: filters.citta || null,
        p_raggio_km: filters.raggio_km || 10,
        p_lat: filters.lat || null,
        p_lng: filters.lng || null,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter cenas musicais
  getMusicScenes: async () => {
    try {
      const { data, error } = await supabase
        .from('scene_musicali')
        .select('*');

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter categorias de profissionais
  getProfessionalCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categorie_professionisti')
        .select('*');

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// API para gerenciamento de conteúdo
export const contentAPI = {
  // Upload de música para artista
  uploadTrack: async (userId, trackData, audioFile) => {
    try {
      // Upload do arquivo de áudio
      const fileName = `${userId}/${Date.now()}-${audioFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('tracks')
        .getPublicUrl(fileName);

      // Criar entrada na tabela de tracks (a ser criada no schema)
      // Esta é uma sugestão para extensão futura
      /*
      const { error: trackError } = await supabase
        .from('tracks')
        .insert([
          {
            artista_id: userId,
            titulo: trackData.titulo,
            genero: trackData.genero,
            duracao: trackData.duracao,
            url: urlData.publicUrl,
            created_at: new Date(),
          },
        ]);

      if (trackError) throw trackError;
      */

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      return { url: null, error };
    }
  },

  // Criar evento para local
  createEvent: async (venueId, eventData) => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .insert([
          {
            nome: eventData.nome,
            descrizione: eventData.descrizione,
            locale_id: venueId,
            data_inizio: eventData.data_inizio,
            data_fine: eventData.data_fine,
            generi_musicali: eventData.generi_musicali || [],
            prezzo_ingresso: eventData.prezzo_ingresso,
          },
        ])
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obter eventos de um local
  getVenueEvents: async (venueId) => {
    try {
      const { data, error } = await supabase
        .from('eventi')
        .select('*')
        .eq('locale_id', venueId)
        .order('data_inizio', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Exportar todas as APIs
export const api = {
  auth: useAuth,
  profiles: profilesAPI,
  map: mapAPI,
  content: contentAPI,
};

export default api;
