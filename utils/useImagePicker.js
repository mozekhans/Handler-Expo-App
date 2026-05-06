import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select images');
      return false;
    }
    return true;
  };

  const pickImage = async (options = {}) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: options.mediaType === 'video' 
          ? ImagePicker.MediaTypeOptions.Videos 
          : ImagePicker.MediaTypeOptions.Images,
        quality: options.quality || 0.8,
        allowsEditing: options.allowsEditing || false,
        aspect: options.aspect || [4, 3],
        base64: options.base64 || false,
        allowsMultipleSelection: options.allowsMultipleSelection || false,
        selectionLimit: options.selectionLimit || 1,
      });

      if (!result.canceled && result.assets) {
        if (options.allowsMultipleSelection) {
          setSelectedImages(result.assets);
          return result.assets;
        } else {
          setSelectedImages([result.assets[0]]);
          return result.assets[0];
        }
      }
      return null;
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to select image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pickMultipleImages = async (limit = 10) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return [];

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: limit,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(result.assets);
        return result.assets;
      }
      return [];
    } catch (error) {
      console.error('Pick multiple images error:', error);
      Alert.alert('Error', 'Failed to select images');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return {
    selectedImages,
    loading,
    pickImage,
    pickMultipleImages,
    clearImages,
    removeImage,
  };
};