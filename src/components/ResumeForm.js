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
  Chip,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  Add,
  Delete,
  Edit
} from '@mui/icons-material';

const ResumeForm = ({ data, onChange }) => {
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
    addArrayItem('experience', {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
  };

  const addEducation = () => {
    addArrayItem('education', {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    });
  };

  const addSkill = () => {
    const skill = prompt('Enter a skill:');
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={data.personalInfo?.linkedin || ''}
                onChange={(e) => updateData('personalInfo', 'linkedin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Portfolio/Website"
                value={data.personalInfo?.portfolio || ''}
                onChange={(e) => updateData('personalInfo', 'portfolio', e.target.value)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Professional Summary */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Professional Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Summary"
            value={data.summary || ''}
            onChange={(e) => onChange(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Write a compelling professional summary..."
          />
        </AccordionDetails>
      </Accordion>

      {/* Experience */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Work Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {data.experience?.map((exp, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">Experience {index + 1}</Typography>
                  <IconButton onClick={() => removeArrayItem('experience', index)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={exp.company || ''}
                      onChange={(e) => updateArrayData('experience', index, 'company', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={exp.position || ''}
                      onChange={(e) => updateArrayData('experience', index, 'position', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="month"
                      value={exp.startDate || ''}
                      onChange={(e) => updateArrayData('experience', index, 'startDate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="month"
                      value={exp.endDate || ''}
                      onChange={(e) => updateArrayData('experience', index, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={exp.description || ''}
                      onChange={(e) => updateArrayData('experience', index, 'description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addExperience}>
              Add Experience
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Education */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Education</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {data.education?.map((edu, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">Education {index + 1}</Typography>
                  <IconButton onClick={() => removeArrayItem('education', index)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Institution"
                      value={edu.institution || ''}
                      onChange={(e) => updateArrayData('education', index, 'institution', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Degree"
                      value={edu.degree || ''}
                      onChange={(e) => updateArrayData('education', index, 'degree', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Field of Study"
                      value={edu.field || ''}
                      onChange={(e) => updateArrayData('education', index, 'field', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="month"
                      value={edu.startDate || ''}
                      onChange={(e) => updateArrayData('education', index, 'startDate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="month"
                      value={edu.endDate || ''}
                      onChange={(e) => updateArrayData('education', index, 'endDate', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addEducation}>
              Add Education
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Skills */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Skills</Typography>
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
    </Box>
  );
};

export default ResumeForm;
