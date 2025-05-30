import React, { useState } from 'react';
import { authService, profileService, artistService } from '../services/supabase-integration';
import TerritorySelector from './TerritorySelector';

interface RegistrazioneArtistaProps {
  onComplete?: (artistId: string) => void;
  onCancel?: () => void;
}

const RegistrazioneArtista: React.FC<RegistrazioneArtistaProps> = ({ onComplete, onCancel }) => {
  // Estado para controlar a etapa atual do formulário
  const [step, setStep] = useState<number>(1);
  
  // Estados para os dados do formulário
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nomeArtistico, setNomeArtistico] = useState<string>('');
  const [genere, setGenere] = useState<string>('');
  const [generiSecondari, setGeneriSecondari] = useState<string[]>([]);
  const [biografia, setBiografia] = useState<string>('');
  const [citta, setCitta] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [siteWeb, setSiteWeb] = useState<string>('');
  const [contattoShows, setContattoShows] = useState<string>('');
  
  // Estados para controle de erros e carregamento
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Função para validar o formulário por etapa
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!email) newErrors.email = 'Email obbligatorio';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email non valido';
      
      if (!password) newErrors.password = 'Password obbligatoria';
      else if (password.length < 6) newErrors.password = 'Password deve avere almeno 6 caratteri';
      
      if (password !== confirmPassword) newErrors.confirmPassword = 'Le password non corrispondono';
    }
    
    if (currentStep === 2) {
      if (!nomeArtistico) newErrors.nomeArtistico = 'Nome artistico obbligatorio';
      if (!genere) newErrors.genere = 'Genere principale obbligatorio';
    }
    
    if (currentStep === 3) {
      if (!citta) newErrors.citta = 'Città obbligatoria';
      if (!latitude || !longitude) newErrors.territorio = 'Seleziona la tua posizione sulla mappa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para avançar para a próxima etapa
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Função para voltar para a etapa anterior
  const prevStep = () => {
    setStep(step - 1);
  };

  // Função para lidar com a seleção de localização no mapa
  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  // Função para adicionar/atualizar link social
  const updateSocialLink = (platform: string, url: string) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: url
    });
  };

  // Função para finalizar o registro
  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setIsLoading(true);
    setRegistrationError(null);
    
    try {
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await authService.signUp(email, password);
      
      if (authError) throw new Error(authError.message);
      
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Errore durante la registrazione');
      
      // 2. Criar perfil base
      const { data: profileData, error: profileError } = await profileService.createProfile(userId, {
        firstName: nomeArtistico,
        lastName: '',
        userType: 'artista',
        genrePreferences: [genere, ...generiSecondari]
      });
      
      if (profileError) throw new Error(profileError.message);
      
      // 3. Criar perfil de artista
      const { data: artistData, error: artistError } = await artistService.createArtist({
        profileId: userId,
        name: nomeArtistico,
        genre: genere,
        bio: biografia,
        city: citta,
        latitude: latitude!,
        longitude: longitude!,
        socialLinks: {
          website: siteWeb,
          contactShows: contattoShows,
          ...socialLinks
        }
      });
      
      if (artistError) throw new Error(artistError.message);
      
      // Registro completo com sucesso
      if (onComplete && artistData) {
        onComplete(artistData.id);
      }
      
    } catch (error) {
      console.error('Erro no registro:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Erro desconhecido durante o registro');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização condicional baseada na etapa atual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="auth-step">
            <h2>Registrazione Artista</h2>
            <p>Crea il tuo account per iniziare</p>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Conferma Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <div className="buttons">
              {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Annulla</button>}
              <button type="button" onClick={nextStep} className="btn-primary">Avanti</button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="profile-step">
            <h2>Profilo Artistico</h2>
            <p>Raccontaci di te e della tua musica</p>
            
            <div className="form-group">
              <label htmlFor="nomeArtistico">Nome Artistico</label>
              <input
                type="text"
                id="nomeArtistico"
                value={nomeArtistico}
                onChange={(e) => setNomeArtistico(e.target.value)}
                className={errors.nomeArtistico ? 'error' : ''}
              />
              {errors.nomeArtistico && <span className="error-message">{errors.nomeArtistico}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="genere">Genere Principale</label>
              <select
                id="genere"
                value={genere}
                onChange={(e) => setGenere(e.target.value)}
                className={errors.genere ? 'error' : ''}
              >
                <option value="">Seleziona un genere</option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Elettronica">Elettronica</option>
                <option value="Jazz">Jazz</option>
                <option value="Classica">Classica</option>
                <option value="Folk">Folk</option>
                <option value="Metal">Metal</option>
                <option value="R&B">R&B</option>
                <option value="Indie">Indie</option>
                <option value="Altro">Altro</option>
              </select>
              {errors.genere && <span className="error-message">{errors.genere}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="biografia">Biografia (opzionale)</label>
              <textarea
                id="biografia"
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="buttons">
              <button type="button" onClick={prevStep} className="btn-secondary">Indietro</button>
              <button type="button" onClick={nextStep} className="btn-primary">Avanti</button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="territory-step">
            <h2>Il Tuo Territorio</h2>
            <p>Seleziona la tua base sulla mappa musicale</p>
            
            <div className="form-group">
              <label htmlFor="citta">Città</label>
              <input
                type="text"
                id="citta"
                value={citta}
                onChange={(e) => setCitta(e.target.value)}
                className={errors.citta ? 'error' : ''}
              />
              {errors.citta && <span className="error-message">{errors.citta}</span>}
            </div>
            
            <div className="form-group map-container">
              <label>Seleziona la tua posizione sulla mappa</label>
              <TerritorySelector
                onLocationSelect={handleLocationSelect}
                initialLatitude={41.9028}
                initialLongitude={12.4964}
                height="300px"
              />
              {errors.territorio && <span className="error-message">{errors.territorio}</span>}
            </div>
            
            <div className="buttons">
              <button type="button" onClick={prevStep} className="btn-secondary">Indietro</button>
              <button type="button" onClick={nextStep} className="btn-primary">Avanti</button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="links-step">
            <h2>Collegamenti e Contatti</h2>
            <p>Aggiungi i tuoi link social e contatti (opzionale)</p>
            
            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                id="instagram"
                value={socialLinks.instagram || ''}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                placeholder="https://instagram.com/tuoprofilo"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="spotify">Spotify</label>
              <input
                type="text"
                id="spotify"
                value={socialLinks.spotify || ''}
                onChange={(e) => updateSocialLink('spotify', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteWeb">Sito Web (opzionale)</label>
              <input
                type="text"
                id="siteWeb"
                value={siteWeb}
                onChange={(e) => setSiteWeb(e.target.value)}
                placeholder="https://tuosito.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contattoShows">Email per Booking (opzionale)</label>
              <input
                type="email"
                id="contattoShows"
                value={contattoShows}
                onChange={(e) => setContattoShows(e.target.value)}
                placeholder="booking@example.com"
              />
            </div>
            
            <div className="buttons">
              <button type="button" onClick={prevStep} className="btn-secondary">Indietro</button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Registrazione in corso...' : 'Completa Registrazione'}
              </button>
            </div>
            
            {registrationError && (
              <div className="error-container">
                <p className="error-message">{registrationError}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="registration-form artist-registration">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        <div className={`progress-line ${step >= 4 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4</div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default RegistrazioneArtista;
