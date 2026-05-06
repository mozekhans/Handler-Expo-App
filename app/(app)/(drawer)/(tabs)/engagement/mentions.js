import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEngagement } from '../../../../../hooks/useEngagement';
import { useAI } from '../../../../../hooks/useAI';
import { theme } from '../../../../../styles/theme';
import { formatRelativeTime } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Avatar from '../../../../../components/common/Avatar';
import Badge from '../../../../../components/common/Badge';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import EmptyState from '../../../../../components/common/EmptyState';
import Tabs from '../../../../../components/common/Tabs';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Replied', value: 'replied' },
];

export default function MentionsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [mentions, setMentions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { getMentions, replyToMention } = useEngagement();
  const { generateResponse } = useAI();

  useEffect(() => {
    loadMentions();
  }, [activeTab]);

  const loadMentions = async () => {
    try {
      setLoading(true);
      const filter = tabs[activeTab]?.value;
      const data = await getMentions({ filter });
      setMentions(data);
    } catch (err) {
      setError(err.message || 'Failed to load mentions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMentions();
  };

  const handleReply = async (mentionId) => {
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await replyToMention(mentionId, replyText);
      setReplyText('');
      setReplyTo(null);
      loadMentions();
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleAIGenerate = async (mention) => {
    try {
      setAiGenerating(true);
      const suggestion = await generateResponse(mention.text, {
        type: 'mention',
        context: 'social media mention',
      });
      setReplyText(suggestion);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: 'logo-facebook',
      instagram: 'logo-instagram',
      twitter: 'logo-twitter',
      linkedin: 'logo-linkedin',
    };
    return icons[platform] || 'at-outline';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: '#1877f2',
      instagram: '#e4405f',
      twitter: '#1da1f2',
      linkedin: '#0077b5',
    };
    return colors[platform] || theme.colors.primary;
  };

  const renderMentionItem = ({ item }) => (
    <View style={styles.mentionCard}>
      <View style={styles.mentionHeader}>
        <Avatar
          source={item.user?.avatar}
          name={item.user?.name}
          size={40}
        />
        <View style={styles.mentionInfo}>
          <View style={styles.mentionUser}>
            <Text style={styles.userName}>{item.user?.name}</Text>
            <Text style={styles.userHandle}>@{item.user?.username}</Text>
            <Badge
              dot
              color={!item.read ? theme.colors.error : 'transparent'}
              size="sm"
            />
          </View>
          <View style={styles.mentionMeta}>
            <Ionicons
              name={getPlatformIcon(item.platform)}
              size={12}
              color={getPlatformColor(item.platform)}
            />
            <Text style={styles.mentionTime}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.mentionText}>{item.text}</Text>

      {item.reply ? (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Your reply:</Text>
          <Text style={styles.replyText}>{item.reply.text}</Text>
        </View>
      ) : replyTo === item.id ? (
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
            style={styles.aiButton}
            onPress={() => handleAIGenerate(item)}
            disabled={aiGenerating}
          >
            <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
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
      ) : (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setReplyTo(item.id)}
        >
          <Ionicons name="return-up-back-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading mentions..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadMentions}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mentions" showBack={true} />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        style={styles.tabs}
      />

      <FlatList
        data={mentions}
        renderItem={renderMentionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            icon="at-outline"
            title="No Mentions"
            message="When someone mentions you, it will appear here"
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
  tabs: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  mentionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mentionHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  mentionInfo: {
    flex: 1,
  },
  mentionUser: {
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
  mentionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mentionTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  mentionText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  replyContainer: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  replyLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: theme.spacing.xs,
    gap: 4,
  },
  replyButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  replyInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 40,
  },
  aiButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});