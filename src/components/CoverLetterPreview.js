import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider
} from '@mui/material';

const CoverLetterPreview = ({ data, template = 'professional' }) => {
  const getTemplateStyles = () => {
    const templates = {
      professional: {
        header: { bgcolor: '#1976d2', color: 'white' },
        text: { color: 'text.primary', lineHeight: 1.6 }
      },
      modern: {
        header: { bgcolor: '#424242', color: 'white' },
        text: { color: 'text.primary', lineHeight: 1.6 }
      },
      creative: {
        header: { bgcolor: '#e91e63', color: 'white' },
        text: { color: 'text.primary', lineHeight: 1.6 }
      },
      minimal: {
        header: { bgcolor: 'transparent', color: 'text.primary', borderBottom: '2px solid #000' },
        text: { color: 'text.primary', lineHeight: 1.6 }
      }
    };
    return templates[template] || templates.professional;
  };

  const styles = getTemplateStyles();

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ ...styles.header, p: 3, mb: 3, borderRadius: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {data.personalInfo?.name || 'Your Name'}
        </Typography>
        <Typography variant="body1">
          {data.personalInfo?.email || 'your.email@example.com'}
        </Typography>
        <Typography variant="body1">
          {data.personalInfo?.phone || '(555) 123-4567'}
        </Typography>
        <Typography variant="body1">
          {data.personalInfo?.location || 'Your City, State'}
        </Typography>
      </Box>

      {/* Date */}
      <Typography variant="body1" sx={{ mb: 2, textAlign: 'right' }}>
        {formatDate()}
      </Typography>

      {/* Company Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {data.companyInfo?.hiringManager ? 
            `Dear ${data.companyInfo.hiringManager},` : 
            'Dear Hiring Manager,'
          }
        </Typography>
      </Box>

      {/* Opening Paragraph */}
      {data.content?.opening && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            {data.content.opening}
          </Typography>
        </Box>
      )}

      {/* Body Paragraphs */}
      {data.content?.body && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            {data.content.body}
          </Typography>
        </Box>
      )}

      {/* Motivation Section */}
      {data.motivation && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            {data.motivation}
          </Typography>
        </Box>
      )}

      {/* Relevant Experience */}
      {data.relevantExperience && data.relevantExperience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            In my previous roles, I have gained valuable experience that directly relates to this position:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 3 }}>
            {data.relevantExperience.map((exp, index) => (
              <Box component="li" key={index} sx={{ mb: 1 }}>
                <Typography variant="body1" sx={styles.text}>
                  <strong>{exp.title}:</strong> {exp.description}
                  {exp.impact && (
                    <span> This resulted in {exp.impact}.</span>
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            My technical skills include: {data.skills.join(', ')}. These skills, combined with my passion for {data.companyInfo?.position || 'this role'}, make me an ideal candidate for this position.
          </Typography>
        </Box>
      )}

      {/* Closing Paragraph */}
      {data.content?.closing && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            {data.content.closing}
          </Typography>
        </Box>
      )}

      {/* Default Closing */}
      {!data.content?.closing && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={styles.text}>
            I am excited about the opportunity to contribute to {data.companyInfo?.companyName || 'your company'} and would welcome the chance to discuss how my skills and experience align with your needs. Thank you for considering my application.
          </Typography>
        </Box>
      )}

      {/* Signature */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" sx={styles.text}>
          Sincerely,
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, ...styles.text }}>
          {data.personalInfo?.name || 'Your Name'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CoverLetterPreview;
