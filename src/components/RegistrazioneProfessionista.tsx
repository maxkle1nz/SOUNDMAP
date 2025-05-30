import React, { useState } from 'react';
import { authService, profileService, professionalService } from '../services/supabase-integration';
import TerritorySelector from './TerritorySelector';

interface RegistrazioneProfessionistaProps {
  onComplete?: (professionalId: string) => void;
  onCancel?: () => void;
}

const RegistrazioneProfessionista: React.FC<RegistrazioneProfessionistaProps> = ({ onComplete, onCancel }) => {
  // Estado para controlar a etapa atual do formulário
  const [step, setStep] = useState<number>(1);
  
  // Estados para os dados do formulário
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nomeAttivita, setNomeAttivita] = useState<string>('');
  const [tipoProfessione, setTipoProfessione] = useState<string>('');
  const [specializzazioni, setSpecializzazioni] = useState<string[]>([]);
  const [serviziOfferti, setServiziOfferti] = useState<string[]>([]);
  const [anniEsperienza, setAnniEsperienza] = useState<number | undefined>(undefined);
  const [biografia, setBiografia] = useState<string>('');
  const [citta, setCitta] = useState<string>('');
  const [regione, setRegione] = useState<string>('');
  const [indirizzo, setIndirizzo] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [tariffa, setTariffa] = useState<string>('');
  const [disponibilita, setDisponibilita] = useState<string>('');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');
  const [emailProfessionale, setEmailProfessionale] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
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
      if (!nomeAttivita) newErrors.nomeAttivita = 'Nome attività obbligatorio';
      if (!tipoProfessione) newErrors.tipoProfessione = 'Tipo professione obbligatorio';
      if (specializzazioni.length === 0) newErrors.specializzazioni = 'Almeno una specializzazione obbligatoria';
      if (serviziOfferti.length === 0) newErrors.serviziOfferti = 'Almeno un servizio obbligatorio';
    }
    
    if (currentStep === 3) {
      if (!citta) newErrors.citta = 'Città obbligatoria';
      if (!regione) newErrors.regione = 'Regione obbligatoria';
      if (!latitude || !longitude) newErrors.territorio = 'Seleziona la tua posizione sulla mappa';
    }
    
    if (currentStep === 4) {
      if (!emailProfessionale) newErrors.emailProfessionale = 'Email professionale obbligatoria';
      else if (!/\S+@\S+\.\S+/.test(emailProfessionale)) newErrors.emailProfessionale = 'Email non valida';
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

  // Função para adicionar especialização
  const addSpecializzazione = (specializzazione: string) => {
    if (specializzazione && !specializzazioni.includes(specializzazione)) {
      setSpecializzazioni([...specializzazioni, specializzazione]);
    }
  };

  // Função para remover especialização
  const removeSpecializzazione = (index: number) => {
    setSpecializzazioni(specializzazioni.filter((_, i) => i !== index));
  };

  // Função para adicionar serviço
  const addServizio = (servizio: string) => {
    if (servizio && !serviziOfferti.includes(servizio)) {
      setServiziOfferti([...serviziOfferti, servizio]);
    }
  };

  // Função para remover serviço
  const removeServizio = (index: number) => {
    setServiziOfferti(serviziOfferti.filter((_, i) => i !== index));
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
        firstName: nomeAttivita.split(' ')[0],
        lastName: nomeAttivita.split(' ').slice(1).join(' '),
        userType: 'professionista',
      });
      
      if (profileError) throw new Error(profileError.message);
      
      // 3. Criar perfil de profissional
      const { data: professionalData, error: professionalError } = await professionalService.createProfessional({
        profileId: userId,
        businessName: nomeAttivita,
        professionType: tipoProfessione,
        specializations: specializzazioni,
        services: serviziOfferti,
        yearsOfExperience: anniEsperienza,
        bio: biografia,
        city: citta,
        region: regione,
        address: indirizzo,
        latitude: latitude!,
        longitude: longitude!,
        hourlyRate: parseFloat(tariffa) || 0,
        availability: disponibilita,
        portfolioUrl: portfolioUrl,
        socialLinks: socialLinks,
        contacts: {
          email: emailProfessionale,
          phone: telefono
        }
      });
      
      if (professionalError) throw new Error(professionalError.message);
      
      // Registro completo com sucesso
      if (onComplete && professionalData) {
        onComplete(professionalData.id);
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
            <h2>Registrazione Professionista</h2>
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
          <div className="professional-step">
            <h2>Profilo Professionale</h2>
            <p>Raccontaci della tua attività</p>
            
            <div className="form-group">
              <label htmlFor="nomeAttivita">Nome Attività</label>
              <input
                type="text"
                id="nomeAttivita"
                value={nomeAttivita}
                onChange={(e) => setNomeAttivita(e.target.value)}
                className={errors.nomeAttivita ? 'error' : ''}
              />
              {errors.nomeAttivita && <span className="error-message">{errors.nomeAttivita}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="tipoProfessione">Tipo di Professione</label>
              <select
                id="tipoProfessione"
                value={tipoProfessione}
                onChange={(e) => setTipoProfessione(e.target.value)}
                className={errors.tipoProfessione ? 'error' : ''}
              >
                <option value="">Seleziona un tipo</option>
                <option value="Produttore">Produttore</option>
                <option value="Fonico">Fonico</option>
                <option value="Manager">Manager</option>
                <option value="Promoter">Promoter</option>
                <option value="DJ">DJ</option>
                <option value="Tecnico del suono">Tecnico del suono</option>
                <option value="Insegnante di musica">Insegnante di musica</option>
                <option value="Altro">Altro</option>
              </select>
              {errors.tipoProfessione && <span className="error-message">{errors.tipoProfessione}</span>}
            </div>
            
            <div className="form-group">
              <label>Specializzazioni</label>
              <div className="tag-input">
                <input
                  type="text"
                  id="specializzazione"
                  placeholder="Aggiungi specializzazione e premi Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecializzazione((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className={errors.specializzazioni ? 'error' : ''}
                />
                <div className="tags">
                  {specializzazioni.map((spec, index) => (
                    <span key={index} className="tag">
                      {spec}
                      <button type="button" onClick={() => removeSpecializzazione(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.specializzazioni && <span className="error-message">{errors.specializzazioni}</span>}
            </div>
            
            <div className="form-group">
              <label>Servizi Offerti</label>
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
                  className={errors.serviziOfferti ? 'error' : ''}
                />
                <div className="tags">
                  {serviziOfferti.map((servizio, index) => (
                    <span key={index} className="tag">
                      {servizio}
                      <button type="button" onClick={() => removeServizio(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              {errors.serviziOfferti && <span className="error-message">{errors.serviziOfferti}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="anniEsperienza">Anni di Esperienza</label>
              <input
                type="number"
                id="anniEsperienza"
                value={anniEsperienza || ''}
                onChange={(e) => setAnniEsperienza(e.target.value ? parseInt(e.target.value) : undefined)}
                min="0"
              />
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
              <label htmlFor="indirizzo">Indirizzo (opzionale)</label>
              <input
                type="text"
                id="indirizzo"
                value={indirizzo}
                onChange={(e) => setIndirizzo(e.target.value)}
              />
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
          <div className="commercial-step">
            <h2>Informazioni Commerciali</h2>
            <p>Aggiungi dettagli sui tuoi servizi e contatti</p>
            
            <div className="form-group">
              <label htmlFor="tariffa">Tariffa Oraria (€)</label>
              <input
                type="number"
                id="tariffa"
                value={tariffa}
                onChange={(e) => setTariffa(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="disponibilita">Disponibilità</label>
              <select
                id="disponibilita"
                value={disponibilita}
                onChange={(e) => setDisponibilita(e.target.value)}
              >
                <option value="">Seleziona disponibilità</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Weekend">Solo weekend</option>
                <option value="Serale">Solo serale</option>
                <option value="Su richiesta">Su richiesta</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="portfolioUrl">URL Portfolio (opzionale)</label>
              <input
                type="text"
                id="portfolioUrl"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://tuoportfolio.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emailProfessionale">Email Professionale</label>
              <input
                type="email"
                id="emailProfessionale"
                value={emailProfessionale}
                onChange={(e) => setEmailProfessionale(e.target.value)}
                className={errors.emailProfessionale ? 'error' : ''}
              />
              {errors.emailProfessionale && <span className="error-message">{errors.emailProfessionale}</span>}
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
              <label htmlFor="linkedin">LinkedIn (opzionale)</label>
              <input
                type="text"
                id="linkedin"
                value={socialLinks.linkedin || ''}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/tuoprofilo"
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
    <div className="registration-form professional-registration">
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

export default RegistrazioneProfessionista;
