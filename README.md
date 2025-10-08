# AI Resume & Cover Letter Builder

An AI-powered application that creates stunning, professional resumes and cover letters using multiple input methods including text, PDFs, images, and voice.

## Features

- 🤖 **AI-Powered Content Generation**: Uses Google's Gemini AI to intelligently process and generate resume/cover letter content
- 📄 **Multi-Modal Input**: Accept text, PDF uploads, images, and voice input
- 💬 **Conversational AI**: Interactive chat interface that asks smart questions to gather missing information
- 🎨 **Multiple Templates**: Professional, modern, creative, and minimal design templates
- 📝 **JSON-Based Forms**: Structured data format for easy styling and customization
- 👀 **Real-time Preview**: Live preview of your resume/cover letter as you build
- 📤 **Export Options**: Export to PDF, Word, and web formats
- 🎯 **Industry-Specific Optimization**: AI tailors content based on job industry/role
- 🔄 **Version History**: Track changes and iterations
- 👥 **Collaboration Features**: Share drafts for feedback

## Tech Stack

- **Frontend**: React 18 with JavaScript
- **UI Framework**: Material-UI (MUI)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **AI**: Google Gemini API
- **File Processing**: PDF.js, Web Speech API
- **Export**: jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-cover
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Fill in your Firebase and Gemini API credentials in the `.env` file:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id

   # Gemini AI Configuration
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication
   - Enable Storage
   - Get your Firebase config and add it to the `.env` file

5. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

6. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Usage

### Building a Resume

1. **Input Information**: 
   - Upload existing documents (PDF, DOC, images)
   - Use voice input to speak your information
   - Type information directly
   - Chat with the AI assistant

2. **AI Processing**: 
   - The AI analyzes your input and extracts relevant information
   - It asks follow-up questions to gather missing details
   - Information is structured into JSON format

3. **Form Editing**: 
   - Review and edit the extracted information
   - Add additional details using the structured form
   - Organize experience, education, and skills

4. **Template Selection**: 
   - Choose from professional, modern, creative, or minimal templates
   - Preview how your resume looks with different styles

5. **Preview & Export**: 
   - See a real-time preview of your resume
   - Export to PDF, Word, or web format
   - Make final adjustments before exporting

### Writing a Cover Letter

1. **Provide Job Information**: 
   - Upload job description or paste it directly
   - Specify company name and position

2. **AI Analysis**: 
   - AI analyzes the job requirements
   - Identifies relevant skills and experience
   - Suggests key points to highlight

3. **Content Generation**: 
   - AI generates tailored cover letter content
   - Customizes opening, body, and closing paragraphs
   - Aligns your experience with job requirements

4. **Review & Customize**: 
   - Edit the generated content
   - Add personal touches and specific examples
   - Choose from different templates

5. **Export**: 
   - Preview the final cover letter
   - Export in your preferred format

## Project Structure

```
src/
├── components/           # React components
│   ├── HomePage.js      # Landing page
│   ├── ResumeBuilder.js # Main resume builder
│   ├── CoverLetterBuilder.js # Cover letter builder
│   ├── FileUpload.js    # File upload component
│   ├── ChatInterface.js # AI chat interface
│   ├── ResumeForm.js    # Resume data form
│   ├── ResumePreview.js # Resume preview
│   ├── CoverLetterForm.js # Cover letter form
│   └── CoverLetterPreview.js # Cover letter preview
├── services/            # API services
│   └── geminiService.js # Gemini AI integration
├── config/              # Configuration files
│   └── firebase.js      # Firebase setup
├── App.js              # Main app component
├── App.css             # Global styles
└── index.js            # App entry point
```

## API Integration

### Gemini AI Service

The `geminiService.js` handles all AI interactions:

- **Content Processing**: Extracts information from user inputs
- **Question Generation**: Creates follow-up questions for missing information
- **Content Generation**: Generates resume and cover letter content
- **Template Application**: Applies different writing styles

### Firebase Integration

- **Firestore**: Stores user data and resume/cover letter templates
- **Authentication**: User login and session management
- **Storage**: File uploads and document storage

## Customization

### Adding New Templates

1. Create a new template in the `templates` directory
2. Add template styles to the preview components
3. Update the template selection UI

### Extending AI Capabilities

1. Modify prompts in `geminiService.js`
2. Add new processing functions for specific content types
3. Implement additional AI features like ATS optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@airesumebuilder.com or join our Slack channel.

## Roadmap

- [ ] ATS optimization features
- [ ] Industry-specific templates
- [ ] Collaboration and sharing features
- [ ] Advanced analytics and insights
- [ ] Mobile app development
- [ ] Integration with job boards
- [ ] Resume scoring and feedback
- [ ] Multi-language support
