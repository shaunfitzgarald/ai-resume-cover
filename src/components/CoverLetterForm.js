import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Add,
  Delete
} from '@mui/icons-material';

const CoverLetterForm = ({ data, onChange }) => {
  const updateData = (section, field, value) => {
    onChange(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayData = (section, index, field, value) => {
    onChange(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, newItem) => {
    onChange(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    onChange(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    addArrayItem('relevantExperience', {
      title: '',
      description: '',
      impact: ''
    });
  };

  const addSkill = () => {
    const skill = prompt('Enter a relevant skill:');
    if (skill) {
      onChange(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (index) => {
    onChange(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box>
      {/* Personal Information */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={data.personalInfo?.name || ''}
                onChange={(e) => updateData('personalInfo', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={data.personalInfo?.email || ''}
                onChange={(e) => updateData('personalInfo', 'email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={data.personalInfo?.phone || ''}
                onChange={(e) => updateData('personalInfo', 'phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={data.personalInfo?.location || ''}
                onChange={(e) => updateData('personalInfo', 'location', e.target.value)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Company Information */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Company & Position Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={data.companyInfo?.companyName || ''}
                onChange={(e) => updateData('companyInfo', 'companyName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position Title"
                value={data.companyInfo?.position || ''}
                onChange={(e) => updateData('companyInfo', 'position', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hiring Manager Name (Optional)"
                value={data.companyInfo?.hiringManager || ''}
                onChange={(e) => updateData('companyInfo', 'hiringManager', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={data.companyInfo?.jobDescription || ''}
                onChange={(e) => updateData('companyInfo', 'jobDescription', e.target.value)}
                placeholder="Paste the job description here..."
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Motivation */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Why This Role?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivation"
            value={data.motivation || ''}
            onChange={(e) => onChange(prev => ({ ...prev, motivation: e.target.value }))}
            placeholder="Why are you interested in this role and company?"
          />
        </AccordionDetails>
      </Accordion>

      {/* Relevant Experience */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Relevant Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {data.relevantExperience?.map((exp, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">Experience {index + 1}</Typography>
                  <IconButton onClick={() => removeArrayItem('relevantExperience', index)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Experience Title"
                      value={exp.title || ''}
                      onChange={(e) => updateArrayData('relevantExperience', index, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={exp.description || ''}
                      onChange={(e) => updateArrayData('relevantExperience', index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Impact/Results"
                      value={exp.impact || ''}
                      onChange={(e) => updateArrayData('relevantExperience', index, 'impact', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addExperience}>
              Add Relevant Experience
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Skills */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Relevant Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {data.skills?.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => removeSkill(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Button startIcon={<Add />} onClick={addSkill}>
              Add Skill
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Cover Letter Content */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Cover Letter Content</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Opening Paragraph"
                value={data.content?.opening || ''}
                onChange={(e) => updateData('content', 'opening', e.target.value)}
                placeholder="Start with a strong opening that captures attention..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Body Paragraphs"
                value={data.content?.body || ''}
                onChange={(e) => updateData('content', 'body', e.target.value)}
                placeholder="Write the main body of your cover letter, highlighting your relevant experience and skills..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Closing Paragraph"
                value={data.content?.closing || ''}
                onChange={(e) => updateData('content', 'closing', e.target.value)}
                placeholder="End with a strong closing that expresses enthusiasm and next steps..."
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CoverLetterForm;
