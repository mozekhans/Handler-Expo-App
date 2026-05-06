import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDistance } from 'date-fns';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

const PostCard = ({ post, onPress }) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return 'facebook';
      case 'instagram': return 'instagram';
      case 'twitter': return 'twitter';
      case 'linkedin': return 'linkedin';
      case 'tiktok': return 'music-note';
      default: return 'public';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return theme.colors.success;
      case 'scheduled': return theme.colors.info;
      case 'draft': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {post.media && post.media.length > 0 && (
        <Image source={{ uri: post.media[0].url }} style={styles.media} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(post.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(post.status) }]}>
                {post.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.preview} numberOfLines={3}>
          {post.content?.text}
        </Text>

        <View style={styles.footer}>
          <View style={styles.platforms}>
            {post.platforms?.map((platform, index) => (
              <Icon
                key={index}
                name={getPlatformIcon(platform)}
                size={16}
                color={theme.colors.textSecondary}
                style={styles.platformIcon}
              />
            ))}
          </View>

          <Text style={styles.time}>
            {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
          </Text>
        </View>

        {post.metrics && (
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Icon name="thumb-up" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metricText}>{post.metrics.likes || 0}</Text>
            </View>
            <View style={styles.metric}>
              <Icon name="comment" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metricText}>{post.metrics.comments || 0}</Text>
            </View>
            <View style={styles.metric}>
              <Icon name="share" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metricText}>{post.metrics.shares || 0}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  preview: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platforms: {
    flexDirection: 'row',
  },
  platformIcon: {
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});

export default PostCard;