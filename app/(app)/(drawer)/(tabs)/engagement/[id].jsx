// app/engagement/[id].js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../components/common/Header';
import AIResponseGenerator from '../../../../../components/engagement/AIResponseGenerator';
import ActionSheet from '../../../../../components/engagement/ActionSheet';
import engagementService from '../../../../../services/engagementService';
import { useEngagementActions } from '../../../../../hooks/useEngagementActions';
import { useAuth } from '../../../../../context/AuthContext';
import { theme } from '../../../../../styles/theme';

export default function EngagementDetailScreen() {
  const { id, businessId } = useLocalSearchParams();
  const { business } = useAuth();
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    actionLoading,
    replyToEngagement,
    generateAIResponse,
    assignEngagement,
    markAsSpam,
    markAsRead,
  } = useEngagementActions(businessId || business?._id);

  useEffect(() => {
    fetchEngagementDetails();
  }, [id]);

  const fetchEngagementDetails = async () => {
    try {
      setLoading(true);
      const response = await engagementService.getEngagement(
        businessId || business._id,
        id
      );
      setEngagement(response.engagement);

      // Mark as read if not already
      if (!response.engagement.read) {
        await markAsRead(id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load engagement details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setSending(true);
    try {
      await replyToEngagement(id, replyText.trim());
      setReplyText('');
      await fetchEngagementDetails();
      Alert.alert('Success', 'Reply sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleAIResponse = async () => {
    setShowAI(true);
  };

  const handleUseAIResponse = (response) => {
    setReplyText(response);
    setShowAI(false);
  };

  const handleAssign = () => {
    router.push({
      pathname: `/engagement/assign/${id}`,
      params: { businessId: businessId || business._id }
    });
  };

  const handleMarkSpam = () => {
    Alert.alert(
      'Mark as Spam',
      'Are you sure you want to mark this engagement as spam?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Spam',
          style: 'destructive',
          onPress: async () => {
            try {
              await markAsSpam(id);
              Alert.alert('Success', 'Engagement marked as spam', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to mark as spam');
            }
          },
        },
      ]
    );
  };

  const handleAddNote = () => {
    router.push({
      pathname: `/engagement/add-note/${id}`,
      params: { businessId: businessId || business._id }
    });
  };

  const handleViewConversation = () => {
    router.push({
      pathname: `/engagement/conversation/${id}`,
      params: { businessId: businessId || business._id }
    });
  };

  const actionItems = [
    {
      label: 'Assign to Team Member',
      icon: 'person-add-outline',
      onPress: handleAssign,
    },
    {
      label: 'View Conversation',
      icon: 'chatbubble-ellipses-outline',
      onPress: handleViewConversation,
    },
    {
      label: 'Generate AI Response',
      icon: 'flash-outline',
      onPress: handleAIResponse,
    },
    {
      label: 'Add Internal Note',
      icon: 'document-text-outline',
      onPress: handleAddNote,
    },
    {
      label: 'Mark as Spam',
      icon: 'warning-outline',
      onPress: handleMarkSpam,
      destructive: true,
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Engagement" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!engagement) {
    return (
      <View style={styles.container}>
        <Header title="Engagement" showBack />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.errorText}>Engagement not found</Text>
        </View>
      </View>
    );
  }

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: '#4CAF50',
      negative: '#F44336',
      neutral: '#9E9E9E',
      very_positive: '#2E7D32',
      very_negative: '#C62828',
      mixed: '#FF9800',
    };
    return colors[sentiment] || colors.neutral;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Engagement"
        showBack
        rightComponent={
          <TouchableOpacity 
            onPress={() => setShowActions(true)}
            style={styles.menuButton}
          >
            <Ionicons 
              name="ellipsis-vertical" 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Section */}
          <View style={styles.userSection}>
            <Image
              source={{ 
                uri: engagement.user?.avatar || 'https://via.placeholder.com/50' 
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {engagement.user?.name || engagement.user?.username || 'Unknown'}
              </Text>
              <View style={styles.userMeta}>
                <Ionicons 
                  name={`logo-${engagement.platform}`} 
                  size={14} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={styles.platformText}>
                  via {engagement.platform}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.timestamp}>
                  {new Date(engagement.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
            
            {/* Priority Badge */}
            {engagement.priority && (
              <View style={[
                styles.priorityBadge,
                { 
                  backgroundColor: 
                    engagement.priority === 'urgent' ? '#F4433620' :
                    engagement.priority === 'high' ? '#FF980020' :
                    '#4CAF5020'
                }
              ]}>
                <Text style={[
                  styles.priorityText,
                  {
                    color:
                      engagement.priority === 'urgent' ? '#F44336' :
                      engagement.priority === 'high' ? '#FF9800' :
                      '#4CAF50'
                  }
                ]}>
                  {engagement.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Message Content */}
          <View style={styles.messageSection}>
            <Text style={styles.messageText}>
              {engagement.content?.text || 'No content'}
            </Text>
            
            {engagement.content?.media?.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.mediaScroll}
              >
                {engagement.content.media.map((media, index) => (
                  <Image
                    key={index}
                    source={{ uri: media.url }}
                    style={styles.mediaImage}
                  />
                ))}
              </ScrollView>
            )}

            {engagement.content?.hashtags?.length > 0 && (
              <View style={styles.hashtags}>
                {engagement.content.hashtags.map((tag, index) => (
                  <Text key={index} style={styles.hashtag}>
                    #{tag}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* AI Analysis */}
          {engagement.sentiment && (
            <View style={styles.analysisSection}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <View style={styles.analysisGrid}>
                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Sentiment</Text>
                  <View style={[
                    styles.sentimentBadge,
                    { backgroundColor: getSentimentColor(engagement.sentiment) + '20' }
                  ]}>
                    <View style={[
                      styles.sentimentDot,
                      { backgroundColor: getSentimentColor(engagement.sentiment) }
                    ]} />
                    <Text style={[
                      styles.sentimentText,
                      { color: getSentimentColor(engagement.sentiment) }
                    ]}>
                      {engagement.sentiment.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Intent</Text>
                  <Text style={styles.analysisValue}>
                    {engagement.intent || 'General'}
                  </Text>
                </View>

                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Urgency</Text>
                  <Text style={styles.analysisValue}>
                    {engagement.urgency?.level || 'Low'}
                  </Text>
                </View>

                <View style={styles.analysisItem}>
                  <Text style={styles.analysisLabel}>Language</Text>
                  <Text style={styles.analysisValue}>
                    {engagement.language || 'English'}
                  </Text>
                </View>
              </View>

              {/* Sentiment Score Bars */}
              {engagement.sentimentScore && (
                <View style={styles.scoresContainer}>
                  <View style={styles.scoreItem}>
                    <View style={styles.scoreHeader}>
                      <Text style={styles.scoreLabel}>Positive</Text>
                      <Text style={styles.scoreValue}>
                        {Math.round(engagement.sentimentScore.positive * 100)}%
                      </Text>
                    </View>
                    <View style={styles.scoreBar}>
                      <View style={[
                        styles.scoreFill,
                        { 
                          width: `${engagement.sentimentScore.positive * 100}%`,
                          backgroundColor: '#4CAF50'
                        }
                      ]} />
                    </View>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <View style={styles.scoreHeader}>
                      <Text style={styles.scoreLabel}>Neutral</Text>
                      <Text style={styles.scoreValue}>
                        {Math.round(engagement.sentimentScore.neutral * 100)}%
                      </Text>
                    </View>
                    <View style={styles.scoreBar}>
                      <View style={[
                        styles.scoreFill,
                        { 
                          width: `${engagement.sentimentScore.neutral * 100}%`,
                          backgroundColor: '#9E9E9E'
                        }
                      ]} />
                    </View>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <View style={styles.scoreHeader}>
                      <Text style={styles.scoreLabel}>Negative</Text>
                      <Text style={styles.scoreValue}>
                        {Math.round(engagement.sentimentScore.negative * 100)}%
                      </Text>
                    </View>
                    <View style={styles.scoreBar}>
                      <View style={[
                        styles.scoreFill,
                        { 
                          width: `${engagement.sentimentScore.negative * 100}%`,
                          backgroundColor: '#F44336'
                        }
                      ]} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Replies/Conversation */}
          {engagement.replies?.length > 0 && (
            <View style={styles.repliesSection}>
              <Text style={styles.sectionTitle}>
                Replies ({engagement.replies.length})
              </Text>
              {engagement.replies.map((reply, index) => (
                <View key={index} style={styles.replyCard}>
                  <View style={styles.replyHeader}>
                    <Ionicons
                      name={reply.aiGenerated ? 'flash' : 'person'}
                      size={16}
                      color={reply.aiGenerated ? '#FF9800' : theme.colors.primary}
                    />
                    <Text style={styles.replyLabel}>
                      {reply.aiGenerated ? 'AI Generated Reply' : 'Manual Reply'}
                    </Text>
                    <Text style={styles.replyTime}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.replyText}>
                    {reply.content?.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Internal Notes */}
          {engagement.notes?.length > 0 && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>
                Internal Notes ({engagement.notes.length})
              </Text>
              {engagement.notes.map((note, index) => (
                <View key={index} style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <Ionicons name="lock-closed" size={14} color="#FF9800" />
                    <Text style={styles.noteAuthor}>
                      {note.user?.firstName || 'Unknown'}
                    </Text>
                    <Text style={styles.noteTime}>
                      {new Date(note.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {engagement.tags?.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {engagement.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Assigned To */}
          {engagement.assignedTo && (
            <View style={styles.assignedSection}>
              <Text style={styles.sectionTitle}>Assigned To</Text>
              <View style={styles.assignedCard}>
                <Ionicons name="person-circle" size={24} color={theme.colors.primary} />
                <View>
                  <Text style={styles.assignedName}>
                    {engagement.assignedTo.firstName} {engagement.assignedTo.lastName}
                  </Text>
                  <Text style={styles.assignedEmail}>
                    {engagement.assignedTo.email}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Reply Input Bar */}
        <View style={styles.replyBar}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleAIResponse}
          >
            <Ionicons name="flash" size={22} color={theme.colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply..."
            value={replyText}
            onChangeText={setReplyText}
            multiline
            maxLength={500}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!replyText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendReply}
            disabled={!replyText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* AI Response Generator Modal */}
      <AIResponseGenerator
        visible={showAI}
        engagement={engagement}
        onUseResponse={handleUseAIResponse}
        onClose={() => setShowAI(false)}
      />

      {/* Action Sheet */}
      <ActionSheet
        visible={showActions}
        onClose={() => setShowActions(false)}
        items={actionItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  platformText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  dot: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  timestamp: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  messageSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  mediaScroll: {
    marginTop: 12,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  hashtag: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  analysisSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analysisItem: {
    flex: 1,
    minWidth: '45%',
  },
  analysisLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  scoresContainer: {
    marginTop: 16,
    gap: 12,
  },
  scoreItem: {
    gap: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  scoreBar: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  repliesSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  replyCard: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    flex: 1,
  },
  replyTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  replyText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  notesSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  noteCard: {
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  noteAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  noteTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  noteText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  tagsSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  assignedSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  assignedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    gap: 12,
  },
  assignedName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  assignedEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});