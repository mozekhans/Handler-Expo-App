// components/MediaPicker.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MEDIA_TYPES } from '../../utils/constants';

const MediaPicker = ({ media = [], onMediaSelect, multiple = true, maxFiles = 10 }) => {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access media library');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      allowsMultipleSelection: multiple,
      selectionLimit: maxFiles - media.length,
    });

    if (!result.canceled && result.assets) {
      const newMedia = result.assets.map(asset => ({
        type: asset.type === 'video' ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE,
        url: asset.uri,
        thumbnail: asset.uri,
        size: asset.fileSize,
        dimensions: {
          width: asset.width,
          height: asset.height,
        },
        duration: asset.duration,
      }));

      const updatedMedia = multiple ? [...media, ...newMedia] : newMedia;
      onMediaSelect(updatedMedia.slice(0, maxFiles));
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
      copyToCacheDirectory: true,
      multiple: multiple,
    });

    if (!result.canceled && result.assets) {
      const newMedia = result.assets.map(asset => ({
        type: getMediaType(asset.mimeType),
        url: asset.uri,
        name: asset.name,
        size: asset.size,
        format: asset.mimeType,
      }));

      const updatedMedia = multiple ? [...media, ...newMedia] : newMedia;
      onMediaSelect(updatedMedia.slice(0, maxFiles));
    }
  };

  const getMediaType = (mimeType) => {
    if (mimeType?.startsWith('image/')) return MEDIA_TYPES.IMAGE;
    if (mimeType?.startsWith('video/')) return MEDIA_TYPES.VIDEO;
    if (mimeType?.startsWith('audio/')) return MEDIA_TYPES.AUDIO;
    return MEDIA_TYPES.DOCUMENT;
  };

  const removeMedia = (index) => {
    const newMedia = media.filter((_, i) => i !== index);
    onMediaSelect(newMedia);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
        {media.map((item, index) => (
          <View key={index} style={styles.previewContainer}>
            {item.type === MEDIA_TYPES.IMAGE && (
              <Image source={{ uri: item.url }} style={styles.previewImage} />
            )}
            {item.type === MEDIA_TYPES.VIDEO && (
              <View style={styles.videoPreview}>
                <Image source={{ uri: item.thumbnail || item.url }} style={styles.previewImage} />
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoIcon}>▶️</Text>
                  {item.duration && (
                    <Text style={styles.duration}>
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </Text>
                  )}
                </View>
              </View>
            )}
            {item.type === MEDIA_TYPES.AUDIO && (
              <View style={styles.audioPreview}>
                <Text style={styles.audioIcon}>🎵</Text>
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.name || 'Audio file'}
                </Text>
              </View>
            )}
            {item.type === MEDIA_TYPES.DOCUMENT && (
              <View style={styles.documentPreview}>
                <Text style={styles.documentIcon}>📄</Text>
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.name || 'Document'}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMedia(index)}
            >
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
            
            {item.size && (
              <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
            )}
          </View>
        ))}
        
        {media.length < maxFiles && (
          <View style={styles.addContainer}>
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Text style={styles.addIcon}>📷</Text>
              <Text style={styles.addText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.addButton} onPress={pickDocument}>
              <Text style={styles.addIcon}>📁</Text>
              <Text style={styles.addText}>Files</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <Text style={styles.counter}>
        {media.length}/{maxFiles} files selected
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  previewScroll: {
    flexDirection: 'row',
  },
  previewContainer: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 8,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  videoPreview: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 32,
  },
  duration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  audioPreview: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  documentPreview: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  fileSize: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addIcon: {
    fontSize: 24,
  },
  addText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  counter: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default MediaPicker;