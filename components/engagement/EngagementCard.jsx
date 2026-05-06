// components/engagement/EngagementCard.js
import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { 
  getSentimentColor, 
  getSentimentBgColor, 
  getPriorityColor, 
  getPlatformIcon, 
  getPlatformColor,
  timeAgo,
  truncateText 
} from '../../utils/engagementHelpers';

const EngagementCard = memo(({ 
  engagement, 
  onPress, 
  onLongPress, 
  selected = false,
  selectionMode = false 
}) => {
  if (!engagement) return null;

  const {
    type,
    platform,
    user,
    content,
    sentiment,
    priority,
    read,
    replied,
    createdAt,
    assignedTo,
    tags,
    isSpam,
  } = engagement;

  const sentimentColor = getSentimentColor(sentiment);
  const sentimentBgColor = getSentimentBgColor(sentiment);
  const priorityColor = getPriorityColor(priority);
  const platformIcon = getPlatformIcon(platform);
  const platformColor = getPlatformColor(platform);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !read && styles.unread,
        selected && styles.selected,
        isSpam && styles.spam,
      ]}
      onPress={() => onPress?.(engagement)}
      onLongPress={() => onLongPress?.(engagement)}
      activeOpacity={0.7}
      delayLongPress={500}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ 
              uri: user?.avatar || 'https://via.placeholder.com/40',
              cache: 'force-cache'
            }}
            style={styles.avatar}
            defaultSource={require('../../assets/placeholder-avatar.png')}
          />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || user?.username || 'Unknown User'}
              </Text>
              {user?.verified && (
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
              )}
            </View>
            <View style={styles.metaRow}>
              <View style={[styles.platformBadge, { backgroundColor: platformColor + '15' }]}>
                <Ionicons name={platformIcon} size={12} color={platformColor} />
                <Text style={[styles.platformText, { color: platformColor }]}>
                  {platform}
                </Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.timestamp}>{timeAgo(createdAt)}</Text>
              {type && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.typeText}>{type}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.indicators}>
          {/* Selection Checkbox */}
          {selectionMode && (
            <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
              {selected && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          )}
          
          {/* Unread Dot */}
          {!read && !selectionMode && (
            <View style={styles.unreadDot} />
          )}
          
          {/* Priority Badge */}
          {priority && (
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {priority.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      {content?.text && (
        <Text style={styles.contentText} numberOfLines={3}>
          {truncateText(content.text, 200)}
        </Text>
      )}

      {/* Media Preview */}
      {content?.media && content.media.length > 0 && (
        <View style={styles.mediaPreview}>
          {content.media.slice(0, 3).map((mediaItem, index) => (
            <Image
              key={index}
              source={{ uri: mediaItem.thumbnail || mediaItem.url }}
              style={[
                styles.mediaThumbnail,
                content.media.length === 1 && styles.mediaSingle,
              ]}
            />
          ))}
          {content.media.length > 3 && (
            <View style={styles.mediaMore}>
              <Text style={styles.mediaMoreText}>+{content.media.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Hashtags */}
      {content?.hashtags && content.hashtags.length > 0 && (
        <View style={styles.hashtagsRow}>
          {content.hashtags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={styles.hashtag}>#{tag}</Text>
          ))}
          {content.hashtags.length > 3 && (
            <Text style={styles.hashtagMore}>+{content.hashtags.length - 3}</Text>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.tags}>
          {/* Sentiment Badge */}
          {sentiment && (
            <View style={[styles.sentimentBadge, { backgroundColor: sentimentBgColor }]}>
              <View style={[styles.sentimentDot, { backgroundColor: sentimentColor }]} />
              <Text style={[styles.sentimentText, { color: sentimentColor }]}>
                {sentiment.replace('_', ' ')}
              </Text>
            </View>
          )}

          {/* Intent Badge */}
          {engagement.intent && engagement.intent !== 'general' && (
            <View style={styles.intentBadge}>
              <Ionicons 
                name={
                  engagement.intent === 'question' ? 'help-circle' :
                  engagement.intent === 'complaint' ? 'warning' :
                  engagement.intent === 'praise' ? 'star' :
                  engagement.intent === 'suggestion' ? 'bulb' :
                  engagement.intent === 'feedback' ? 'chatbubble' :
                  'information-circle'
                } 
                size={12} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles.intentText}>{engagement.intent}</Text>
            </View>
          )}
        </View>

        {/* Assigned To */}
        {assignedTo && (
          <View style={styles.assignedBadge}>
            <Image
              source={{ uri: assignedTo.avatar || 'https://via.placeholder.com/20' }}
              style={styles.assignedAvatar}
            />
            <Text style={styles.assignedText} numberOfLines={1}>
              {assignedTo.firstName}
            </Text>
          </View>
        )}
      </View>

      {/* Replied Banner */}
      {replied && (
        <View style={styles.repliedBanner}>
          <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
          <Text style={styles.repliedText}>Replied</Text>
          {engagement.reply?.aiGenerated && (
            <View style={styles.aiBadge}>
              <Ionicons name="flash" size={10} color="#FF9800" />
              <Text style={styles.aiText}>AI</Text>
            </View>
          )}
        </View>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {tags.length > 3 && (
            <Text style={styles.tagMore}>+{tags.length - 3}</Text>
          )}
        </View>
      )}

      {/* Spam Indicator */}
      {isSpam && (
        <View style={styles.spamBanner}>
          <Ionicons name="flag" size={12} color="#F44336" />
          <Text style={styles.spamText}>Marked as spam</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '08',
  },
  selected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '15',
    borderWidth: 2,
  },
  spam: {
    opacity: 0.7,
    backgroundColor: '#F4433608',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: theme.colors.background,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  platformText: {
    fontSize: 11,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  typeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contentText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  mediaPreview: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  mediaThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  mediaSingle: {
    width: '100%',
    height: 200,
  },
  mediaMore: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  hashtag: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  hashtagMore: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  sentimentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  intentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    gap: 4,
  },
  intentText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
  assignedText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  repliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    gap: 4,
  },
  repliedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF980015',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },
  aiText: {
    fontSize: 9,
    color: '#FF9800',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tagMore: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    alignSelf: 'center',
  },
  spamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4433620',
    gap: 4,
  },
  spamText: {
    fontSize: 11,
    color: '#F44336',
    fontWeight: '500',
  },
});

export default EngagementCard;