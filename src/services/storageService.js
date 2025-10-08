import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from '../config/firebase';

class StorageService {
  constructor() {
    this.storage = storage;
  }

  // Upload file to Firebase Storage
  async uploadFile(file, path, userId) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `users/${userId}/${path}/${fileName}`;
      const fileRef = ref(this.storage, filePath);
      
      const uploadResult = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      return {
        url: downloadURL,
        path: filePath,
        name: fileName,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadFiles(files, path, userId) {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, path, userId));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  // Get file download URL
  async getFileURL(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // List files in a directory
  async listFiles(path) {
    try {
      const listRef = ref(this.storage, path);
      const result = await listAll(listRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const url = await getDownloadURL(itemRef);
          
          return {
            name: itemRef.name,
            url,
            size: metadata.size,
            type: metadata.contentType,
            updated: metadata.updated
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Upload resume document
  async uploadResumeDocument(file, userId, resumeId) {
    return this.uploadFile(file, `resumes/${resumeId}/documents`, userId);
  }

  // Upload cover letter document
  async uploadCoverLetterDocument(file, userId, coverLetterId) {
    return this.uploadFile(file, `coverLetters/${coverLetterId}/documents`, userId);
  }

  // Upload profile image
  async uploadProfileImage(file, userId) {
    return this.uploadFile(file, 'profile', userId);
  }

  // Upload job description
  async uploadJobDescription(file, userId) {
    return this.uploadFile(file, 'jobDescriptions', userId);
  }

  // Get user's uploaded files
  async getUserFiles(userId, path = '') {
    return this.listFiles(`users/${userId}/${path}`);
  }

  // Clean up old files (utility function)
  async cleanupOldFiles(userId, path, maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    try {
      const files = await this.listFiles(`users/${userId}/${path}`);
      const now = Date.now();
      
      const oldFiles = files.filter(file => {
        const fileAge = now - new Date(file.updated).getTime();
        return fileAge > maxAge;
      });
      
      const deletePromises = oldFiles.map(file => 
        this.deleteFile(`users/${userId}/${path}/${file.name}`)
      );
      
      await Promise.all(deletePromises);
      return oldFiles.length;
    } catch (error) {
      console.error('Error cleaning up old files:', error);
      throw error;
    }
  }
}

export default new StorageService();
