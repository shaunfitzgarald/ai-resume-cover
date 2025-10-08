import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Container,
  Paper
} from '@mui/material';
import { 
  Description, 
  Email, 
  Psychology, 
  CloudUpload,
  Mic,
  Image,
  Description as PdfIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI-Powered Resume Builder',
      description: 'Create stunning, professional resumes with AI assistance',
      icon: <Description sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => navigate('/resume'),
      color: '#e3f2fd'
    },
    {
      title: 'Smart Cover Letter Generator',
      description: 'Write compelling cover letters tailored to specific jobs',
      icon: <Email sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: () => navigate('/cover-letter'),
      color: '#fce4ec'
    },
    {
      title: 'Multi-Modal Input',
      description: 'Upload PDFs, images, or use voice input to get started',
      icon: <CloudUpload sx={{ fontSize: 40, color: 'success.main' }} />,
      action: () => navigate('/resume'),
      color: '#e8f5e8'
    },
    {
      title: 'Intelligent Information Gathering',
      description: 'AI asks smart questions to complete your profile',
      icon: <Psychology sx={{ fontSize: 40, color: 'warning.main' }} />,
      action: () => navigate('/resume'),
      color: '#fff3e0'
    }
  ];

  const inputTypes = [
    { type: 'Text', icon: <Description />, description: 'Type or paste your information' },
    { type: 'PDF', icon: <PdfIcon />, description: 'Upload existing resume or documents' },
    { type: 'Image', icon: <Image />, description: 'Scan business cards or documents' },
    { type: 'Voice', icon: <Mic />, description: 'Speak your information naturally' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 6,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            AI Resume & Cover Letter Builder
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Create stunning, professional documents with the power of AI
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/resume')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Build Resume
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/cover-letter')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Write Cover Letter
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Powerful Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                className="feature-card"
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: feature.color,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={feature.action}
                    size="large"
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Input Types Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Multiple Ways to Get Started
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Choose how you want to provide your information
          </Typography>
          <Grid container spacing={3}>
            {inputTypes.map((input, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {input.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {input.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {input.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" color="primary.main" sx={{ mb: 2 }}>1</Typography>
                <Typography variant="h6" gutterBottom>Provide Information</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload documents, type information, or use voice input to get started
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" color="primary.main" sx={{ mb: 2 }}>2</Typography>
                <Typography variant="h6" gutterBottom>AI Processing</Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI analyzes your information and asks smart questions to complete your profile
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h2" color="primary.main" sx={{ mb: 2 }}>3</Typography>
                <Typography variant="h6" gutterBottom>Generate & Export</Typography>
                <Typography variant="body2" color="text.secondary">
                  Get your beautifully formatted resume or cover letter in multiple formats
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
