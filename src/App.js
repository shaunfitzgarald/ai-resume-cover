import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Home, Description, Email } from '@mui/icons-material';
import HomePage from './components/HomePage';
import ResumeBuilder from './components/ResumeBuilder';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Resume & Cover Letter Builder
          </Typography>
          <Button color="inherit" href="/">
            <Home sx={{ mr: 1 }} />
            Home
          </Button>
          <Button color="inherit" href="/resume">
            <Description sx={{ mr: 1 }} />
            Resume
          </Button>
          <Button color="inherit" href="/cover-letter">
            <Email sx={{ mr: 1 }} />
            Cover Letter
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage userData={userData} setUserData={setUserData} />} />
          <Route path="/resume" element={<ResumeBuilder userData={userData} setUserData={setUserData} />} />
          <Route path="/cover-letter" element={<CoverLetterBuilder userData={userData} setUserData={setUserData} />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
