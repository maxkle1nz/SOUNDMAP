import React, { useState } from 'react';
import { 
  Box, Typography, Container, Grid, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, FormGroup,
  FormControlLabel, Checkbox, Paper, Divider, Stepper,
  Step, StepLabel, FormHelperText, Chip, IconButton
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import '../styles.css';

// Componente per la registrazione dei professionisti
const RegistrazioneProfessionista: React.FC = () => {
  // Stati per gestire il form multi-step
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    // Dati personali
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    citta: '',
    biografia: '',
    
    // Dati professionali
    ruoli: [] as string[],
    specializzazioni: [] as string[],
    generiMusicali: [] as string[],
    anniEsperienza: '',
    
    // Servizi e tariffe
    servizi: [{ nome: '', descrizione: '', tariffa: '' }],
    
    // Social e contatti
    instagram: '',
    website: '',
    linkedin: '',
    
    // Accettazione termini
    accettaTermini: false,
    accettaPrivacy: false
  });
  
  // Opzioni per i ruoli professionali
  const ruoliOptions = [
    'Produttore', 'DJ', 'Manager', 'Tecnico Audio', 'Tecnico Luci',
    'PR & Marketing', 'Legale', 'Booking Agent', 'Fotografo', 'Videomaker',
    'Grafico', 'Web Designer', 'Social Media Manager', 'Stylist', 'Giornalista'
  ];
  
  // Opzioni per le specializzazioni
  const specializzazioniOptions = [
    'Mixing', 'Mastering', 'Produzione Elettronica', 'Produzione Pop',
    'Produzione Hip-Hop', 'Produzione Rock', 'Live Sound', 'Studio Recording',
    'Post-produzione', 'Sound Design', 'Booking Nazionale', 'Booking Internazionale',
    'Diritto d\'autore', 'Contrattualistica', 'Promozione Radio', 'Promozione Digitale',
    'Ufficio Stampa', 'Tour Management', 'Artist Development', 'Distribuzione'
  ];
  
  // Opzioni per i generi musicali
  const generiMusicaliOptions = [
    'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Elettronica', 'Dance', 'Techno',
    'House', 'Jazz', 'Blues', 'Folk', 'Country', 'Metal', 'Punk',
    'Classica', 'Indie', 'Alternative', 'Reggae', 'Funk', 'Soul',
    'Disco', 'Ambient', 'Trap', 'Drill', 'Afrobeat', 'Latin'
  ];
  
  // Gestione del cambio step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Gestione del cambio dati nel form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Gestione delle checkbox
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  // Gestione delle selezioni multiple
  const handleMultiSelectChange = (name: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      [name]: event.target.value as string[]
    });
  };
  
  // Gestione dei servizi (aggiunta/rimozione)
  const handleAddServizio = () => {
    setFormData({
      ...formData,
      servizi: [...formData.servizi, { nome: '', descrizione: '', tariffa: '' }]
    });
  };
  
  const handleRemoveServizio = (index: number) => {
    const newServizi = [...formData.servizi];
    newServizi.splice(index, 1);
    setFormData({
      ...formData,
      servizi: newServizi
    });
  };
  
  const handleServizioChange = (index: number, field: string, value: string) => {
    const newServizi = [...formData.servizi];
    newServizi[index] = {
      ...newServizi[index],
      [field]: value
    };
    setFormData({
      ...formData,
      servizi: newServizi
    });
  };
  
  // Gestione dell'invio del form
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Qui andrebbe l'integrazione con Supabase per salvare i dati
    console.log('Form inviato:', formData);
    // Simulazione di successo
    setActiveStep(4);
  };
  
  // Passi del form
  const steps = ['Informazioni Personali', 'Profilo Professionale', 'Servizi e Tariffe', 'Conferma'];
  
  // Contenuto dei vari step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Informazioni Personali</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Cognome"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Città</InputLabel>
                  <Select
                    name="citta"
                    value={formData.citta}
                    onChange={handleChange}
                    label="Città"
                  >
                    <MenuItem value="Milano">Milano</MenuItem>
                    <MenuItem value="Roma">Roma</MenuItem>
                    <MenuItem value="Napoli">Napoli</MenuItem>
                    <MenuItem value="Torino">Torino</MenuItem>
                    <MenuItem value="Bologna">Bologna</MenuItem>
                    <MenuItem value="Firenze">Firenze</MenuItem>
                    <MenuItem value="Palermo">Palermo</MenuItem>
                    <MenuItem value="Bari">Bari</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Biografia"
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                  placeholder="Descrivi la tua esperienza professionale, competenze e stile di lavoro..."
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Profilo Professionale</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Ruoli Professionali</InputLabel>
                  <Select
                    multiple
                    name="ruoli"
                    value={formData.ruoli}
                    onChange={handleMultiSelectChange('ruoli')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {ruoliOptions.map((ruolo) => (
                      <MenuItem key={ruolo} value={ruolo}>
                        <Checkbox checked={formData.ruoli.indexOf(ruolo) > -1} />
                        {ruolo}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleziona tutti i ruoli che ricopri</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Specializzazioni</InputLabel>
                  <Select
                    multiple
                    name="specializzazioni"
                    value={formData.specializzazioni}
                    onChange={handleMultiSelectChange('specializzazioni')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {specializzazioniOptions.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        <Checkbox checked={formData.specializzazioni.indexOf(spec) > -1} />
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleziona le tue specializzazioni</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Generi Musicali</InputLabel>
                  <Select
                    multiple
                    name="generiMusicali"
                    value={formData.generiMusicali}
                    onChange={handleMultiSelectChange('generiMusicali')}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {generiMusicaliOptions.map((genere) => (
                      <MenuItem key={genere} value={genere}>
                        <Checkbox checked={formData.generiMusicali.indexOf(genere) > -1} />
                        {genere}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Seleziona i generi musicali con cui lavori</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Anni di Esperienza"
                  name="anniEsperienza"
                  type="number"
                  value={formData.anniEsperienza}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0, max: 50 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Carica Portfolio
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    Carica esempi del tuo lavoro (opzionale)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Servizi e Tariffe</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Aggiungi i servizi che offri e le relative tariffe (opzionale)
            </Typography>
            
            {formData.servizi.map((servizio, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => handleRemoveServizio(index)}
                  disabled={formData.servizi.length === 1}
                >
                  <CloseIcon />
                </IconButton>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Servizio"
                      value={servizio.nome}
                      onChange={(e) => handleServizioChange(index, 'nome', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tariffa (€)"
                      value={servizio.tariffa}
                      onChange={(e) => handleServizioChange(index, 'tariffa', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Descrizione"
                      value={servizio.descrizione}
                      onChange={(e) => handleServizioChange(index, 'descrizione', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddServizio}
              sx={{ mt: 1 }}
            >
              Aggiungi Servizio
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2 }}>Social e Contatti</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="www.example.com"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Conferma Registrazione</Typography>
            
            <Paper sx={{ p: 3, mb: 3, backgroundColor: '#2D3A4B' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Riepilogo Dati
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Nome:</Typography>
                  <Typography variant="body1">{formData.nome} {formData.cognome}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Email:</Typography>
                  <Typography variant="body1">{formData.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Telefono:</Typography>
                  <Typography variant="body1">{formData.telefono || 'Non specificato'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Città:</Typography>
                  <Typography variant="body1">{formData.citta}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Ruoli:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.ruoli.map((ruolo) => (
                      <Chip key={ruolo} label={ruolo} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Specializzazioni:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.specializzazioni.map((spec) => (
                      <Chip key={spec} label={spec} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Generi Musicali:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.generiMusicali.map((genere) => (
                      <Chip key={genere} label={genere} size="small" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.accettaTermini}
                    onChange={handleCheckboxChange}
                    name="accettaTermini"
                    required
                  />
                }
                label="Accetto i Termini e Condizioni di SOUNDMAP"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.accettaPrivacy}
                    onChange={handleCheckboxChange}
                    name="accettaPrivacy"
                    required
                  />
                }
                label="Accetto la Privacy Policy di SOUNDMAP"
              />
            </FormGroup>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ color: '#8C65F7', mb: 2 }}>
              Registrazione Completata!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Grazie per esserti registrato come professionista su SOUNDMAP.
              Il tuo profilo è stato creato con successo.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#8C65F7',
                '&:hover': {
                  backgroundColor: '#7550e3'
                }
              }}
            >
              Vai al tuo Profilo
            </Button>
          </Box>
        );
      default:
        return 'Passo sconosciuto';
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* T - Titolo e Territorio */}
      <Box className="thepath-header" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Box className="icon-container" sx={{ mr: 2 }}>
          <PersonIcon sx={{ fontSize: 48, color: '#8C65F7' }} />
        </Box>
        <Box className="title-container">
          <Typography variant="h4" component="h1" className="section-title" sx={{ fontWeight: 'bold' }}>
            Registrazione Professionista
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle" sx={{ color: '#E0E0E0' }}>
            Entra a far parte della community di professionisti di SOUNDMAP
          </Typography>
        </Box>
      </Box>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Form content */}
      <Paper sx={{ p: 3, backgroundColor: '#2D3A4B', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || activeStep === 4}
              onClick={handleBack}
              sx={{ color: '#E0E0E0' }}
            >
              Indietro
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ 
                    backgroundColor: '#8C65F7',
                    '&:hover': {
                      backgroundColor: '#7550e3'
                    }
                  }}
                >
                  Completa Registrazione
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    backgroundColor: '#8C65F7',
                    '&:hover': {
                      backgroundColor: '#7550e3'
                    }
                  }}
                >
                  Avanti
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
      
      {/* H - Helping System */}
      {activeStep < 4 && (
        <Box className="thepath-helping-system" sx={{ mt: 4, p: 2, backgroundColor: '#2D3A4B', borderRadius: 2, borderLeft: '4px solid #8C65F7' }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '20px', 
              height: '20px', 
              borderRadius: '50%', 
              backgroundColor: '#8C65F7',
              marginRight: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>?</span>
            Suggerimento
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {activeStep === 0 && "Inserisci informazioni accurate per aumentare la visibilità del tuo profilo. La tua città è importante per la visualizzazione territoriale."}
            {activeStep === 1 && "Seleziona tutti i ruoli e le specializzazioni pertinenti. Più dettagli fornisci, più facilmente verrai trovato dagli artisti."}
            {activeStep === 2 && "Specificare i tuoi servizi e le tariffe aiuta gli artisti a capire meglio la tua offerta professionale."}
            {activeStep === 3 && "Verifica che tutte le informazioni siano corrette prima di completare la registrazione."}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RegistrazioneProfessionista;
