import { getGenerativeModel } from 'firebase/ai';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import { initializeApp } from 'firebase/app';

// Firebase AI Logic Service for processing user inputs and generating content
class GeminiService {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Check if Gemini API key is available
      console.log('Checking for Gemini API key...');
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        console.error('Gemini API key not found in environment variables');
        throw new Error('Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
      }
      console.log('Gemini API key found, length:', process.env.REACT_APP_GEMINI_API_KEY.length);

      // Use direct API for now (skip Firebase AI Logic)
      console.log('Using direct Gemini API (skipping Firebase AI Logic)');
      this.useDirectAPI = true;
      this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Gemini service:', error);
      throw error;
    }
  }

  async generateContent(prompt, userData = {}) {
    try {
      await this.initialize();
      
      return await this.generateContentDirect(prompt);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async generateContentDirect(prompt) {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling direct Gemini API:', error);
      throw error;
    }
  }

  async processResumeInput(inputText, existingData = {}) {
    const prompt = `
    You are an AI assistant helping to build a professional resume. 
    The user has provided the following information: "${inputText}"
    
    Current resume data: ${JSON.stringify(existingData)}
    
    Please analyze this information and:
    1. Extract relevant resume information (name, contact, experience, education, skills, etc.)
    2. Identify what information is missing
    3. Ask specific questions to gather missing information
    4. Return a JSON object with the extracted data and questions
    
    Format your response as:
    {
      "extractedData": {
        "personalInfo": {...},
        "experience": [...],
        "education": [...],
        "skills": [...],
        "other": {...}
      },
      "missingInfo": ["list of missing information"],
      "questions": ["specific questions to ask the user"],
      "confidence": 0.8
    }
    `;

    return await this.generateContent(prompt, existingData);
  }

  async processCoverLetterInput(inputText, jobDescription = '', existingData = {}) {
    const prompt = `
    You are an AI assistant helping to write a professional cover letter.
    User input: "${inputText}"
    Job description: "${jobDescription}"
    Existing data: ${JSON.stringify(existingData)}
    
    Please:
    1. Extract relevant information for the cover letter
    2. Identify what's missing
    3. Ask specific questions
    4. Return structured data
    
    Format as:
    {
      "extractedData": {
        "personalInfo": {...},
        "motivation": "...",
        "relevantExperience": [...],
        "skills": [...],
        "closing": "..."
      },
      "missingInfo": [...],
      "questions": [...],
      "confidence": 0.8
    }
    `;

    return await this.generateContent(prompt, existingData);
  }

  async generateResumeContent(resumeData, template = 'professional') {
    const prompt = `
    Generate professional resume content based on this data: ${JSON.stringify(resumeData)}
    
    Template style: ${template}
    
    Create well-formatted, professional content for each section.
    Return as JSON with sections: personalInfo, summary, experience, education, skills, certifications
    `;

    return await this.generateContent(prompt, resumeData);
  }

  async generateCoverLetterContent(coverLetterData, jobDescription = '') {
    const prompt = `
    Write a professional cover letter based on: ${JSON.stringify(coverLetterData)}
    For this job: ${jobDescription}
    
    Make it compelling, specific, and tailored to the role.
    Return as JSON with sections: header, opening, body, closing
    `;

    return await this.generateContent(prompt, coverLetterData);
  }

  async askFollowUpQuestion(context, missingInfo) {
    const prompt = `
    Based on this context: ${JSON.stringify(context)}
    The user is missing: ${missingInfo.join(', ')}
    
    Ask one specific, helpful question to gather this information.
    Be conversational and encouraging.
    `;

    return await this.generateContent(prompt);
  }

  async analyzeDocument(fileData, fileName) {
    try {
      console.log('Starting document analysis for:', fileName);
      await this.initialize();
      
      // Convert ArrayBuffer to base64
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileData)));
      console.log('Document converted to base64, length:', base64Data.length);
      
      const prompt = `
      Analyze this document (${fileName}) and extract all relevant resume information.
      
      Please extract:
      1. Personal information (name, contact details, location)
      2. Professional summary/objective
      3. Work experience (company, position, dates, responsibilities, achievements)
      4. Education (institution, degree, dates, relevant coursework)
      5. Skills (technical, soft skills, certifications)
      6. Projects, publications, or other relevant information
      
      Format your response as structured JSON data that can be used to populate a resume form.
      Be thorough and accurate in extracting all information.
      `;

      console.log('Sending document to AI for analysis...');
      
      return await this.analyzeDocumentDirect(prompt, base64Data, fileName);
    } catch (error) {
      console.error('Error analyzing document:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      throw error;
    }
  }

  async analyzeDocumentDirect(prompt, base64Data, fileName) {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Document analysis completed successfully');
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling direct Gemini API for document:', error);
      throw error;
    }
  }

  async analyzeImage(fileData, fileName) {
    try {
      await this.initialize();
      
      // Extract base64 data from data URL
      const base64Data = fileData.split(',')[1];
      
      const prompt = `
      Analyze this image (${fileName}) and extract any resume or professional information visible.
      
      Look for:
      1. Text content (names, contact info, job titles, skills)
      2. Layout and structure information
      3. Any professional details that could be relevant for a resume
      
      If this appears to be a resume or professional document, extract all readable information.
      If it's not a resume, describe what you see and suggest how it might be relevant.
      
      Format your response as structured information that could be used for resume building.
      `;

      return await this.analyzeImageDirect(prompt, base64Data, fileName);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async analyzeImageDirect(prompt, base64Data, fileName) {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling direct Gemini API for image:', error);
      throw error;
    }
  }
}

export default new GeminiService();
