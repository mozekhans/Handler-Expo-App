import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEngagement } from '../../../../../../hooks/useEngagement';
import { useAI } from '../../../../../../hooks/useAI';
import { theme } from '../../../../../../styles/theme';
import { formatRelativeTime } from '../../../../../../utils/formatters';
import Header from '../../../../../../components/common/Header';
import Avatar from '../../../../../../components/common/Avatar';
import LoadingIndicator from '../../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../../components/common/ErrorMessage';
import EmptyState from '../../../../../../components/common/EmptyState';

export default function CommentsScreen() {
  const { id: postId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { getComments, replyToComment, likeComment } = useEngagement();
  const { generateResponse } = useAI();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await replyToComment(commentId, replyText);
      setReplyText('');
      setReplyTo(null);
      loadComments();
    } catch (err) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await likeComment(commentId);
      loadComments();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleAIGenerate = async () => {
    if (!replyTo) return;

    try {
      setAiGenerating(true);
      const comment = comments.find(c => c.id === replyTo);
      const suggestion = await generateResponse(comment.text, {
        type: 'comment',
        context: 'social media comment',
      });
      setReplyText(suggestion);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Avatar
          source={item.user?.avatar}
          name={item.user?.name}
          size={36}
        />
        <View style={styles.commentInfo}>
          <View style={styles.commentUser}>
            <Text style={styles.userName}>{item.user?.name}</Text>
            <Text style={styles.userHandle}>@{item.user?.username}</Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
          <View style={styles.commentFooter}>
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => handleLike(item.id)}
            >
              <Ionicons
                name="thumbs-up-outline"
                size={14}
                color={item.liked ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={styles.actionText}>{item.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.commentAction}
              onPress={() => setReplyTo(item.id)}
            >
              <Ionicons name="return-up-back-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
            <Text style={styles.commentTime}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map((reply) => (
            <View key={reply.id} style={styles.replyContainer}>
              <Avatar
                source={reply.user?.avatar}
                name={reply.user?.name}
                size={28}
              />
              <View style={styles.replyInfo}>
                <Text style={styles.replyUserName}>{reply.user?.name}</Text>
                <Text style={styles.replyText}>{reply.text}</Text>
                <Text style={styles.replyTime}>
                  {formatRelativeTime(reply.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {replyTo === item.id && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor={theme.colors.placeholder}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity
            style={styles.aiReplyButton}
            onPress={handleAIGenerate}
            disabled={aiGenerating}
          >
            <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendReplyButton, !replyText.trim() && styles.sendReplyDisabled]}
            onPress={() => handleReply(item.id)}
            disabled={!replyText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <LoadingIndicator fullScreen text="Loading comments..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadComments}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Comments" showBack={true} />

      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-outline"
            title="No Comments"
            message="Be the first to comment"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  commentContainer: {
    marginBottom: theme.spacing.md,
  },
  commentHeader: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  commentInfo: {
    flex: 1,
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userHandle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  repliesContainer: {
    marginLeft: 48,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  replyContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  replyInfo: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  replyUserName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 2,
  },
  replyTime: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: theme.spacing.sm,
    marginLeft: 48,
    gap: theme.spacing.xs,
  },
  replyInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 40,
  },
  aiReplyButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  sendReplyButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendReplyDisabled: {
    backgroundColor: theme.colors.border,
  },
});