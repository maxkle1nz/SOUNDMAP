import React from 'react';
import { Container } from '@mui/material';
import RegistrazioneUnificata from '../components/RegistrazioneUnificata';

const RegistrazioneUnificataPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <RegistrazioneUnificata />
    </Container>
  );
};

export default RegistrazioneUnificataPage;
