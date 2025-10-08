import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  Close,
  Description,
  Image,
  PictureAsPdf
} from '@mui/icons-material';

const FileUpload = ({ onUpload, accept, multiple = false, maxSize = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.from(files);
      
      // Validate files
      for (const file of fileArray) {
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        }
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploading(false);
            // Use setTimeout to avoid setState during render
            setTimeout(() => onUpload(fileArray), 0);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

    } catch (err) {
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <PictureAsPdf color="error" />;
    if (fileType.includes('image')) return <Image color="primary" />;
    return <Description color="action" />;
  };

  return (
    <Box>
      <Paper
        className={`upload-area ${dragActive ? 'dragover' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          bgcolor: dragActive ? 'primary.light' : 'background.paper',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.light'
          }
        }}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse files
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
        </Typography>
        
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ mb: 1 }}
            />
            <Typography variant="caption">
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
