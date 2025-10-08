import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Lock,
  Person,
  CloudSync,
  Security,
  Description,
  Email
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRequired = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = () => {
    // This will trigger the auth modal
    navigate('/');
  };

  const features = [
    {
      icon: <Person />,
      title: 'Personal Dashboard',
      description: 'Access your personal resume and cover letter dashboard'
    },
    {
      icon: <CloudSync />,
      title: 'Cloud Storage',
      description: 'Save and sync your documents across devices'
    },
    {
      icon: <Security />,
      title: 'Secure Access',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: <Description />,
      title: 'Multiple Resumes',
      description: 'Create and manage multiple resume versions'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4
        }}
      >
        <Lock sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Please sign in to access your resume and cover letter builder
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSignIn}
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          Sign In to Continue
        </Button>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Why Sign In?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Signing in gives you access to powerful features that help you create and manage professional resumes and cover letters.
            </Typography>
            
            <List>
              {features.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.title}
                    secondary={feature.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What You'll Get
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Unlimited Resumes" 
                    secondary="Create as many as you need"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cover Letters" 
                    secondary="AI-powered cover letter generation"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CloudSync color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto-Save" 
                    secondary="Never lose your work"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Secure Storage" 
                    secondary="Your data is safe with us"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthRequired;
