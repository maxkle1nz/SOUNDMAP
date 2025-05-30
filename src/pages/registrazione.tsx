import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import RegistrazioneArtista from './RegistrazioneArtista';
import RegistrazioneProfessionista from './RegistrazioneProfessionista';
import RegistrazioneLocale from './RegistrazioneLocale';
import RegistrazioneAscoltatore from './RegistrazioneAscoltatore';

// Componente principale per la registrazione
const RegistrazionePage = () => {
  const [tipoUtente, setTipoUtente] = useState('ascoltatore');
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setTipoUtente(newValue);
  };

  const renderFormRegistrazione = () => {
    switch (tipoUtente) {
      case 'artista':
        return <RegistrazioneArtista />;
      case 'professionista':
        return <RegistrazioneProfessionista />;
      case 'locale':
        return <RegistrazioneLocale />;
      case 'ascoltatore':
      default:
        return <RegistrazioneAscoltatore />;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Unisciti a SOUNDMAP
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Scegli il tipo di account che desideri creare
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tipoUtente}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="Tipo di registrazione"
        >
          <Tab label="Ascoltatore" value="ascoltatore" />
          <Tab label="Artista" value="artista" />
          <Tab label="Professionista" value="professionista" />
          <Tab label="Locale" value="locale" />
        </Tabs>
      </Box>

      {renderFormRegistrazione()}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Hai già un account?{' '}
          <Button
            variant="text"
            onClick={() => router.push('/login')}
            sx={{ textTransform: 'none' }}
          >
            Accedi
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegistrazionePage;
