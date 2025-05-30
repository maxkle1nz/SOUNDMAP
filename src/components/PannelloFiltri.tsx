import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Grid, Paper, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { api } from '../services/supabase-integration';

const PannelloFiltri = () => {
  const [tipoEntita, setTipoEntita] = useState('');
  const [genereMusicale, setGenereMusicale] = useState('');
  const [citta, setCitta] = useState('');
  const [raggioKm, setRaggioKm] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [risultati, setRisultati] = useState([]);

  const generiMusicali = [
    'Rock', 'Pop', 'Hip Hop', 'Rap', 'Elettronica', 'Jazz', 'Blues', 
    'Metal', 'Folk', 'Classica', 'R&B', 'Soul', 'Reggae', 'Country', 
    'Indie', 'Alternative', 'Punk', 'Funk', 'Disco', 'Techno', 'House'
  ];

  const cittaPrincipali = [
    'Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Firenze', 
    'Venezia', 'Genova', 'Bari', 'Palermo', 'Catania', 'Verona'
  ];

  const handleTipoEntitaChange = (event, newTipoEntita) => {
    setTipoEntita(newTipoEntita);
  };

  const handleRaggioChange = (event) => {
    setRaggioKm(event.target.value === '' ? 10 : Number(event.target.value));
  };

  const handleReset = () => {
    setTipoEntita('');
    setGenereMusicale('');
    setCitta('');
    setRaggioKm(10);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const filters = {
        tipo_entita: tipoEntita || null,
        genere_musicale: genereMusicale || null,
        citta: citta || null,
        raggio_km: raggioKm,
        // Nella versione reale, questi valori verrebbero dalla posizione dell'utente o dalla mappa
        lat: 45.4642, // Milano come esempio
        lng: 9.1900
      };

      const { data, error } = await api.getMapEntities(filters);
      
      if (error) {
        throw error;
      }

      setRisultati(data || []);
    } catch (err) {
      console.error('Errore durante la ricerca:', err);
      setError(err.message || 'Errore durante la ricerca. Riprova più tardi.');
      setRisultati([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Filtri Mappa
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Tipo di Entità
          </Typography>
          <ToggleButtonGroup
            value={tipoEntita}
            exclusive
            onChange={handleTipoEntitaChange}
            aria-label="tipo entità"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="artista" aria-label="artista">
              Artisti
            </ToggleButton>
            <ToggleButton value="professionista" aria-label="professionista">
              Professionisti
            </ToggleButton>
            <ToggleButton value="locale" aria-label="locale">
              Locali
            </ToggleButton>
            <ToggleButton value="scena" aria-label="scena">
              Scene
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Genere Musicale</InputLabel>
            <Select
              value={genereMusicale}
              onChange={(e) => setGenereMusicale(e.target.value)}
              label="Genere Musicale"
            >
              <MenuItem value="">
                <em>Tutti i generi</em>
              </MenuItem>
              {generiMusicali.map((genere) => (
                <MenuItem key={genere} value={genere}>
                  {genere}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Città</InputLabel>
            <Select
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              label="Città"
            >
              <MenuItem value="">
                <em>Tutte le città</em>
              </MenuItem>
              {cittaPrincipali.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Raggio di ricerca (km)
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={raggioKm}
            onChange={handleRaggioChange}
            inputProps={{
              min: 1,
              max: 100,
              step: 1,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Ricerca in corso...' : 'Cerca sulla Mappa'}
          </Button>
        </Grid>
      </Grid>
      
      {risultati.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Risultati ({risultati.length})
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {risultati.map((item) => (
              <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle1">
                  {item.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipo: {item.tipo_entita}
                </Typography>
                {item.dettagli.citta && (
                  <Typography variant="body2">
                    Città: {item.dettagli.citta}
                  </Typography>
                )}
                {item.dettagli.generi && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {Array.isArray(item.dettagli.generi) && item.dettagli.generi.map((genere) => (
                      <Chip key={genere} label={genere} size="small" />
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PannelloFiltri;
