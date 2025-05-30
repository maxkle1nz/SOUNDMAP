import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Tabs, Tab, TextField, Button, Chip, FormControl, InputLabel, Select, MenuItem, Dialog } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Place as PlaceIcon, Verified as VerifiedIcon } from '@mui/icons-material';
import '../styles.css';
import ProfessionaliList from '../components/ProfessionaliList';
import RegistrazioneProfessionistaThePath from '../components/RegistrazioneProfessionistaThePath';

// Componente principale per la sezione PROFESSIONALI
const ProfessionaliPage: React.FC = () => {
  // Stati per gestire filtri e visualizzazione
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(false);
  
  // Dati di esempio per i professionisti (da sostituire con dati reali da API/Supabase)
  const [professionisti, setProfessionisti] = useState<any[]>([
    {
      id: 1,
      nome: "Marco Rossi",
      ruolo: "Produttore",
      citta: "Milano",
      specialita: ["Mixing", "Mastering", "Produzione Elettronica"],
      verificato: true,
      rating: 4.8,
      bio: "Produttore con 10 anni di esperienza in musica elettronica e pop. Studio professionale nel centro di Milano.",
      immagine: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      nome: "Laura Bianchi",
      ruolo: "Manager",
      citta: "Roma",
      specialita: ["Booking", "Promozione", "Strategia Digitale"],
      verificato: true,
      rating: 4.5,
      bio: "Manager con esperienza internazionale. Ho lavorato con artisti di fama nazionale ed internazionale.",
      immagine: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      nome: "Giovanni Verdi",
      ruolo: "Tecnico Audio",
      citta: "Torino",
      specialita: ["Live Sound", "Registrazione", "Post-produzione"],
      verificato: false,
      rating: 4.2,
      bio: "Tecnico del suono specializzato in eventi live e registrazioni in studio.",
      immagine: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ]);
  
  // Categorie di professionisti per i tab
  const categorie = ["Tutti", "Produttori", "Manager", "Tecnici Audio", "PR & Marketing", "Legali", "Booking Agents", "Fotografi/Videomaker"];
  
  // Gestione cambio tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Filtraggio dei professionisti in base ai criteri selezionati
  const professionistiFiltrati = professionisti.filter(prof => {
    // Filtro per categoria
    if (activeTab > 0 && prof.ruolo !== categorie[activeTab]) {
      return false;
    }
    
    // Filtro per ricerca testuale
    if (searchTerm && !prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !prof.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro per città
    if (selectedCity && prof.citta !== selectedCity) {
      return false;
    }
    
    // Filtro per specialità
    if (selectedSpecialty && !prof.specialita.includes(selectedSpecialty)) {
      return false;
    }
    
    // Filtro per verifica
    if (onlyVerified && !prof.verificato) {
      return false;
    }
    
    return true;
  });

  // Gestione del pulsante di registrazione
  const handleRegistrationClick = () => {
    setShowRegistrationForm(true);
  };
  
  // Chiusura del form di registrazione
  const handleCloseRegistration = () => {
    setShowRegistrationForm(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* T - Titolo e Territorio */}
      <Box className="thepath-header" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Box className="icon-container" sx={{ mr: 2 }}>
          <FilterListIcon sx={{ fontSize: 48, color: '#8C65F7' }} />
        </Box>
        <Box className="title-container">
          <Typography variant="h4" component="h1" className="section-title" sx={{ fontWeight: 'bold' }}>
            PROFESSIONALI
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle" sx={{ color: '#E0E0E0' }}>
            Scopri i professionisti dell'industria musicale nel tuo territorio
          </Typography>
        </Box>
        <Box className="territory-indicator" sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <PlaceIcon sx={{ mr: 1, color: '#8C65F7' }} />
          <Typography variant="body2">
            Stai esplorando: <strong>Italia</strong>
          </Typography>
        </Box>
      </Box>
      
      {/* H - Header di Navigazione */}
      <Box className="thepath-navigation" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { color: '#E0E0E0' },
              '& .Mui-selected': { color: '#FFFFFF', backgroundColor: '#8C65F7', borderRadius: '4px' }
            }}
          >
            {categorie.map((categoria, index) => (
              <Tab key={index} label={categoria} />
            ))}
          </Tabs>
          
          <Button 
            variant="contained" 
            onClick={handleRegistrationClick}
            sx={{ 
              backgroundColor: '#8C65F7',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: '#7550e3'
              }
            }}
          >
            Registrati come Professionista
          </Button>
        </Box>
        
        <Box className="filters-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Cerca professionisti..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#8C65F7' }} />,
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel>Città</InputLabel>
            <Select
              value={selectedCity}
              label="Città"
              onChange={(e) => setSelectedCity(e.target.value as string)}
            >
              <MenuItem value="">Tutte</MenuItem>
              <MenuItem value="Milano">Milano</MenuItem>
              <MenuItem value="Roma">Roma</MenuItem>
              <MenuItem value="Torino">Torino</MenuItem>
              <MenuItem value="Napoli">Napoli</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel>Specialità</InputLabel>
            <Select
              value={selectedSpecialty}
              label="Specialità"
              onChange={(e) => setSelectedSpecialty(e.target.value as string)}
            >
              <MenuItem value="">Tutte</MenuItem>
              <MenuItem value="Mixing">Mixing</MenuItem>
              <MenuItem value="Mastering">Mastering</MenuItem>
              <MenuItem value="Booking">Booking</MenuItem>
              <MenuItem value="Live Sound">Live Sound</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setOnlyVerified(!onlyVerified)}
            startIcon={<VerifiedIcon />}
            sx={{ 
              borderColor: onlyVerified ? '#8C65F7' : '#4D5A6B',
              backgroundColor: onlyVerified ? 'rgba(140, 101, 247, 0.1)' : 'transparent'
            }}
          >
            Solo Verificati
          </Button>
          
          <Typography variant="body2" sx={{ ml: 'auto' }}>
            {professionistiFiltrati.length} risultati trovati
          </Typography>
        </Box>
      </Box>
      
      {/* E - Elenco Entità */}
      <ProfessionaliList professionisti={professionistiFiltrati} />
      
      {/* T - Transizione e Tornare */}
      <Box className="thepath-navigation-footer" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box className="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            component="a" 
            href="/mappa" 
            className="breadcrumb-item" 
            sx={{ color: '#E0E0E0', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}
          >
            Mappa
          </Typography>
          <Typography sx={{ mx: 1, color: '#8C65F7' }}>&gt;</Typography>
          <Typography 
            className="breadcrumb-item active" 
            sx={{ color: '#FFFFFF' }}
          >
            Professionali
          </Typography>
        </Box>
        
        <Button 
          className="return-button"
          startIcon={<PlaceIcon />}
          sx={{ 
            backgroundColor: '#8C65F7',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#7550e3'
            }
          }}
        >
          Torna alla mappa
        </Button>
      </Box>
      
      {/* H - Helping System */}
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
          Filtra per città e specialità per trovare i professionisti più vicini a te e alle tue esigenze. 
          I professionisti con il badge di verifica <VerifiedIcon sx={{ color: '#8C65F7', fontSize: 16, verticalAlign: 'middle' }} /> 
          hanno confermato le loro credenziali e competenze.
        </Typography>
      </Box>
      
      {/* Dialog per il form di registrazione */}
      <Dialog 
        open={showRegistrationForm} 
        onClose={handleCloseRegistration}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: '#1E2A3B',
            color: '#FFFFFF'
          }
        }}
      >
        <RegistrazioneProfessionistaThePath />
      </Dialog>
    </Container>
  );
};

export default ProfessionaliPage;
