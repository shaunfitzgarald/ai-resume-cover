import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Send,
  Psychology,
  Person
} from '@mui/icons-material';

const ChatInterface = ({ messages, onSendMessage, isProcessing }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper elevation={2} sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" display="flex" alignItems="center">
          <Psychology sx={{ mr: 1, color: 'primary.main' }} />
          AI Assistant
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box 
        className="chat-container"
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                width: 32,
                height: 32
              }}
            >
              {message.type === 'user' ? <Person /> : <Psychology />}
            </Avatar>
            
            <Paper
              className={`message ${message.type}`}
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.type === 'user' ? 'primary.light' : 'grey.100',
                color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                wordWrap: 'break-word'
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            </Paper>
          </Box>
        ))}
        
        {isProcessing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              <Psychology />
            </Avatar>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">AI is thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type your information or ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            sx={{ alignSelf: 'flex-end' }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
