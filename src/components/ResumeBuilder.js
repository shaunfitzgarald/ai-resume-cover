import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  Mic,
  MicOff,
  Send,
  Preview,
  Download,
  Refresh
} from '@mui/icons-material';
import geminiService from '../services/geminiService';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import ResumePreview from './ResumePreview';
import ResumeForm from './ResumeForm';

const ResumeBuilder = ({ userData, setUserData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hi! I'm here to help you build an amazing resume. You can start by uploading a document, typing information, or using voice input. What would you like to do first?"
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = async (files) => {
    setIsProcessing(true);
    try {
      // Process uploaded files
      for (const file of files) {
        const text = await extractTextFromFile(file);
        await processInput(text);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, I had trouble processing that file. Could you try again or provide the information in a different format?'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromFile = async (file) => {
    // This would integrate with a PDF/text extraction service
    // For now, we'll simulate it
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  };

  const processInput = async (input) => {
    try {
      const response = await geminiService.processResumeInput(input, resumeData);
      const parsedResponse = JSON.parse(response);
      
      // Update resume data with extracted information
      if (parsedResponse.extractedData) {
        setResumeData(prev => ({
          ...prev,
          ...parsedResponse.extractedData
        }));
      }

      // Add AI response to chat
      setMessages(prev => [...prev, {
        type: 'ai',
        content: parsedResponse.questions ? 
          parsedResponse.questions.join('\n\n') : 
          'I\'ve processed your information. Is there anything else you\'d like to add?'
      }]);
    } catch (error) {
      console.error('Error processing input:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'I had trouble processing that information. Could you try rephrasing it?'
      }]);
    }
  };

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    await processInput(message);
  };

  const handleVoiceInput = async () => {
    // Voice input implementation would go here
    // For now, we'll simulate it
    const mockVoiceText = "My name is John Doe, I'm a software engineer with 5 years of experience in React and Node.js";
    await processInput(mockVoiceText);
  };

  const generateResume = async () => {
    setIsProcessing(true);
    try {
      const content = await geminiService.generateResumeContent(resumeData, selectedTemplate);
      const parsedContent = JSON.parse(content);
      setResumeData(prev => ({ ...prev, ...parsedContent }));
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportResume = (format) => {
    // Export functionality would go here
    console.log(`Exporting resume as ${format}`);
  };

  const tabContent = [
    {
      label: 'Input',
      content: (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upload Documents
                  </Typography>
                  <FileUpload 
                    onUpload={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    multiple
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Voice Input
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <IconButton 
                      color="primary" 
                      onClick={handleVoiceInput}
                      disabled={isProcessing}
                    >
                      <Mic />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      Click to start recording your information
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box mt={3}>
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </Box>
        </Box>
      )
    },
    {
      label: 'Form',
      content: (
        <ResumeForm 
          data={resumeData}
          onChange={setResumeData}
        />
      )
    },
    {
      label: 'Templates',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Choose a Template
          </Typography>
          <Grid container spacing={2}>
            {['professional', 'modern', 'creative', 'minimal'].map((template) => (
              <Grid item xs={12} sm={6} md={3} key={template}>
                <Card 
                  className={`template-card ${selectedTemplate === template ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {template.charAt(0).toUpperCase() + template.slice(1)}
                    </Typography>
                    <Box 
                      sx={{ 
                        height: 200, 
                        bgcolor: 'grey.100', 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Preview
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      label: 'Preview',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Resume Preview
            </Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={generateResume}
                disabled={isProcessing}
                sx={{ mr: 1 }}
              >
                {isProcessing ? <CircularProgress size={20} /> : 'Regenerate'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={() => exportResume('pdf')}
              >
                Export PDF
              </Button>
            </Box>
          </Box>
          
          <ResumePreview 
            data={resumeData}
            template={selectedTemplate}
          />
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resume Builder
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          {tabContent.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ p: 2 }}>
        {tabContent[activeTab].content}
      </Box>

      {isProcessing && (
        <Box 
          position="fixed" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          bgcolor="rgba(0,0,0,0.5)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          zIndex={9999}
        >
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Processing your information...</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ResumeBuilder;
