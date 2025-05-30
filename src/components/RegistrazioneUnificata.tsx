import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Box, 
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  Alert
} from '@mui/material';
import TerritorySelector from './TerritorySelector';
import { authService, profileService, artistService, professionalService, venueService, listenerService } from '../services/supabase-integration';

// Tipos de usuários disponíveis
const USER_TYPES = [
  {
    id: 'artista',
    name: 'Artista',
    icon: '🎸',
    description: 'Musicisti, cantanti, band e produttori musicali',
    color: '#FF5722'
  },
  {
    id: 'professionista',
    name: 'Professionista',
    icon: '🎧',
    description: 'Manager, tecnici, producer e operatori del settore',
    color: '#2196F3'
  },
  {
    id: 'locale',
    name: 'Locale / Venue',
    icon: '🏢',
    description: 'Club, teatri, sale concerti e spazi per eventi',
    color: '#4CAF50'
  },
  {
    id: 'ascoltatore',
    name: 'Ascoltatore',
    icon: '🎵',
    description: 'Fan e appassionati di musica',
    color: '#9C27B0'
  },
  {
    id: 'radio',
    name: 'Radio / Media',
    icon: '📻',
    description: 'Radio, podcast, blog e media musicali',
    color: '#FF9800'
  },
  {
    id: 'scene',
    name: 'Scene Musicali',
    icon: '🎭',
    description: 'Collettivi, etichette e scene musicali locali',
    color: '#795548'
  },
  {
    id: 'angel',
    name: 'Music Angel',
    icon: '👼',
    description: 'Investitori e sostenitori di progetti musicali',
    color: '#607D8B'
  }
];

// Gêneros musicais
const GENRES = [
  'Rock', 'Pop', 'Hip Hop', 'Rap', 'R&B', 'Jazz', 'Blues', 'Elettronica',
  'Dance', 'House', 'Techno', 'Classica', 'Folk', 'Country', 'Metal',
  'Punk', 'Indie', 'Alternative', 'Reggae', 'Soul', 'Funk', 'Disco',
  'Ambient', 'EDM', 'Trap', 'Latino', 'World Music', 'Experimental'
];

// Interface para os dados de registro
interface RegistrationData {
  // Dados básicos
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  
  // Dados de perfil
  nome: string;
  cognome: string;
  nomeArtistico: string;
  biography: string;
  genrePrimary: string;
  genresSecondary: string[];
  
  // Localização
  city: string;
  region: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  
  // Dados específicos
  capacity?: number;
  profession?: string;
  specializations?: string[];
  services?: string[];
  businessName?: string;
  
  // Contatos
  website: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: Record<string, string>;
}

