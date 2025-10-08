import React, { useState } from 'react';
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
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send,
  Preview,
  Download,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import geminiService from '../services/geminiService';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import CoverLetterPreview from './CoverLetterPreview';
import CoverLetterForm from './CoverLetterForm';

const CoverLetterBuilder = ({ userData, setUserData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [coverLetterData, setCoverLetterData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    companyInfo: {
      companyName: '',
      position: '',
      hiringManager: '',
      jobDescription: ''
    },
    content: {
      opening: '',
      body: '',
      closing: ''
    },
    motivation: '',
    relevantExperience: [],
    skills: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hi! I'm here to help you write a compelling cover letter. Please provide the job description and any relevant information about the position you're applying for."
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();

  // Show message if not authenticated
  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to access the Cover Letter Builder
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You need to be signed in to create and manage cover letters.
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileUpload = async (files) => {
    setIsProcessing(true);
    try {
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
      const response = await geminiService.processCoverLetterInput(
        input, 
        coverLetterData.companyInfo.jobDescription, 
        coverLetterData
      );
      const parsedResponse = JSON.parse(response);
      
      // Update cover letter data with extracted information
      if (parsedResponse.extractedData) {
        setCoverLetterData(prev => ({
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

  const generateCoverLetter = async () => {
    setIsProcessing(true);
    try {
      const content = await geminiService.generateCoverLetterContent(
        coverLetterData, 
        coverLetterData.companyInfo.jobDescription
      );
      const parsedContent = JSON.parse(content);
      setCoverLetterData(prev => ({ 
        ...prev, 
        content: { ...prev.content, ...parsedContent }
      }));
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportCoverLetter = (format) => {
    console.log(`Exporting cover letter as ${format}`);
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
                    Upload Job Description
                  </Typography>
                  <FileUpload 
                    onUpload={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    multiple={false}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Job Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Job Description"
                    multiline
                    rows={4}
                    value={coverLetterData.companyInfo.jobDescription}
                    onChange={(e) => setCoverLetterData(prev => ({
                      ...prev,
                      companyInfo: {
                        ...prev.companyInfo,
                        jobDescription: e.target.value
                      }
                    }))}
                    placeholder="Paste the job description here..."
                    sx={{ mb: 2 }}
                  />
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
        <CoverLetterForm 
          data={coverLetterData}
          onChange={setCoverLetterData}
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
              Cover Letter Preview
            </Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={generateCoverLetter}
                disabled={isProcessing}
                sx={{ mr: 1 }}
              >
                {isProcessing ? <CircularProgress size={20} /> : 'Regenerate'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                onClick={() => exportCoverLetter('pdf')}
              >
                Export PDF
              </Button>
            </Box>
          </Box>
          
          <CoverLetterPreview 
            data={coverLetterData}
            template={selectedTemplate}
          />
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cover Letter Builder
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
            <Typography>Generating your cover letter...</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CoverLetterBuilder;
