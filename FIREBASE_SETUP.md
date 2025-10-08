# Firebase Setup Guide

## 1. Firebase Project Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ai-resume-cover`
4. Enable Google Analytics (optional)
5. Create project

### Enable Required Services

#### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable:
   - **Email/Password**
   - **Google** (recommended)

#### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)

#### Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore

#### Functions (Optional)
1. Go to "Functions"
2. Click "Get started"
3. Follow setup instructions for local development

## 2. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app (</>) icon
4. Register app with name: `ai-resume-cover-web`
5. Copy the config object

## 3. Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini AI Configuration
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 4. Firestore Security Rules

Update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Resumes
      match /resumes/{resumeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Cover Letters
      match /coverLetters/{coverLetterId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Templates are publicly readable
    match /templates/{templateId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can create templates
    }
    
    // Usage analytics (optional)
    match /usage/{usageId} {
      allow create: if request.auth != null;
    }
  }
}
```

## 5. Storage Security Rules

Update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. Authentication Setup

### Email/Password Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Optionally enable "Email link (passwordless sign-in)"

### Google Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable "Google"
3. Add your project's support email
4. Save

## 7. Testing the Setup

1. Start your development server: `npm start`
2. Try signing up with email/password
3. Try signing in with Google
4. Check Firebase Console to see if users are created
5. Test file uploads and data storage

## 8. Production Deployment

### Before deploying to production:

1. **Update Security Rules**: Change from "test mode" to production rules
2. **Enable App Check**: Add App Check for additional security
3. **Set up Custom Domain**: Configure custom domain for authentication
4. **Monitor Usage**: Set up billing alerts and monitoring

### Security Rules for Production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true;
      
      match /resumes/{resumeId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == userId
          && request.auth.token.email_verified == true;
      }
      
      match /coverLetters/{coverLetterId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == userId
          && request.auth.token.email_verified == true;
      }
    }
    
    match /templates/{templateId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.token.email_verified == true;
    }
  }
}
```

## 9. Troubleshooting

### Common Issues:

1. **Authentication not working**: Check if services are enabled in Firebase Console
2. **Permission denied**: Verify security rules are correct
3. **CORS errors**: Make sure domain is added to authorized domains
4. **File upload fails**: Check Storage rules and file size limits

### Debug Mode:
Add this to your Firebase config for debugging:
```javascript
if (process.env.NODE_ENV === 'development') {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 8080);
  });
}
```

## 10. Next Steps

1. Set up Firebase Hosting for deployment
2. Configure custom email templates
3. Add user role management
4. Set up automated backups
5. Monitor performance and usage
