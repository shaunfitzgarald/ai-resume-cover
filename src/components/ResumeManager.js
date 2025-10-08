import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  MoreVert,
  Description,
  CalendarToday,
  Person,
  Save,
  CloudDownload
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';

const ResumeManager = ({ onSelectResume, onNewResume, onEditResume }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const userResumes = await databaseService.getResumes(user.uid);
      setResumes(userResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async (resumeData, resumeName = 'Untitled Resume') => {
    if (!user) {
      setError('Please sign in to save resumes');
      return;
    }

    try {
      const resumeId = await databaseService.saveResume(user.uid, {
        ...resumeData,
        name: resumeName,
        lastModified: new Date().toISOString()
      });
      
      await loadResumes(); // Refresh the list
      return resumeId;
    } catch (error) {
      console.error('Error saving resume:', error);
      setError('Failed to save resume');
      throw error;
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await databaseService.deleteResume(user.uid, resumeId);
      await loadResumes();
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume');
    }
  };

  const handleDuplicateResume = async (resume) => {
    try {
      const duplicatedResume = {
        ...resume,
        name: `${resume.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      delete duplicatedResume.id; // Remove the ID so a new one is created
      
      await databaseService.saveResume(user.uid, duplicatedResume);
      await loadResumes();
    } catch (error) {
      console.error('Error duplicating resume:', error);
      setError('Failed to duplicate resume');
    }
  };

  const handleRenameResume = async () => {
    if (!selectedResume || !newName.trim()) return;

    try {
      await databaseService.saveResume(user.uid, {
        ...selectedResume,
        name: newName.trim()
      }, selectedResume.id);
      
      await loadResumes();
      setRenameDialogOpen(false);
      setNewName('');
      setSelectedResume(null);
    } catch (error) {
      console.error('Error renaming resume:', error);
      setError('Failed to rename resume');
    }
  };

  const handleMenuOpen = (event, resume) => {
    setMenuAnchor(event.currentTarget);
    setSelectedResume(resume);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedResume(null);
  };

  const handleDeleteClick = () => {
    setResumeToDelete(selectedResume);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameClick = () => {
    setNewName(selectedResume.name);
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleDuplicateClick = () => {
    handleDuplicateResume(selectedResume);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Resumes</Typography>
        <Fab
          color="primary"
          onClick={onNewResume}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          <Add />
        </Fab>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {resumes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No resumes yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first resume to get started
            </Typography>
            <Button variant="contained" onClick={onNewResume}>
              Create Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h3" noWrap>
                      {resume.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, resume)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {resume.personalInfo?.name || 'No name set'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(resume.updatedAt || resume.createdAt)}
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {resume.template && (
                      <Chip 
                        label={resume.template} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    )}
                    {resume.experience?.length > 0 && (
                      <Chip 
                        label={`${resume.experience.length} experience${resume.experience.length > 1 ? 's' : ''}`}
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => onEditResume(resume)}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => onSelectResume(resume)}
                    startIcon={<Description />}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRenameClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateClick}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{resumeToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteResume(resumeToDelete?.id)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Resume</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resume Name"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRenameResume()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRenameResume} 
            variant="contained"
            disabled={!newName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeManager;
