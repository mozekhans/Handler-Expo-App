import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import api from './apiService';

class UploadService {
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    
    // Handle file from different sources
    let fileUri = file.uri;
    let fileName = file.name || 'upload.jpg';
    let fileType = file.type || 'image/jpeg';
    
    // If it's a local file, get the actual file data
    if (fileUri.startsWith('file://') || fileUri.startsWith('content://')) {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
    }
    
    formData.append('file', {
      uri: fileUri,
      type: fileType,
      name: fileName,
    });

    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  }

  async uploadMultiple(files, onProgress) {
    const results = [];
    let totalProgress = 0;
    
    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadFile(files[i], (progress) => {
        const overallProgress = ((totalProgress + progress) / files.length);
        if (onProgress) onProgress(overallProgress);
      });
      results.push(result);
      totalProgress += 100;
    }
    
    return results;
  }

  async pickImage(options = {}) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permission.granted) {
      throw new Error('Permission to access media library is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options.mediaType === 'video' 
        ? ImagePicker.MediaTypeOptions.Videos 
        : ImagePicker.MediaTypeOptions.Images,
      quality: options.quality || 0.8,
      base64: options.includeBase64 || false,
      allowsEditing: options.allowsEditing || false,
      aspect: options.aspect || [4, 3],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
      };
    }
    return null;
  }

  async takePhoto(options = {}) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permission.granted) {
      throw new Error('Permission to access camera is required');
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: options.quality || 0.8,
      base64: options.includeBase64 || false,
      allowsEditing: options.allowsEditing || false,
      aspect: options.aspect || [4, 3],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
      };
    }
    return null;
  }

  async pickVideo(options = {}) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permission.granted) {
      throw new Error('Permission to access media library is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: options.quality || 0.8,
      allowsEditing: options.allowsEditing || false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type || 'video/mp4',
        name: asset.fileName || `video_${Date.now()}.mp4`,
        duration: asset.duration,
        width: asset.width,
        height: asset.height,
      };
    }
    return null;
  }

  async pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.mimeType || 'application/octet-stream',
        name: asset.name,
        size: asset.size,
      };
    }
    return null;
  }

  async pickMultipleImages(limit = 10) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permission.granted) {
      throw new Error('Permission to access media library is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: limit,
    });

    if (!result.canceled) {
      return result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `image_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
      }));
    }
    return [];
  }

  async getMedia(businessId, params = {}) {
    const response = await api.get(`/business/${businessId}/media`, { params });
    return response.data;
  }

  async getMediaItem(mediaId) {
    const response = await api.get(`/media/${mediaId}`);
    return response.data;
  }

  async deleteMedia(mediaId) {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  }

  async updateMedia(mediaId, data) {
    const response = await api.put(`/media/${mediaId}`, data);
    return response.data;
  }

  async getMediaTags(mediaId) {
    const response = await api.get(`/media/${mediaId}/tags`);
    return response.data.tags;
  }

  async addMediaTag(mediaId, tag) {
    const response = await api.post(`/media/${mediaId}/tags`, { tag });
    return response.data;
  }

  async removeMediaTag(mediaId, tag) {
    const response = await api.delete(`/media/${mediaId}/tags/${encodeURIComponent(tag)}`);
    return response.data;
  }
}

export default new UploadService();