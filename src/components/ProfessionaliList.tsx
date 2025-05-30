import React from 'react';
import { Box, Typography, Grid, Button, Chip } from '@mui/material';
import { VerifiedIcon } from '@mui/icons-material/Verified';

interface Professionista {
  id: number;
  nome: string;
  ruolo: string;
  citta: string;
  specialita: string[];
  verificato: boolean;
  rating: number;
  bio: string;
  immagine: string;
}

interface ProfessionaliListProps {
  professionisti: Professionista[];
}

const ProfessionaliList: React.FC<ProfessionaliListProps> = ({ professionisti }) => {
  return (
    <Box className="thepath-entities-list" sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {professionisti.map((professionista) => (
          <Grid item xs={12} sm={6} md={4} key={professionista.id}>
            <Box 
              className="entity-card" 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: '#2D3A4B',
                border: '1px solid #3D4A5B',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  borderColor: '#8C65F7',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box 
                  className="entity-image" 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    mr: 2,
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={professionista.immagine} 
                    alt={professionista.nome} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                
                <Box className="entity-info" sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="h6" className="entity-name" sx={{ fontWeight: 600, mr: 1 }}>
                      {professionista.nome}
                    </Typography>
                    {professionista.verificato && (
                      <VerifiedIcon sx={{ color: '#8C65F7', fontSize: 18 }} />
                    )}
                  </Box>
                  
                  <Box className="entity-metadata" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      {professionista.ruolo} • {professionista.citta}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {professionista.specialita.slice(0, 2).map((spec: string, i: number) => (
                      <Chip 
                        key={i} 
                        label={spec} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#1E2A3B', 
                          borderColor: '#4D5A6B',
                          color: '#E0E0E0',
                          fontSize: '0.75rem'
                        }} 
                      />
                    ))}
                    {professionista.specialita.length > 2 && (
                      <Chip 
                        label={`+${professionista.specialita.length - 2}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#1E2A3B', 
                          borderColor: '#4D5A6B',
                          color: '#E0E0E0',
                          fontSize: '0.75rem'
                        }} 
                      />
                    )}
                  </Box>
                  
                  <Box className="entity-stats" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      {'★'.repeat(Math.round(professionista.rating))}
                      <span style={{ marginLeft: '4px', color: '#B0B0B0' }}>
                        ({professionista.rating})
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Typography 
                className="entity-description" 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  flexGrow: 1
                }}
              >
                {professionista.bio}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  className="action-button primary"
                  sx={{ 
                    backgroundColor: '#8C65F7',
                    '&:hover': {
                      backgroundColor: '#7550e3'
                    }
                  }}
                >
                  Visualizza Profilo
                </Button>
                
                <Button 
                  variant="outlined" 
                  className="action-button secondary"
                  sx={{ 
                    borderColor: '#4D5A6B',
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#8C65F7',
                      backgroundColor: 'rgba(140, 101, 247, 0.1)'
                    }
                  }}
                >
                  Contatta
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfessionaliList;
