import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Home, Description, Email, AccountCircle, Login, Logout } from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import ResumeBuilder from './components/ResumeBuilder';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import AuthModal from './components/AuthModal';
import './App.css';

function AppContent() {
  const [userData, setUserData] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, userProfile, signOut } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleMenuClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

          {user ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar 
                  src={userProfile?.photoURL} 
                  sx={{ width: 32, height: 32 }}
                >
                  {userProfile?.displayName?.charAt(0) || user.email?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {userProfile?.displayName || user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                  <Logout sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => setAuthModalOpen(true)}
              sx={{ ml: 2 }}
            >
              <Login sx={{ mr: 1 }} />
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage userData={userData} setUserData={setUserData} />} />
          <Route path="/resume" element={<ResumeBuilder userData={userData} setUserData={setUserData} />} />
          <Route path="/cover-letter" element={<CoverLetterBuilder userData={userData} setUserData={setUserData} />} />
        </Routes>
      </Container>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
