// src/services/supabase-integration.js
import { supabase } from '@/lib/supabase';

/**
 * Serviço completo de integração com Supabase para autenticação e registro
 * de usuários com seleção de território
 */
export const authService = {
  /**
   * Registra um novo usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} - Resultado da operação
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { data: null, error };
    }
  },

  /**
   * Realiza login de usuário existente
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} - Resultado da operação
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { data: null, error };
    }
  },

  /**
   * Realiza logout do usuário atual
   * @returns {Promise} - Resultado da operação
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { error };
    }
  },

  /**
   * Recupera senha do usuário
   * @param {string} email - Email do usuário
   * @returns {Promise} - Resultado da operação
   */
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtém o usuário atual
   * @returns {Promise} - Usuário atual ou null
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return { user: null, error };
    }
  },

  /**
   * Obtém a sessão atual
   * @returns {Promise} - Sessão atual ou null
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return { session: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de perfis de usuário
 */
export const profileService = {
  /**
   * Cria um perfil base para o usuário após registro
   * @param {string} userId - ID do usuário autenticado
   * @param {Object} profileData - Dados do perfil
   * @returns {Promise} - Resultado da operação
   */
  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: profileData.firstName || '',
          last_name: profileData.lastName || '',
          avatar_url: profileData.avatarUrl || '',
          tipo_utente: profileData.userType || 'ascoltatore',
          generi_preferiti: profileData.genrePreferences || [],
          preferenze_ascolto: profileData.listeningPreferences || {},
          updated_at: new Date()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualiza um perfil existente
   * @param {string} userId - ID do usuário
   * @param {Object} updates - Campos a atualizar
   * @returns {Promise} - Resultado da operação
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtém um perfil pelo ID do usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise} - Resultado da operação
   */
  async getProfileById(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return { data: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de artistas
 */
export const artistService = {
  /**
   * Cria um perfil de artista
   * @param {Object} artistData - Dados do artista
   * @returns {Promise} - Resultado da operação
   */
  async createArtist(artistData) {
    try {
      const { data, error } = await supabase
        .from('artists')
        .insert({
          profile_id: artistData.profileId,
          name: artistData.name,
          genre: artistData.genre,
          bio: artistData.bio || '',
          city: artistData.city,
          latitudine: artistData.latitude,
          longitudine: artistData.longitude,
          image_url: artistData.imageUrl || '',
          social_links: artistData.socialLinks || {}
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar artista:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualiza a localização do artista
   * @param {string} artistId - ID do artista
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise} - Resultado da operação
   */
  async updateArtistLocation(artistId, latitude, longitude) {
    try {
      const { data, error } = await supabase
        .from('artists')
        .update({
          latitudine: latitude,
          longitudine: longitude
        })
        .eq('id', artistId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar localização do artista:', error);
      return { data: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de profissionais
 */
export const professionalService = {
  /**
   * Cria um perfil de profissional
   * @param {Object} professionalData - Dados do profissional
   * @returns {Promise} - Resultado da operação
   */
  async createProfessional(professionalData) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert({
          profile_id: professionalData.profileId,
          nome_attivita: professionalData.businessName,
          tipo_professione: professionalData.professionType,
          specializzazioni: professionalData.specializations || [],
          servizi_offerti: professionalData.services || [],
          anni_esperienza: professionalData.yearsOfExperience,
          portfolio_url: professionalData.portfolioUrl || '',
          biografia: professionalData.bio || '',
          citta: professionalData.city,
          regione: professionalData.region,
          indirizzo: professionalData.address || '',
          latitudine: professionalData.latitude,
          longitudine: professionalData.longitude,
          immagine_url: professionalData.imageUrl || '',
          tariffa_oraria: professionalData.hourlyRate,
          disponibilita: professionalData.availability || '',
          social_links: professionalData.socialLinks || {},
          contatti: professionalData.contacts || {}
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar profissional:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualiza a localização do profissional
   * @param {string} professionalId - ID do profissional
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise} - Resultado da operação
   */
  async updateProfessionalLocation(professionalId, latitude, longitude) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          latitudine: latitude,
          longitudine: longitude
        })
        .eq('id', professionalId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar localização do profissional:', error);
      return { data: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de locais/venues
 */
export const venueService = {
  /**
   * Cria um perfil de local/venue
   * @param {Object} venueData - Dados do local
   * @returns {Promise} - Resultado da operação
   */
  async createVenue(venueData) {
    try {
      const { data, error } = await supabase
        .from('locali')
        .insert({
          profile_id: venueData.profileId,
          nome: venueData.name,
          tipo_locale: venueData.venueType,
          capienza: venueData.capacity,
          descrizione: venueData.description || '',
          indirizzo: venueData.address,
          citta: venueData.city,
          regione: venueData.region,
          cap: venueData.postalCode || '',
          latitudine: venueData.latitude,
          longitudine: venueData.longitude,
          email_contatto: venueData.contactEmail,
          telefono_contatto: venueData.contactPhone || '',
          sito_web: venueData.website || '',
          orari_apertura: venueData.openingHours || {},
          servizi: venueData.services || [],
          accessibilita: venueData.accessibility || [],
          immagine_url: venueData.imageUrl || '',
          social_links: venueData.socialLinks || {}
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar local:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualiza a localização do local/venue
   * @param {string} venueId - ID do local
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise} - Resultado da operação
   */
  async updateVenueLocation(venueId, latitude, longitude) {
    try {
      const { data, error } = await supabase
        .from('locali')
        .update({
          latitudine: latitude,
          longitudine: longitude
        })
        .eq('id', venueId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar localização do local:', error);
      return { data: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de ouvintes
 */
export const listenerService = {
  /**
   * Atualiza preferências do ouvinte
   * @param {string} userId - ID do usuário
   * @param {Object} preferences - Preferências do ouvinte
   * @returns {Promise} - Resultado da operação
   */
  async updateListenerPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          generi_preferiti: preferences.genres || [],
          preferenze_ascolto: preferences.listeningPreferences || {}
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar preferências do ouvinte:', error);
      return { data: null, error };
    }
  }
};

/**
 * Serviço para upload de arquivos
 */
export const storageService = {
  /**
   * Faz upload de uma imagem
   * @param {File} file - Arquivo de imagem
   * @param {string} path - Caminho no storage
   * @returns {Promise} - URL pública da imagem
   */
  async uploadImage(file, path = 'profile-images') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      return { url: null, error };
    }
  }
};

/**
 * Serviço para gerenciamento de territórios no mapa
 */
export const territoryService = {
  /**
   * Busca entidades próximas a um ponto
   * @param {number} latitude - Latitude do ponto central
   * @param {number} longitude - Longitude do ponto central
   * @param {number} radiusKm - Raio em quilômetros
   * @param {Array} types - Tipos de entidades a buscar
   * @returns {Promise} - Entidades encontradas
   */
  async findNearbyEntities(latitude, longitude, radiusKm = 10, types = ['artista', 'professionista', 'locale', 'scena']) {
    try {
      const { data, error } = await supabase.rpc('filtra_entita_mappa', {
        parametri_filtro: {
          lat: latitude,
          lng: longitude,
          raggio_km: radiusKm,
          mostra_artisti: types.includes('artista'),
          mostra_professionisti: types.includes('professionista'),
          mostra_locali: types.includes('locale'),
          mostra_scene: types.includes('scena')
        }
      });

      if (error) throw error;
      return { entities: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar entidades próximas:', error);
      return { entities: [], error };
    }
  },

  /**
   * Geocodifica um endereço para obter coordenadas
   * @param {string} address - Endereço completo
   * @returns {Promise} - Coordenadas do endereço
   */
  async geocodeAddress(address) {
    try {
      // Usando Nominatim OpenStreetMap API (gratuito, mas com limites de uso)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          coordinates: {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
          },
          error: null
        };
      } else {
        return {
          coordinates: null,
          error: new Error('Endereço não encontrado')
        };
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      return { coordinates: null, error };
    }
  }
};
