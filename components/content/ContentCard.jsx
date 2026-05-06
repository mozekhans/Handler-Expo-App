// components/ContentCard.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { STATUS_COLORS, PLATFORM_ICONS } from '../../utils/constants';
import StatusBadge from './StatusBadge';

const ContentCard = ({ content, onDelete, onPublish }) => {
  const router = useRouter();
  
  const getPreviewText = () => {
    if (content.content?.text) {
      return content.content.text.length > 100 
        ? `${content.content.text.substring(0, 100)}...` 
        : content.content.text;
    }
    return 'No content preview';
  };

  const getPreviewImage = () => {
    if (content.content?.media && content.content.media.length > 0) {
      return content.content.media[0].url;
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/content/${content._id}`)}
      activeOpacity={0.7}
    >
      {getPreviewImage() && (
        <Image source={{ uri: getPreviewImage() }} style={styles.previewImage} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {content.title || 'Untitled'}
          </Text>
          <StatusBadge status={content.status} />
        </View>
        
        <Text style={styles.preview} numberOfLines={2}>
          {getPreviewText()}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.platforms}>
            {content.platforms && content.platforms.slice(0, 3).map((p, idx) => (
              <View key={idx} style={styles.platformBadge}>
                <Text style={styles.platformText}>{p.platform}</Text>
              </View>
            ))}
            {content.platforms && content.platforms.length > 3 && (
              <Text style={styles.moreText}>+{content.platforms.length - 3}</Text>
            )}
          </View>
          
          <View style={styles.actions}>
            <Text style={styles.date}>
              {content.status === 'scheduled' 
                ? `Scheduled: ${formatDate(content.platforms?.[0]?.scheduledFor)}`
                : `Created: ${formatDate(content.createdAt)}`}
            </Text>
            
            <View style={styles.buttonGroup}>
              {content.status === 'draft' && (
                <TouchableOpacity
                  style={[styles.button, styles.publishButton]}
                  onPress={() => onPublish?.(content._id)}
                >
                  <Text style={styles.buttonText}>Publish</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => router.push(`/content/edit/${content._id}`)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete?.(content._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  preview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
  },
  platforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  platformBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  platformText: {
    fontSize: 12,
    color: '#666',
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  publishButton: {
    backgroundColor: '#28a745',
  },
  editButton: {
    backgroundColor: '#17a2b8',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ContentCard;