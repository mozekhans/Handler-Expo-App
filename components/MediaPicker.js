import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../styles/theme';

const MediaPicker = ({ media, onMediaChange, maxCount = 10 }) => {
  const [uploading, setUploading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos');
      return false;
    }
    return true;
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const newMedia = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
        onMediaChange([...media, newMedia].slice(0, maxCount));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setUploading(false);
    }
  };

  const handleGallery = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxCount - media.length,
      });

      if (!result.canceled && result.assets) {
        const newMedia = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `image_${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
        }));
        onMediaChange([...media, ...newMedia].slice(0, maxCount));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images');
    } finally {
      setUploading(false);
    }
  };

  const handleDocument = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newMedia = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name,
          size: asset.size,
        }));
        onMediaChange([...media, ...newMedia].slice(0, maxCount));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select documents');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => {
    onMediaChange(media.filter((_, i) => i !== index));
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image')) return 'image-outline';
    if (type?.startsWith('video')) return 'videocam-outline';
    if (type === 'application/pdf') return 'document-text-outline';
    return 'document-outline';
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaList}>
        {media.map((item, index) => (
          <View key={index} style={styles.mediaItem}>
            {item.type?.startsWith('image') ? (
              <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
            ) : (
              <View style={[styles.mediaPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name={getFileIcon(item.type)} size={32} color={theme.colors.primary} />
                {item.type?.startsWith('video') && (
                  <Ionicons name="play-circle" size={24} color={theme.colors.primary} style={styles.playIcon} />
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMedia(index)}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
            {item.type?.startsWith('video') && (
              <View style={styles.videoBadge}>
                <Ionicons name="videocam" size={12} color="#fff" />
              </View>
            )}
          </View>
        ))}
        
        {media.length < maxCount && !uploading && (
          <View style={styles.addButtons}>
            <TouchableOpacity style={styles.addButton} onPress={handleCamera}>
              <Ionicons name="camera" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.addButton} onPress={handleGallery}>
              <Ionicons name="images" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleDocument}>
              <Ionicons name="document" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Document</Text>
            </TouchableOpacity>
          </View>
        )}

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.uploadingText}>Loading...</Text>
          </View>
        )}
      </ScrollView>
      
      <Text style={styles.counter}>
        {media.length} / {maxCount} files selected
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  mediaList: {
    flexDirection: 'row',
  },
  mediaItem: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  addButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  uploadingContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  uploadingText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  counter: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default MediaPicker;