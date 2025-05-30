import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Paper, Grid, Card, CardContent, CardMedia, CardActionArea, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import MappaInterattiva from './MappaInterattiva';
import RegistrazioneArtista from './RegistrazioneArtista';
import RegistrazioneProfessionista from './RegistrazioneProfessionista';
import RegistrazioneLocale from './RegistrazioneLocale';
import RegistrazioneAscoltatore from './RegistrazioneAscoltatore';
import PannelloFiltri from './PannelloFiltri';
import RegistrazioneSelezione from '../pages/registrazione-selezione';

// Importação lazy da página de registro unificada
const RegistrazioneUnificataPage = lazy(() => import('../pages/registrazione-unificata'));

// Componente para o cabeçalho e navegação
const Header = ({ isLoggedIn }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          SOUNDMAP
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigation('/')}>
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary="Mappa Musicale" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/scene')}>
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Scene Musicali" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/artisti')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Artisti" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/eventi')}>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Eventi" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {!isLoggedIn ? (
          <>
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Accedi" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/registrazione-selezione')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Registrati" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={() => handleNavigation('/profilo')}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Il Mio Profilo" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              SOUNDMAP
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/">Mappa</Button>
            <Button color="inherit" component={Link} to="/scene">Scene</Button>
            <Button color="inherit" component={Link} to="/artisti">Artisti</Button>
            <Button color="inherit" component={Link} to="/eventi">Eventi</Button>
            {!isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/login">Accedi</Button>
                <Button color="inherit" component={Link} to="/registrazione-selezione">Registrati</Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/profilo">Profilo</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

// Componente para o rodapé
const Footer = () => (
  <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
    <Container maxWidth="lg">
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} SOUNDMAP - Tutti i diritti riservati
      </Typography>
    </Container>
  </Box>
);

// Layout principal
const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isLoggedIn={isLoggedIn} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

// Componentes de página
const HomePage = () => (
  <Box sx={{ height: 'calc(100vh - 64px)' }}>
    <MappaInterattiva />
  </Box>
);

const ScenePage = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Scene Musicali
    </Typography>
    <Grid container spacing={3}>
      {['Milano Underground', 'Roma Indie', 'Napoli Urban'].map((scena) => (
        <Grid item xs={12} sm={6} md={4} key={scena}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/300x200?music,${scena}`}
                alt={scena}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {scena}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esplora la scena musicale di {scena.split(' ')[0]} e scopri nuovi artisti, eventi e locali.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const ArtistiPage = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Artisti
    </Typography>
    <Grid container spacing={3}>
      {['DJ Soundwave', 'The Echoes', 'Luna Blu', 'Elettro Shock', 'Melodia Pura'].map((artista) => (
        <Grid item xs={12} sm={6} md={4} key={artista}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/300x200?musician,${artista}`}
                alt={artista}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {artista}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ascolta i brani di {artista} e scopri i prossimi eventi.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const EventiPage = () => (
  <Container sx={{ py: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Eventi
    </Typography>
    <Grid container spacing={3}>
      {['Festival Estate', 'Notte Rock', 'Jazz Club Live', 'Techno Party', 'Concerto Indie'].map((evento) => (
        <Grid item xs={12} sm={6} md={4} key={evento}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/300x200?concert,${evento}`}
                alt={evento}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {evento}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString()} - Partecipa a {evento} e vivi un'esperienza musicale unica.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

const LoginPage = () => (
  <Container sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Accedi
      </Typography>
      {/* Form di login */}
    </Paper>
  </Container>
);

const NotFoundPage = () => (
  <Container sx={{ py: 4, textAlign: 'center' }}>
    <Typography variant="h1" component="h1" gutterBottom>
      404
    </Typography>
    <Typography variant="h4" component="h2" gutterBottom>
      Pagina non trovata
    </Typography>
    <Typography variant="body1" paragraph>
      La pagina che stai cercando non esiste o è stata spostata.
    </Typography>
    <Button variant="contained" component={Link} to="/">
      Torna alla Home
    </Button>
  </Container>
);

// Componente principal App com rotas simplificadas
export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/scene" element={<Layout><ScenePage /></Layout>} />
        <Route path="/artisti" element={<Layout><ArtistiPage /></Layout>} />
        <Route path="/eventi" element={<Layout><EventiPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/registrazione-selezione" element={<Layout><RegistrazioneSelezione /></Layout>} />
        <Route path="/registrazione/artista" element={<Layout><Container sx={{ py: 4 }}><RegistrazioneArtista /></Container></Layout>} />
        <Route path="/registrazione/professionista" element={<Layout><Container sx={{ py: 4 }}><RegistrazioneProfessionista /></Container></Layout>} />
        <Route path="/registrazione/locale" element={<Layout><Container sx={{ py: 4 }}><RegistrazioneLocale /></Container></Layout>} />
        <Route path="/registrazione/ascoltatore" element={<Layout><Container sx={{ py: 4 }}><RegistrazioneAscoltatore /></Container></Layout>} />
        {/* Nova rota para o registro unificado */}
        <Route path="/registrazione" element={<Layout><Container sx={{ py: 4 }}><Suspense fallback={<div>Caricamento...</div>}>
          <RegistrazioneUnificataPage />
        </Suspense></Container></Layout>} />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
