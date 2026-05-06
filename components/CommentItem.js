import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatDistance } from 'date-fns';
import { theme } from '../styles/theme';

const CommentItem = ({ comment, onReply, onLike, onReport }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return 'facebook';
      case 'instagram': return 'instagram';
      case 'twitter': return 'twitter';
      default: return 'public';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return theme.colors.success;
      case 'negative': return theme.colors.error;
      default: return theme.colors.warning;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentContainer}>
        <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{comment.user.name}</Text>
              <Text style={styles.userHandle}>@{comment.user.username}</Text>
              {comment.platform && (
                <Icon
                  name={getPlatformIcon(comment.platform)}
                  size={14}
                  color={theme.colors.textSecondary}
                  style={styles.platformIcon}
                />
              )}
            </View>
            
            <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(comment.sentiment) + '20' }]}>
              <Text style={[styles.sentimentText, { color: getSentimentColor(comment.sentiment) }]}>
                {comment.sentiment?.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.text}>{comment.text}</Text>

          {comment.media && comment.media.length > 0 && (
            <Image source={{ uri: comment.media[0].url }} style={styles.commentMedia} />
          )}

          <View style={styles.footer}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.action} onPress={() => onLike(comment.id)}>
                <Icon name="thumb-up" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.actionText}>{comment.likes || 0}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.action} onPress={() => setShowReplyInput(!showReplyInput)}>
                <Icon name="reply" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>

              {comment.replies?.length > 0 && (
                <TouchableOpacity style={styles.action} onPress={() => setShowReplies(!showReplies)}>
                  <Icon name={showReplies ? 'expand-less' : 'expand-more'} size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.actionText}>{comment.replies.length} replies</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.time}>
              {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
            </Text>
          </View>

          {showReplyInput && (
            <View style={styles.replyInput}>
              <TextInput
                style={styles.input}
                placeholder="Write a reply..."
                placeholderTextColor={theme.colors.textSecondary}
                value={replyText}
                onChangeText={setReplyText}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleReply}>
                <Icon name="send" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {showReplies && comment.replies && (
        <View style={styles.replies}>
          {comment.replies.map((reply) => (
            <View key={reply.id} style={styles.replyContainer}>
              <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
              <View style={styles.replyContent}>
                <View style={styles.replyHeader}>
                  <Text style={styles.replyUserName}>{reply.user.name}</Text>
                  <Text style={styles.replyTime}>
                    {formatDistance(new Date(reply.createdAt), new Date(), { addSuffix: true })}
                  </Text>
                </View>
                <Text style={styles.replyText}>{reply.text}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 4,
  },
  userHandle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  platformIcon: {
    marginLeft: 4,
  },
  sentimentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  commentMedia: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  replyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 40,
  },
  sendButton: {
    padding: 8,
  },
  replies: {
    marginLeft: 52,
    marginTop: 12,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  replyUserName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  replyTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  replyText: {
    fontSize: 13,
    color: theme.colors.text,
  },
});

export default CommentItem;