const RegistrazioneUnificata: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    
    nome: '',
    cognome: '',
    nomeArtistico: '',
    biography: '',
    genrePrimary: '',
    genresSecondary: [],
    
    city: '',
    region: '',
    address: '',
    latitude: null,
    longitude: null,
    
    website: '',
    contactEmail: '',
    contactPhone: '',
    socialLinks: {}
  });
  
  // Erros de validação
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Passos do formulário
  const steps = ['Tipo di Account', 'Dati Personali', 'Il Tuo Territorio', 'Contatti'];
  
  // Manipulador de mudança de campos
  const handleChange = (field: keyof RegistrationData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Limpar erro de validação quando o campo é alterado
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: ''
      });
    }
  };
  
  // Manipulador para seleção de localização no mapa
  const handleLocationSelect = (latitude: number, longitude: number) => {
    setFormData({
      ...formData,
      latitude,
      longitude
    });
    
    if (validationErrors.latitude || validationErrors.longitude) {
      setValidationErrors({
        ...validationErrors,
        latitude: '',
        longitude: ''
      });
    }
  };
  
  // Manipulador para atualização de links sociais
  const handleSocialLinkChange = (platform: string, url: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: url
      }
    });
  };
  
  // Validação por etapa
  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    
    switch (activeStep) {
      case 0: // Tipo de Conta
        if (!formData.userType) {
          errors.userType = 'Seleziona un tipo di account';
        }
        break;
        
      case 1: // Dados Pessoais
        if (!formData.email) {
          errors.email = 'Email obbligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Email non valido';
        }
        
        if (!formData.password) {
          errors.password = 'Password obbligatoria';
        } else if (formData.password.length < 6) {
          errors.password = 'Password deve avere almeno 6 caratteri';
        }
        
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Le password non corrispondono';
        }
        
        if (!formData.nome) {
          errors.nome = 'Nome obbligatorio';
        }
        
        if (formData.userType === 'artista' && !formData.nomeArtistico) {
          errors.nomeArtistico = 'Nome artistico obbligatorio';
        }
        
        if (!formData.genrePrimary) {
          errors.genrePrimary = 'Genere principale obbligatorio';
        }
        break;
        
      case 2: // Território
        if (!formData.city) {
          errors.city = 'Città obbligatoria';
        }
        
        if (!formData.latitude || !formData.longitude) {
          errors.latitude = 'Seleziona la tua posizione sulla mappa';
        }
        break;
        
      case 3: // Contatos
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          errors.contactEmail = 'Email di contatto non valido';
        }
        
        if (formData.website && !formData.website.startsWith('http')) {
          errors.website = 'Il sito web deve iniziare con http:// o https://';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Avançar para o próximo passo
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  // Enviar formulário
  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Registrar usuário com Supabase Auth
      const { data: authData, error: authError } = await authService.signUp(formData.email, formData.password);
      
      if (authError) throw new Error(authError.message);
      
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Errore durante la registrazione');
      
      // 2. Criar perfil base
      const { error: profileError } = await profileService.createProfile(userId, {
        firstName: formData.nome,
        lastName: formData.cognome,
        userType: formData.userType,
        genrePreferences: [formData.genrePrimary, ...formData.genresSecondary],
        avatarUrl: '',
        listeningPreferences: {}
      });
      
      if (profileError) throw new Error(profileError.message);
      
      // 3. Criar perfil específico baseado no tipo de usuário
      switch (formData.userType) {
        case 'artista':
          await artistService.createArtist({
            profileId: userId,
            name: formData.nomeArtistico || formData.nome,
            genre: formData.genrePrimary,
            bio: formData.biography,
            city: formData.city,
            latitude: formData.latitude!,
            longitude: formData.longitude!,
            socialLinks: formData.socialLinks
          });
          break;
          
        case 'professionista':
          await professionalService.createProfessional({
            profileId: userId,
            businessName: formData.businessName || `${formData.nome} ${formData.cognome}`,
            professionType: formData.profession || '',
            specializations: formData.specializations || [],
            services: formData.services || [],
            bio: formData.biography,
            city: formData.city,
            region: formData.region,
            address: formData.address,
            latitude: formData.latitude!,
            longitude: formData.longitude!,
            contactEmail: formData.contactEmail,
            socialLinks: formData.socialLinks
          });
          break;
          
        case 'locale':
          await venueService.createVenue({
            profileId: userId,
            name: formData.businessName || formData.nomeArtistico,
            venueType: formData.profession || 'club',
            capacity: formData.capacity || 0,
            description: formData.biography,
            address: formData.address,
            city: formData.city,
            region: formData.region,
            latitude: formData.latitude!,
            longitude: formData.longitude!,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            website: formData.website,
            socialLinks: formData.socialLinks
          });
          break;
          
        case 'ascoltatore':
        case 'radio':
        case 'scene':
        case 'angel':
          // Para tipos adicionais, atualizar as preferências do ouvinte
          await listenerService.updateListenerPreferences(userId, {
            genres: [formData.genrePrimary, ...formData.genresSecondary],
            listeningPreferences: {
              city: formData.city,
              latitude: formData.latitude,
              longitude: formData.longitude,
              userType: formData.userType
            }
          });
          break;
      }
      
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderUserTypeStep();
      case 1:
        return renderPersonalDataStep();
      case 2:
        return renderTerritoryStep();
      case 3:
        return renderContactsStep();
      default:
        return null;
    }
  };
  
  // Renderizar passo de seleção de tipo de usuário
  const renderUserTypeStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Scegli il tipo di account che desideri creare
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {USER_TYPES.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type.id}>
            <Paper
              elevation={formData.userType === type.id ? 8 : 2}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: formData.userType === type.id ? `2px solid ${type.color}` : '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => handleChange('userType', type.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h2" sx={{ mr: 2 }}>{type.icon}</Typography>
                <Typography variant="h6" color={formData.userType === type.id ? type.color : 'inherit'}>
                  {type.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {type.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {validationErrors.userType && (
        <FormHelperText error>{validationErrors.userType}</FormHelperText>
      )}
    </Box>
  );
  
  // Renderizar passo de dados pessoais
  const renderPersonalDataStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        I tuoi dati personali
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            fullWidth
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Conferma Password"
            type="password"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Nome"
            fullWidth
            required
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            error={!!validationErrors.nome}
            helperText={validationErrors.nome}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Cognome"
            fullWidth
            value={formData.cognome}
            onChange={(e) => handleChange('cognome', e.target.value)}
          />
        </Grid>
        
        {(formData.userType === 'artista' || formData.userType === 'scene') && (
          <Grid item xs={12} md={6}>
            <TextField
              label={formData.userType === 'artista' ? "Nome Artistico" : "Nome della Scena"}
              fullWidth
              required
              value={formData.nomeArtistico}
              onChange={(e) => handleChange('nomeArtistico', e.target.value)}
              error={!!validationErrors.nomeArtistico}
              helperText={validationErrors.nomeArtistico}
            />
          </Grid>
        )}
        
        {(formData.userType === 'professionista' || formData.userType === 'locale' || formData.userType === 'radio') && (
          <Grid item xs={12} md={6}>
            <TextField
              label={
                formData.userType === 'professionista' 
                  ? "Professione" 
                  : formData.userType === 'locale' 
                    ? "Tipo di Locale" 
                    : "Nome dell'Emittente"
              }
              fullWidth
              value={formData.profession || ''}
              onChange={(e) => handleChange('profession', e.target.value)}
            />
          </Grid>
        )}
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!validationErrors.genrePrimary}>
            <InputLabel>Genere Principale</InputLabel>
            <Select
              value={formData.genrePrimary}
              onChange={(e) => handleChange('genrePrimary', e.target.value)}
              label="Genere Principale"
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
            {validationErrors.genrePrimary && (
              <FormHelperText>{validationErrors.genrePrimary}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Generi Secondari</InputLabel>
            <Select
              multiple
              value={formData.genresSecondary}
              onChange={(e) => handleChange('genresSecondary', e.target.value)}
              input={<OutlinedInput label="Generi Secondari" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {GENRES.filter(genre => genre !== formData.genrePrimary).map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Biografia"
            multiline
            rows={4}
            fullWidth
            value={formData.biography}
            onChange={(e) => handleChange('biography', e.target.value)}
            placeholder={
              formData.userType === 'artista' 
                ? "Raccontaci di te e della tua musica..."
                : formData.userType === 'locale'
                  ? "Descrivi il tuo locale..."
                  : "Raccontaci di te..."
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
  
  // Renderizar passo de território
  const renderTerritoryStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Il tuo territorio musicale
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Seleziona la tua posizione sulla mappa per definire il tuo territorio musicale.
        Questo aiuterà gli altri utenti a trovarti e connettersi con te.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Città"
            fullWidth
            required
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={!!validationErrors.city}
            helperText={validationErrors.city}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Regione"
            fullWidth
            value={formData.region}
            onChange={(e) => handleChange('region', e.target.value)}
          />
        </Grid>
        
        {(formData.userType === 'locale' || formData.userType === 'professionista') && (
          <Grid item xs={12}>
            <TextField
              label="Indirizzo"
              fullWidth
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ mt: 2, border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
            <TerritorySelector
              initialLatitude={41.9028}
              initialLongitude={12.4964}
              onLocationSelect={handleLocationSelect}
              height="400px"
              showSearchBar={true}
            />
          </Box>
          {validationErrors.latitude && (
            <FormHelperText error>{validationErrors.latitude}</FormHelperText>
          )}
        </Grid>
      </Grid>
    </Box>
  );
  
  // Renderizar passo de contatos
  const renderContactsStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Contatti e Link Social
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email di Contatto"
            fullWidth
            value={formData.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            error={!!validationErrors.contactEmail}
            helperText={validationErrors.contactEmail}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Telefono"
            fullWidth
            value={formData.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Sito Web"
            fullWidth
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            error={!!validationErrors.website}
            helperText={validationErrors.website}
            placeholder="https://example.com"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Link Social
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Instagram"
            fullWidth
            value={formData.socialLinks.instagram || ''}
            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            placeholder="https://instagram.com/tuoprofilo"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Facebook"
            fullWidth
            value={formData.socialLinks.facebook || ''}
            onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
            placeholder="https://facebook.com/tuoprofilo"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="YouTube"
            fullWidth
            value={formData.socialLinks.youtube || ''}
            onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
            placeholder="https://youtube.com/c/tuocanale"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Spotify"
            fullWidth
            value={formData.socialLinks.spotify || ''}
            onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
            placeholder="https://open.spotify.com/artist/..."
          />
        </Grid>
        
        {(formData.userType === 'artista' || formData.userType === 'professionista') && (
          <Grid item xs={12} md={6}>
            <TextField
              label="SoundCloud"
              fullWidth
              value={formData.socialLinks.soundcloud || ''}
              onChange={(e) => handleSocialLinkChange('soundcloud', e.target.value)}
              placeholder="https://soundcloud.com/tuoprofilo"
            />
          </Grid>
        )}
        
        {formData.userType === 'professionista' && (
          <Grid item xs={12} md={6}>
            <TextField
              label="LinkedIn"
              fullWidth
              value={formData.socialLinks.linkedin || ''}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/tuoprofilo"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Registrati su SOUNDMAP
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {success ? (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Registrazione completata con successo! Verrai reindirizzato alla pagina di login.
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
            >
              Vai al Login
            </Button>
          </Box>
        ) : (
          <>
            {renderStepContent()}
            
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Indietro
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Registrazione in corso...' : 'Completa Registrazione'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Avanti
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RegistrazioneUnificata;
