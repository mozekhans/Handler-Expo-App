import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

class VideoOptimizer {
  constructor() {
    this.thumbnailSizes = {
      small: 150,
      medium: 300,
      large: 600,
    };
  }

  async generateThumbnail(videoUri, size = 'medium') {
    try {
      const thumbnailSize = this.thumbnailSizes[size] || this.thumbnailSizes.medium;
      
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0,
        quality: 0.8,
        size: thumbnailSize,
      });
      
      return uri;
    } catch (error) {
      console.error('Generate video thumbnail error:', error);
      return null;
    }
  }

  async generateMultipleThumbnails(videoUri, times = [0, 5, 10]) {
    try {
      const thumbnails = [];
      for (const time of times) {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time,
          quality: 0.8,
        });
        thumbnails.push({ time, uri });
      }
      return thumbnails;
    } catch (error) {
      console.error('Generate multiple thumbnails error:', error);
      return [];
    }
  }

  async getVideoInfo(videoUri) {
    try {
      const info = await FileSystem.getInfoAsync(videoUri);
      return {
        uri: videoUri,
        exists: info.exists,
        size: info.size,
        modificationTime: info.modificationTime,
      };
    } catch (error) {
      console.error('Get video info error:', error);
      return null;
    }
  }

  async getVideoDuration(videoUri) {
    try {
      // Note: Getting video duration requires additional libraries
      // This is a placeholder - you may need to use a video player library
      return 0;
    } catch (error) {
      console.error('Get video duration error:', error);
      return 0;
    }
  }

  async compressVideo(videoUri, options = {}) {
    try {
      // Note: Video compression requires expo-av or other libraries
      // This is a placeholder - implement based on your needs
      return videoUri;
    } catch (error) {
      console.error('Compress video error:', error);
      return videoUri;
    }
  }
}

export default new VideoOptimizer();