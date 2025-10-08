import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Login, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Loading...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/auth-required" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
