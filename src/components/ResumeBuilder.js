import React, { useState, useRef, useEffect } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  CloudUpload,
  Mic,
  MicOff,
  Send,
  Preview,
  Download,
  Refresh,
  Save,
  FolderOpen,
  Add
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import geminiService from '../services/geminiService';
import databaseService from '../services/databaseService';
import FileUpload from './FileUpload';
import ChatInterface from './ChatInterface';
import ResumePreview from './ResumePreview';
import ResumeForm from './ResumeForm';
import ResumeManager from './ResumeManager';

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
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeName, setResumeName] = useState('Untitled Resume');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { user } = useAuth();

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && user) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 5000); // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [resumeData, hasUnsavedChanges, user]);

  // Show message if not authenticated (shouldn't happen due to ProtectedRoute, but just in case)
  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to access the Resume Builder
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You need to be signed in to create and manage resumes.
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResumeDataChange = (newData) => {
    setResumeData(newData);
    setHasUnsavedChanges(true);
  };

  const handleAutoSave = async () => {
    if (!user || !hasUnsavedChanges) return;

    try {
      await databaseService.saveResume(user.uid, {
        ...resumeData,
        name: resumeName,
        template: selectedTemplate,
        lastModified: new Date().toISOString()
      }, currentResumeId);
      
      setHasUnsavedChanges(false);
      setSnackbarMessage('Auto-saved');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleSaveResume = async () => {
    if (!user) {
      setSnackbarMessage('Please sign in to save resumes');
      setSnackbarOpen(true);
      return;
    }

    try {
      setIsProcessing(true);
      const resumeId = await databaseService.saveResume(user.uid, {
        ...resumeData,
        name: resumeName,
        template: selectedTemplate,
        lastModified: new Date().toISOString()
      }, currentResumeId);
      
      setCurrentResumeId(resumeId);
      setHasUnsavedChanges(false);
      setSnackbarMessage('Resume saved successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSnackbarMessage('Failed to save resume');
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadResume = (resume) => {
    setResumeData({
      personalInfo: resume.personalInfo || {},
      summary: resume.summary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      certifications: resume.certifications || [],
      projects: resume.projects || []
    });
    setResumeName(resume.name || 'Untitled Resume');
    setSelectedTemplate(resume.template || 'professional');
    setCurrentResumeId(resume.id);
    setHasUnsavedChanges(false);
    setManagerDialogOpen(false);
    setActiveTab(1); // Switch to Form tab
    setSnackbarMessage('Resume loaded successfully!');
    setSnackbarOpen(true);
  };

  const handleNewResume = () => {
    setResumeData({
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
    setResumeName('Untitled Resume');
    setSelectedTemplate('professional');
    setCurrentResumeId(null);
    setHasUnsavedChanges(false);
    setManagerDialogOpen(false);
    setActiveTab(0); // Switch to Input tab
  };

  const handleDuplicateResume = (resume) => {
    setResumeData({
      personalInfo: resume.personalInfo || {},
      summary: resume.summary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      certifications: resume.certifications || [],
      projects: resume.projects || []
    });
    setResumeName(`${resume.name} (Copy)`);
    setSelectedTemplate(resume.template || 'professional');
    setCurrentResumeId(null); // New resume
    setHasUnsavedChanges(true);
    setManagerDialogOpen(false);
    setActiveTab(1); // Switch to Form tab
  };

  const handleFileUpload = async (files) => {
    setIsProcessing(true);
    try {
      // Process uploaded files
      for (const file of files) {
        await processFile(file);
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

  const processFile = async (file) => {
    try {
      if (file.type === 'application/pdf') {
        // Process PDF using Firebase AI Logic
        await processPDFFile(file);
      } else if (file.type.startsWith('image/')) {
        // Process image using Firebase AI Logic
        await processImageFile(file);
      } else {
        // Process text files
        const text = await extractTextFromFile(file);
        await processInput(text);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  const processPDFFile = async (file) => {
    try {
      console.log('Processing PDF file:', file.name, 'Size:', file.size);
      const fileData = await readFileAsArrayBuffer(file);
      console.log('File read as ArrayBuffer, size:', fileData.byteLength);
      
      const result = await geminiService.analyzeDocument(fileData, file.name);
      console.log('AI analysis result:', result);
      
      await processInput(result);
    } catch (error) {
      console.error('Error processing PDF:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  const processImageFile = async (file) => {
    try {
      const fileData = await readFileAsDataURL(file);
      const result = await geminiService.analyzeImage(fileData, file.name);
      await processInput(result);
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
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
      label: 'My Resumes',
      content: (
        <ResumeManager 
          onSelectResume={handleLoadResume}
          onNewResume={handleNewResume}
          onEditResume={handleDuplicateResume}
        />
      )
    },
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
          onChange={handleResumeDataChange}
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Resume Builder
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          {currentResumeId && (
            <Chip 
              label={resumeName} 
              color="primary" 
              variant="outlined"
              onDelete={() => setResumeName('Untitled Resume')}
            />
          )}
          {hasUnsavedChanges && (
            <Chip 
              label="Unsaved changes" 
              color="warning" 
              size="small"
            />
          )}
          <Button
            variant="outlined"
            startIcon={<FolderOpen />}
            onClick={() => setManagerDialogOpen(true)}
          >
            My Resumes
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveResume}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </Box>
      </Box>
      
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

      {/* Resume Manager Dialog */}
      <Dialog 
        open={managerDialogOpen} 
        onClose={() => setManagerDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>My Resumes</DialogTitle>
        <DialogContent>
          <ResumeManager 
            onSelectResume={handleLoadResume}
            onNewResume={handleNewResume}
            onEditResume={handleDuplicateResume}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManagerDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Resume</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resume Name"
            fullWidth
            variant="outlined"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveResume()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveResume} 
            variant="contained"
            disabled={!resumeName.trim() || isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

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
