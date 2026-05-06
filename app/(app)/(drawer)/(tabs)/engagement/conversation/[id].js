import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const flatListRef = useRef(null);
  const { getMessages, sendMessage } = useEngagement();
  const { generateResponse } = useAI();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(id);
      setMessages(data.messages);
      setConversation(data.conversation);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const sent = await sendMessage(id, newMessage);
      setMessages(prev => [...prev, sent]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleAIGenerate = async () => {
    try {
      setAiGenerating(true);
      const context = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const suggestion = await generateResponse(context, { type: 'conversation' });
      setNewMessage(suggestion);
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isOutgoing = item.isOutgoing;
    
    return (
      <View style={[
        styles.messageContainer,
        isOutgoing ? styles.outgoingContainer : styles.incomingContainer,
      ]}>
        {!isOutgoing && (
          <Avatar
            source={item.user?.avatar}
            name={item.user?.name}
            size={32}
            style={styles.messageAvatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isOutgoing ? styles.outgoingText : styles.incomingText,
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isOutgoing ? styles.outgoingTime : styles.incomingTime,
          ]}>
            {formatRelativeTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingIndicator fullScreen text="Loading conversation..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadMessages}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={conversation?.user?.name || 'Conversation'}
        showBack={true}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.placeholder}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleAIGenerate}
            disabled={aiGenerating}
          >
            <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  incomingContainer: {
    justifyContent: 'flex-start',
  },
  outgoingContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    marginRight: theme.spacing.xs,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  incomingBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  incomingText: {
    color: theme.colors.text,
  },
  outgoingText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  incomingTime: {
    color: theme.colors.textSecondary,
  },
  outgoingTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    maxHeight: 100,
  },
  aiButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});