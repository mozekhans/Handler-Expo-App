import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const takePhoto = async (options = {}) => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return null;
      }
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: options.mediaType === 'video' 
          ? ImagePicker.MediaTypeOptions.Videos 
          : ImagePicker.MediaTypeOptions.Images,
        quality: options.quality || 0.8,
        allowsEditing: options.allowsEditing || false,
        aspect: options.aspect || [4, 3],
        base64: options.base64 || false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPhoto(asset);
        return asset;
      }
      return null;
    } catch (error) {
      console.error('Take photo error:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
  };

  return {
    hasPermission,
    photo,
    loading,
    requestPermission,
    takePhoto,
    clearPhoto,
  };
};