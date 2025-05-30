import React, { useState } from 'react';
import { authService, profileService, venueService } from '../services/supabase-integration';
import TerritorySelector from './TerritorySelector';

interface RegistrazioneLocaleProps {
  onComplete?: (venueId: string) => void;
  onCancel?: () => void;
}

const RegistrazioneLocale: React.FC<RegistrazioneLocaleProps> = ({ onComplete, onCancel }) => {
  // Estado para controlar a etapa atual do formulário
  const [step, setStep] = useState<number>(1);
  
  // Estados para os dados do formulário
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [tipoLocale, setTipoLocale] = useState<string>('');
  const [capienza, setCapienza] = useState<number | undefined>(undefined);
  const [descrizione, setDescrizione] = useState<string>('');
  const [indirizzo, setIndirizzo] = useState<string>('');
  const [citta, setCitta] = useState<string>('');
  const [regione, setRegione] = useState<string>('');
  const [cap, setCap] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [emailContatto, setEmailContatto] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [sitoWeb, setSitoWeb] = useState<string>('');
  const [orariApertura, setOrariApertura] = useState<Record<string, string>>({});
  const [servizi, setServizi] = useState<string[]>([]);
  const [accessibilita, setAccessibilita] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  
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
      if (!nome) newErrors.nome = 'Nome locale obbligatorio';
      if (!tipoLocale) newErrors.tipoLocale = 'Tipo locale obbligatorio';
    }
    
    if (currentStep === 3) {
      if (!indirizzo) newErrors.indirizzo = 'Indirizzo obbligatorio';
      if (!citta) newErrors.citta = 'Città obbligatoria';
      if (!regione) newErrors.regione = 'Regione obbligatoria';
      if (!latitude || !longitude) newErrors.territorio = 'Seleziona la posizione sulla mappa';
    }
    
    if (currentStep === 4) {
      if (!emailContatto) newErrors.emailContatto = 'Email di contatto obbligatoria';
      else if (!/\S+@\S+\.\S+/.test(emailContatto)) newErrors.emailContatto = 'Email non valida';
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

  // Função para adicionar serviço
  const addServizio = (servizio: string) => {
    if (servizio && !servizi.includes(servizio)) {
      setServizi([...servizi, servizio]);
    }
  };

  // Função para remover serviço
  const removeServizio = (index: number) => {
    setServizi(servizi.filter((_, i) => i !== index));
  };

  // Função para adicionar opção de acessibilidade
  const addAccessibilita = (opzione: string) => {
    if (opzione && !accessibilita.includes(opzione)) {
      setAccessibilita([...accessibilita, opzione]);
    }
  };

  // Função para remover opção de acessibilidade
  const removeAccessibilita = (index: number) => {
    setAccessibilita(accessibilita.filter((_, i) => i !== index));
  };

  // Função para atualizar horários de abertura
  const updateOrario = (giorno: string, orario: string) => {
    setOrariApertura({
      ...orariApertura,
      [giorno]: orario
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
        firstName: nome.split(' ')[0],
        lastName: nome.split(' ').slice(1).join(' '),
        userType: 'gestore_locale',
      });
      
      if (profileError) throw new Error(profileError.message);
      
      // 3. Criar perfil de local/venue
      const { data: venueData, error: venueError } = await venueService.createVenue({
        profileId: userId,
        name: nome,
        venueType: tipoLocale,
        capacity: capienza,
        description: descrizione,
        address: indirizzo,
        city: citta,
        region: regione,
        postalCode: cap,
        latitude: latitude!,
        longitude: longitude!,
        contactEmail: emailContatto,
        contactPhone: telefono,
        website: sitoWeb,
        openingHours: orariApertura,
        services: servizi,
        accessibility: accessibilita,
        socialLinks: socialLinks
      });
      
      if (venueError) throw new Error(venueError.message);
      
      // Registro completo com sucesso
      if (onComplete && venueData) {
        onComplete(venueData.id);
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
            <h2>Registrazione Locale</h2>
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
          <div className="venue-step">
            <h2>Informazioni sul Locale</h2>
            <p>Raccontaci del tuo locale</p>
            
            <div className="form-group">
              <label htmlFor="nome">Nome del Locale</label>
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
              <label htmlFor="tipoLocale">Tipo di Locale</label>
              <select
                id="tipoLocale"
                value={tipoLocale}
                onChange={(e) => setTipoLocale(e.target.value)}
                className={errors.tipoLocale ? 'error' : ''}
              >
                <option value="">Seleziona un tipo</option>
                <option value="Club">Club</option>
                <option value="Teatro">Teatro</option>
                <option value="Sala concerti">Sala concerti</option>
                <option value="Bar con musica">Bar con musica</option>
                <option value="Pub">Pub</option>
                <option value="Discoteca">Discoteca</option>
                <option value="Spazio all'aperto">Spazio all'aperto</option>
                <option value="Altro">Altro</option>
              </select>
              {errors.tipoLocale && <span className="error-message">{errors.tipoLocale}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="capienza">Capienza (persone)</label>
              <input
                type="number"
                id="capienza"
                value={capienza || ''}
                onChange={(e) => setCapienza(e.target.value ? parseInt(e.target.value) : undefined)}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="descrizione">Descrizione (opzionale)</label>
              <textarea
                id="descrizione"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
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
          <div className="address-step">
            <h2>Indirizzo e Posizione</h2>
            <p>Dove si trova il tuo locale?</p>
            
            <div className="form-group">
              <label htmlFor="indirizzo">Indirizzo</label>
              <input
                type="text"
                id="indirizzo"
                value={indirizzo}
                onChange={(e) => setIndirizzo(e.target.value)}
                className={errors.indirizzo ? 'error' : ''}
              />
              {errors.indirizzo && <span className="error-message">{errors.indirizzo}</span>}
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="regione">Regione</label>
              <input
                type="text"
                id="regione"
                value={regione}
                onChange={(e) => setRegione(e.target.value)}
                className={errors.regione ? 'error' : ''}
              />
              {errors.regione && <span className="error-message">{errors.regione}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cap">CAP (opzionale)</label>
              <input
                type="text"
                id="cap"
                value={cap}
                onChange={(e) => setCap(e.target.value)}
              />
            </div>
            
            <div className="form-group map-container">
              <label>Posizione sulla mappa</label>
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
          <div className="details-step">
            <h2>Dettagli e Contatti</h2>
            <p>Aggiungi informazioni utili per i visitatori</p>
            
            <div className="form-group">
              <label htmlFor="emailContatto">Email di Contatto</label>
              <input
                type="email"
                id="emailContatto"
                value={emailContatto}
                onChange={(e) => setEmailContatto(e.target.value)}
                className={errors.emailContatto ? 'error' : ''}
              />
              {errors.emailContatto && <span className="error-message">{errors.emailContatto}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">Telefono (opzionale)</label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sitoWeb">Sito Web (opzionale)</label>
              <input
                type="text"
                id="sitoWeb"
                value={sitoWeb}
                onChange={(e) => setSitoWeb(e.target.value)}
                placeholder="https://tuosito.com"
              />
            </div>
            
            <div className="form-group">
              <label>Servizi Disponibili</label>
              <div className="tag-input">
                <input
                  type="text"
                  id="servizio"
                  placeholder="Aggiungi servizio e premi Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addServizio((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <div className="tags">
                  {servizi.map((servizio, index) => (
                    <span key={index} className="tag">
                      {servizio}
                      <button type="button" onClick={() => removeServizio(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Accessibilità</label>
              <div className="tag-input">
                <input
                  type="text"
                  id="accessibilita"
                  placeholder="Aggiungi opzione e premi Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAccessibilita((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <div className="tags">
                  {accessibilita.map((opzione, index) => (
                    <span key={index} className="tag">
                      {opzione}
                      <button type="button" onClick={() => removeAccessibilita(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Social Media (opzionale)</label>
              <div className="social-inputs">
                <div className="social-input">
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    type="text"
                    id="facebook"
                    value={socialLinks.facebook || ''}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    placeholder="https://facebook.com/tuoprofilo"
                  />
                </div>
                <div className="social-input">
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    type="text"
                    id="instagram"
                    value={socialLinks.instagram || ''}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    placeholder="https://instagram.com/tuoprofilo"
                  />
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
    <div className="registration-form venue-registration">
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

export default RegistrazioneLocale;
