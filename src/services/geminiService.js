import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../config/firebase';

// Firebase AI Logic Service for processing user inputs and generating content
class GeminiService {
  constructor() {
    // Initialize the generative model using Firebase AI Logic
    this.model = getGenerativeModel(ai, { 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }

  async generateContent(prompt, userData = {}) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Firebase AI Logic:', error);
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
}

export default new GeminiService();
