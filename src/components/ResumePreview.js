import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { Email, Phone, LocationOn, LinkedIn, Language } from '@mui/icons-material';

const ResumePreview = ({ data, template = 'professional' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getTemplateStyles = () => {
    const templates = {
      professional: {
        header: { bgcolor: '#1976d2', color: 'white' },
        section: { borderLeft: '3px solid #1976d2', pl: 2 },
        text: { color: 'text.primary' }
      },
      modern: {
        header: { bgcolor: '#424242', color: 'white' },
        section: { borderLeft: '3px solid #424242', pl: 2 },
        text: { color: 'text.primary' }
      },
      creative: {
        header: { bgcolor: '#e91e63', color: 'white' },
        section: { borderLeft: '3px solid #e91e63', pl: 2 },
        text: { color: 'text.primary' }
      },
      minimal: {
        header: { bgcolor: 'transparent', color: 'text.primary', borderBottom: '2px solid #000' },
        section: { borderLeft: '1px solid #ccc', pl: 2 },
        text: { color: 'text.primary' }
      }
    };
    return templates[template] || templates.professional;
  };

  const styles = getTemplateStyles();

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ ...styles.header, p: 3, mb: 3, borderRadius: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {data.personalInfo?.name || 'Your Name'}
        </Typography>
        
        <Grid container spacing={2}>
          {data.personalInfo?.email && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{data.personalInfo.email}</Typography>
              </Box>
            </Grid>
          )}
          
          {data.personalInfo?.phone && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{data.personalInfo.phone}</Typography>
              </Box>
            </Grid>
          )}
          
          {data.personalInfo?.location && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{data.personalInfo.location}</Typography>
              </Box>
            </Grid>
          )}
          
          {data.personalInfo?.linkedin && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <LinkedIn sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{data.personalInfo.linkedin}</Typography>
              </Box>
            </Grid>
          )}
          
          {data.personalInfo?.portfolio && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Language sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1">{data.personalInfo.portfolio}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Professional Summary */}
      {data.summary && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Professional Summary
          </Typography>
          <Typography variant="body1" sx={styles.text}>
            {data.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Professional Experience
          </Typography>
          {data.experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="h6" component="h3">
                    {exp.position}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {exp.company}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </Typography>
              </Box>
              {exp.description && (
                <Typography variant="body2" sx={styles.text}>
                  {exp.description}
                </Typography>
              )}
              {index < data.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Education
          </Typography>
          {data.education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="h6" component="h3">
                    {edu.degree} in {edu.field}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {edu.institution}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
              </Box>
              {index < data.education.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Skills
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {data.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Projects
          </Typography>
          {data.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3">
                {project.name}
              </Typography>
              {project.description && (
                <Typography variant="body2" sx={styles.text}>
                  {project.description}
                </Typography>
              )}
              {project.technologies && (
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {project.technologies.map((tech, techIndex) => (
                    <Chip
                      key={techIndex}
                      label={tech}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              {index < data.projects.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={styles.section}>
            Certifications
          </Typography>
          {data.certifications.map((cert, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body1">
                {cert.name} - {cert.issuer}
              </Typography>
              {cert.date && (
                <Typography variant="body2" color="text.secondary">
                  {formatDate(cert.date)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ResumePreview;
