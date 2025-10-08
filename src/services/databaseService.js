import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class DatabaseService {
  constructor() {
    this.db = db;
  }

  // User Profile Management
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(this.db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return userRef;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, userData) {
    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Resume Management
  async saveResume(userId, resumeData, resumeId = null) {
    try {
      const resumeRef = resumeId 
        ? doc(this.db, 'users', userId, 'resumes', resumeId)
        : doc(collection(this.db, 'users', userId, 'resumes'));
      
      const resumeDataWithTimestamp = {
        ...resumeData,
        updatedAt: serverTimestamp(),
        ...(resumeId ? {} : { createdAt: serverTimestamp() })
      };

      await setDoc(resumeRef, resumeDataWithTimestamp);
      return resumeRef.id;
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  }

  async getResumes(userId) {
    try {
      const resumesRef = collection(this.db, 'users', userId, 'resumes');
      const q = query(resumesRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting resumes:', error);
      throw error;
    }
  }

  async getResume(userId, resumeId) {
    try {
      const resumeRef = doc(this.db, 'users', userId, 'resumes', resumeId);
      const resumeSnap = await getDoc(resumeRef);
      return resumeSnap.exists() ? { id: resumeSnap.id, ...resumeSnap.data() } : null;
    } catch (error) {
      console.error('Error getting resume:', error);
      throw error;
    }
  }

  async deleteResume(userId, resumeId) {
    try {
      const resumeRef = doc(this.db, 'users', userId, 'resumes', resumeId);
      await deleteDoc(resumeRef);
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  // Cover Letter Management
  async saveCoverLetter(userId, coverLetterData, coverLetterId = null) {
    try {
      const coverLetterRef = coverLetterId 
        ? doc(this.db, 'users', userId, 'coverLetters', coverLetterId)
        : doc(collection(this.db, 'users', userId, 'coverLetters'));
      
      const coverLetterDataWithTimestamp = {
        ...coverLetterData,
        updatedAt: serverTimestamp(),
        ...(coverLetterId ? {} : { createdAt: serverTimestamp() })
      };

      await setDoc(coverLetterRef, coverLetterDataWithTimestamp);
      return coverLetterRef.id;
    } catch (error) {
      console.error('Error saving cover letter:', error);
      throw error;
    }
  }

  async getCoverLetters(userId) {
    try {
      const coverLettersRef = collection(this.db, 'users', userId, 'coverLetters');
      const q = query(coverLettersRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting cover letters:', error);
      throw error;
    }
  }

  async getCoverLetter(userId, coverLetterId) {
    try {
      const coverLetterRef = doc(this.db, 'users', userId, 'coverLetters', coverLetterId);
      const coverLetterSnap = await getDoc(coverLetterRef);
      return coverLetterSnap.exists() ? { id: coverLetterSnap.id, ...coverLetterSnap.data() } : null;
    } catch (error) {
      console.error('Error getting cover letter:', error);
      throw error;
    }
  }

  async deleteCoverLetter(userId, coverLetterId) {
    try {
      const coverLetterRef = doc(this.db, 'users', userId, 'coverLetters', coverLetterId);
      await deleteDoc(coverLetterRef);
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      throw error;
    }
  }

  // Templates Management
  async getTemplates() {
    try {
      const templatesRef = collection(this.db, 'templates');
      const querySnapshot = await getDocs(templatesRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  // Analytics and Usage Tracking
  async trackUsage(userId, action, data = {}) {
    try {
      const usageRef = collection(this.db, 'usage');
      await addDoc(usageRef, {
        userId,
        action,
        data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Don't throw error for analytics failures
    }
  }
}

export default new DatabaseService();
