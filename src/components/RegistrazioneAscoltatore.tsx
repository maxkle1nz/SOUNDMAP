import React, { useState } from 'react';
import { authService, profileService, listenerService } from '../services/supabase-integration';
import TerritorySelector from './TerritorySelector';

interface RegistrazioneAscoltatoreProps {
  onComplete?: (userId: string) => void;
  onCancel?: () => void;
}

const RegistrazioneAscoltatore: React.FC<RegistrazioneAscoltatoreProps> = ({ onComplete, onCancel }) => {
  // Estado para controlar a etapa atual do formulário
  const [step, setStep] = useState<number>(1);
  
  // Estados para os dados do formulário
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [cognome, setCognome] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [generiPreferiti, setGeneriPreferiti] = useState<string[]>([]);
  const [citta, setCitta] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [visibilitaProfilo, setVisibilitaProfilo] = useState<string>('pubblico');
  const [notifiche, setNotifiche] = useState<Record<string, boolean>>({
    nuoviArtisti: true,
    eventiVicini: true,
    nuoviBrani: false
  });
  
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
      if (!nome) newErrors.nome = 'Nome obbligatorio';
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

  // Função para adicionar gênero musical
  const addGenere = (genere: string) => {
    if (genere && !generiPreferiti.includes(genere)) {
      setGeneriPreferiti([...generiPreferiti, genere]);
    }
  };

  // Função para remover gênero musical
  const removeGenere = (index: number) => {
    setGeneriPreferiti(generiPreferiti.filter((_, i) => i !== index));
  };

  // Função para atualizar configurações de notificação
  const updateNotifica = (tipo: string, valore: boolean) => {
    setNotifiche({
      ...notifiche,
      [tipo]: valore
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
        firstName: nome,
        lastName: cognome,
        userType: 'ascoltatore',
        genrePreferences: generiPreferiti
      });
      
      if (profileError) throw new Error(profileError.message);
      
      // 3. Atualizar preferências do ouvinte
      const { data: listenerData, error: listenerError } = await listenerService.updateListenerPreferences(userId, {
        genres: generiPreferiti,
        listeningPreferences: {
          visibilityProfile: visibilitaProfilo,
          notifications: notifiche,
          nickname: nickname
        }
      });
      
      if (listenerError) throw new Error(listenerError.message);
      
      // 4. Atualizar localização (necessário adicionar campos ao perfil)
      const { data: locationData, error: locationError } = await profileService.updateProfile(userId, {
        city: citta,
        latitude: latitude,
        longitude: longitude
      });
      
      if (locationError) throw new Error(locationError.message);
      
      // Registro completo com sucesso
      if (onComplete) {
        onComplete(userId);
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
            <h2>Registrazione Ascoltatore</h2>
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
            <h2>Il Tuo Profilo</h2>
            <p>Raccontaci di te</p>
            
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={errors.nome ? 'error' : ''}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cognome">Cognome (opzionale)</label>
              <input
                type="text"
                id="cognome"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nickname">Nickname (opzionale)</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Generi Musicali Preferiti</label>
              <div className="tag-input">
                <select
                  id="genere"
                  onChange={(e) => {
                    if (e.target.value) {
                      addGenere(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Seleziona generi</option>
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
                <div className="tags">
                  {generiPreferiti.map((genere, index) => (
                    <span key={index} className="tag">
                      {genere}
                      <button type="button" onClick={() => removeGenere(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
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
          <div className="preferences-step">
            <h2>Preferenze</h2>
            <p>Personalizza la tua esperienza</p>
            
            <div className="form-group">
              <label htmlFor="visibilitaProfilo">Visibilità Profilo</label>
              <select
                id="visibilitaProfilo"
                value={visibilitaProfilo}
                onChange={(e) => setVisibilitaProfilo(e.target.value)}
              >
                <option value="pubblico">Pubblico</option>
                <option value="solo_amici">Solo Amici</option>
                <option value="privato">Privato</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Notifiche</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="notifica_artisti"
                    checked={notifiche.nuoviArtisti}
                    onChange={(e) => updateNotifica('nuoviArtisti', e.target.checked)}
                  />
                  <label htmlFor="notifica_artisti">Nuovi artisti nella tua zona</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="notifica_eventi"
                    checked={notifiche.eventiVicini}
                    onChange={(e) => updateNotifica('eventiVicini', e.target.checked)}
                  />
                  <label htmlFor="notifica_eventi">Eventi vicino a te</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="notifica_brani"
                    checked={notifiche.nuoviBrani}
                    onChange={(e) => updateNotifica('nuoviBrani', e.target.checked)}
                  />
                  <label htmlFor="notifica_brani">Nuovi brani degli artisti che segui</label>
                </div>
              </div>
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
    <div className="registration-form listener-registration">
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

export default RegistrazioneAscoltatore;
