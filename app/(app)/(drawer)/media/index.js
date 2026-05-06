import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useBusiness } from '../../../../hooks/useBusiness';
import uploadService from '../../../../services/uploadService';
import { theme } from '../../../../styles/theme';
import { formatFileSize, formatDate } from '../../../../utils/formatters';
import Header from '../../../../components/common/Header';
import Button from '../../../../components/common/Button';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import EmptyState from '../../../../components/common/EmptyState';
import SearchBar from '../../../../components/common/SearchBar';
import Tabs from '../../../../components/common/Tabs';
import MediaPicker from '../../../../components/MediaPicker';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Documents', value: 'document' },
];

export default function MediaLibraryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [media, setMedia] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { currentBusiness } = useBusiness();

  useEffect(() => {
    loadMedia();
  }, [currentBusiness, activeTab]);

  useFocusEffect(
    useCallback(() => {
      loadMedia();
    }, [])
  );

  const loadMedia = async () => {
    if (!currentBusiness) return;
    
    try {
      setLoading(true);
      setError(null);
      const type = tabs[activeTab]?.value === 'all' ? undefined : tabs[activeTab]?.value;
      const data = await uploadService.getMedia(currentBusiness.id, {
        type,
        search: searchQuery || undefined,
      });
      setMedia(data.media || []);
    } catch (err) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMedia();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadMedia();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      setUploading(true);
      for (const file of selectedFiles) {
        await uploadService.uploadFile(file);
      }
      setUploadModalVisible(false);
      setSelectedFiles([]);
      loadMedia();
      Alert.alert('Success', `${selectedFiles.length} file(s) uploaded successfully`);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaItem) => {
    Alert.alert(
      'Delete Media',
      `Are you sure you want to delete "${mediaItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await uploadService.deleteMedia(mediaItem.id);
              loadMedia();
              Alert.alert('Success', 'Media deleted successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete media');
            }
          },
        },
      ]
    );
  };

  const getMediaIcon = (type) => {
    if (type?.startsWith('image')) return 'image-outline';
    if (type?.startsWith('video')) return 'videocam-outline';
    return 'document-outline';
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => {
        setSelectedMedia(item);
        setPreviewVisible(true);
      }}
      onLongPress={() => handleDelete(item)}
    >
      {item.type?.startsWith('image') ? (
        <Image source={{ uri: item.url }} style={styles.mediaThumbnail} />
      ) : (
        <View style={[styles.mediaPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={getMediaIcon(item.type)} size={32} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.mediaInfo}>
        <Text style={styles.mediaName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.mediaMeta}>
          {formatFileSize(item.size)} • {formatDate(item.createdAt, 'MMM d, yyyy')}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading media..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadMedia}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Media Library"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => setUploadModalVisible(true)}>
            <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search media..."
        />
      </View>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        style={styles.tabs}
      />

      <FlatList
        data={media}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="images-outline"
            title="No Media"
            message={searchQuery ? "No results found" : "Upload your first media file"}
            actionText={!searchQuery ? "Upload Media" : undefined}
            onAction={() => setUploadModalVisible(true)}
          />
        }
      />

      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>{selectedMedia?.name}</Text>
              <TouchableOpacity onPress={() => setPreviewVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            {selectedMedia?.type?.startsWith('image') ? (
              <Image
                source={{ uri: selectedMedia?.url }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Ionicons name={getMediaIcon(selectedMedia?.type)} size={64} color={theme.colors.primary} />
                <Text style={styles.previewType}>{selectedMedia?.type}</Text>
              </View>
            )}
            <View style={styles.previewInfo}>
              <Text style={styles.previewMeta}>
                Size: {formatFileSize(selectedMedia?.size)}
              </Text>
              <Text style={styles.previewMeta}>
                Uploaded: {formatDate(selectedMedia?.createdAt, 'MMM d, yyyy h:mm a')}
              </Text>
            </View>
            <View style={styles.previewActions}>
              <Button
                title="Delete"
                onPress={() => {
                  setPreviewVisible(false);
                  handleDelete(selectedMedia);
                }}
                variant="outline"
                color="error"
                style={styles.previewButton}
              />
              <Button
                title="Use in Post"
                onPress={() => {
                  setPreviewVisible(false);
                  router.push('/content/create');
                }}
                style={styles.previewButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={uploadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.uploadOverlay}>
          <View style={styles.uploadContainer}>
            <View style={styles.uploadHeader}>
              <Text style={styles.uploadTitle}>Upload Media</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <MediaPicker
              media={selectedFiles}
              onMediaChange={setSelectedFiles}
              maxCount={10}
            />
            {uploading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
            <View style={styles.uploadActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setUploadModalVisible(false);
                  setSelectedFiles([]);
                }}
                variant="outline"
                style={styles.uploadButton}
              />
              <Button
                title={`Upload (${selectedFiles.length})`}
                onPress={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                loading={uploading}
                style={styles.uploadButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  tabs: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  mediaPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  mediaInfo: {
    flex: 1,
  },
  mediaName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  mediaMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  previewContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.background,
  },
  previewPlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  previewType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  previewInfo: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  previewActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewButton: {
    flex: 1,
  },
  uploadOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'flex-end',
  },
  uploadContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  uploadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  uploadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  uploadActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  uploadButton: {
    flex: 1,
  },
});