import React from 'react';
import { Container } from '@mui/material';
import Header from './home/Header';
import MainContent from './home/MainContent';
import Footer from './home/Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Container component="main" maxWidth={false} sx={{ my: 4, mt: 0 }}>
        <MainContent />
      </Container>
      <Footer />
    </div>
  );
};

export default App;
