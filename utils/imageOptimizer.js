import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

class ImageOptimizer {
  constructor() {
    this.qualities = {
      thumbnail: 0.3,
      preview: 0.6,
      high: 0.9,
      original: 1.0,
    };
    
    this.sizes = {
      thumbnail: { width: 200, height: 200 },
      preview: { width: 800, height: 800 },
      high: { width: 1920, height: 1920 },
    };
  }

  async optimizeImage(uri, quality = 'preview') {
    try {
      const qualityValue = this.qualities[quality] || this.qualities.preview;
      const size = this.sizes[quality];
      
      let actions = [];
      
      // Resize if needed
      if (size) {
        actions.push({
          resize: {
            width: size.width,
            height: size.height,
          },
        });
      }
      
      // Compress
      actions.push({
        compress: qualityValue,
      });
      
      const result = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: qualityValue,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      
      return result;
    } catch (error) {
      console.error('Image optimization error:', error);
      return { uri };
    }
  }

  async optimizeMultipleImages(uris, quality = 'preview') {
    const results = [];
    for (const uri of uris) {
      const optimized = await this.optimizeImage(uri, quality);
      results.push(optimized);
    }
    return results;
  }

  async getImageInfo(uri) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return {
        uri,
        exists: info.exists,
        size: info.size,
        modificationTime: info.modificationTime,
      };
    } catch (error) {
      console.error('Get image info error:', error);
      return null;
    }
  }

  async getImageDimensions(uri) {
    try {
      const image = await ImageManipulator.manipulateAsync(uri, [], {});
      return {
        width: image.width,
        height: image.height,
      };
    } catch (error) {
      console.error('Get image dimensions error:', error);
      return null;
    }
  }

  async cropImage(uri, cropRect) {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, [
        {
          crop: cropRect,
        },
      ]);
      return result;
    } catch (error) {
      console.error('Crop image error:', error);
      return { uri };
    }
  }

  async resizeImage(uri, width, height) {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, [
        {
          resize: { width, height },
        },
      ]);
      return result;
    } catch (error) {
      console.error('Resize image error:', error);
      return { uri };
    }
  }

  async rotateImage(uri, degrees) {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, [
        {
          rotate: degrees,
        },
      ]);
      return result;
    } catch (error) {
      console.error('Rotate image error:', error);
      return { uri };
    }
  }

  async flipImage(uri, horizontal = false, vertical = false) {
    try {
      const actions = [];
      if (horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      if (vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });
      
      const result = await ImageManipulator.manipulateAsync(uri, actions);
      return result;
    } catch (error) {
      console.error('Flip image error:', error);
      return { uri };
    }
  }

  async generateThumbnail(uri, size = 150) {
    try {
      const result = await this.resizeImage(uri, size, size);
      return result;
    } catch (error) {
      console.error('Generate thumbnail error:', error);
      return { uri };
    }
  }

  async convertToBase64(uri) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Convert to base64 error:', error);
      return null;
    }
  }

  async getImageSizeInKB(uri) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && info.size) {
        return Math.round(info.size / 1024);
      }
      return 0;
    } catch (error) {
      console.error('Get image size error:', error);
      return 0;
    }
  }
}

export default new ImageOptimizer();