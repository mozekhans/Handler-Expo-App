// app/engagement/bulk-reply.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../components/common/Header';
import { useEngagementActions } from '../../../../../hooks/useEngagementActions';
import { useAuth } from '../../../../../context/AuthContext';
import engagementService from '../../../../../services/engagementService';
import { theme } from '../../../../../styles/theme';

export default function BulkReplyScreen() {
  const router = useRouter();
  const { ids, businessId: paramBusinessId } = useLocalSearchParams();
  const { business } = useAuth();
  
  const [message, setMessage] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewEngagements, setPreviewEngagements] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [aiTone, setAiTone] = useState('professional');
  const [showPreview, setShowPreview] = useState(true);

  const businessIdToUse = paramBusinessId || business?._id;
  const engagementIds = ids ? ids.split(',') : [];
  const { bulkReply, generateAIResponse } = useEngagementActions(businessIdToUse);

  useEffect(() => {
    if (engagementIds.length > 0) {
      fetchPreviewEngagements();
    }
  }, [ids]);

  const fetchPreviewEngagements = async () => {
    if (engagementIds.length === 0) return;

    try {
      setLoadingPreview(true);
      const previewIds = engagementIds.slice(0, 5);
      const results = await Promise.allSettled(
        previewIds.map(id => engagementService.getEngagement(businessIdToUse, id))
      );
      
      const engagements = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value?.engagement || r.value?.data?.engagement)
        .filter(Boolean);
      
      setPreviewEngagements(engagements);
    } catch (error) {
      console.error('Failed to fetch preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      // Get a sample of comments for context
      const sampleComments = previewEngagements
        .slice(0, 3)
        .map(eng => eng.content?.text)
        .filter(Boolean);

      const context = {
        tone: aiTone,
        bulkMode: true,
        sampleComments,
        platform: previewEngagements[0]?.platform,
        count: engagementIds.length,
      };

      const response = await generateAIResponse(
        "Generate a professional, generic response suitable for multiple social media engagements",
        context
      );

      const aiResponse = response?.data?.response || response?.response;
      if (aiResponse) {
        setMessage(aiResponse);
        setUseAI(true);
      }
    } catch (error) {
      // Fallback message if AI fails
      const fallbackMessages = {
        professional: "Thank you for your message! We appreciate you taking the time to reach out. Our team is reviewing your feedback and will respond shortly.",
        friendly: "Hey! Thanks so much for reaching out! 😊 We really appreciate your feedback and we'll get back to you soon!",
        casual: "Thanks for the message! We hear you and we'll get back to you ASAP! 👍",
        empathetic: "Thank you for sharing this with us. We understand how you feel and we're here to help. Our team will look into this right away.",
        formal: "Thank you for your correspondence. We acknowledge receipt of your message and will provide a response at our earliest convenience.",
      };
      
      setMessage(fallbackMessages[aiTone] || fallbackMessages.professional);
      setUseAI(true);
    } finally {
      setGenerating(false);
    }
  };

  const validateMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a reply message');
      return false;
    }
    if (message.length > 1000) {
      Alert.alert('Warning', 'Your message is quite long. Some platforms may truncate it. Continue?', [
        { text: 'Edit', style: 'cancel' },
        { text: 'Continue', onPress: () => confirmSend() },
      ]);
      return false;
    }
    return true;
  };

  const confirmSend = () => {
    Alert.alert(
      'Confirm Bulk Reply',
      `Send this reply to ${engagementIds.length} engagement(s)?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Send to ${engagementIds.length} Engagement(s)`,
          onPress: handleSend,
        },
      ]
    );
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const response = await bulkReply(engagementIds, message.trim(), useAI);

      const results = response?.results || response?.data?.results || [];
      const errors = response?.errors || response?.data?.errors || [];
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = errors.length;

      let alertMessage = '';
      if (successCount > 0) {
        alertMessage += `✓ Successfully replied to ${successCount} engagement(s)`;
      }
      if (errorCount > 0) {
        alertMessage += `\n✗ Failed to reply to ${errorCount} engagement(s)`;
        if (errors[0]?.error) {
          alertMessage += `\n\nError: ${errors[0].error}`;
        }
      }

      Alert.alert(
        'Bulk Reply Complete',
        alertMessage,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send bulk replies';
      Alert.alert('Error', errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleSendPress = () => {
    if (validateMessage()) {
      confirmSend();
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: 'logo-facebook',
      instagram: 'logo-instagram',
      twitter: 'logo-twitter',
      linkedin: 'logo-linkedin',
      tiktok: 'logo-tiktok',
      youtube: 'logo-youtube',
    };
    return icons[platform] || 'globe-outline';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: '#1877F2',
      instagram: '#E4405F',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      tiktok: '#000000',
      youtube: '#FF0000',
    };
    return colors[platform] || '#9E9E9E';
  };

  const PlatformBreakdown = useCallback(() => {
    if (previewEngagements.length === 0) return null;
    
    const platformCount = previewEngagements.reduce((acc, eng) => {
      const platform = eng.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    return (
      <View style={styles.platformBreakdown}>
        {Object.entries(platformCount).map(([platform, count]) => (
          <View key={platform} style={styles.platformItem}>
            <Ionicons name={getPlatformIcon(platform)} size={14} color={getPlatformColor(platform)} />
            <Text style={styles.platformCount}>
              {count}x
            </Text>
          </View>
        ))}
      </View>
    );
  }, [previewEngagements]);

  return (
    <View style={styles.container}>
      <Header
        title="Bulk Reply"
        showBack
        rightComponent={
          <TouchableOpacity
            onPress={handleSendPress}
            disabled={!message.trim() || sending}
            style={[
              styles.sendButton,
              (!message.trim() || sending) && styles.sendButtonDisabled,
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="send" size={16} color="white" />
                <Text style={[
                  styles.sendText,
                  !message.trim() && styles.sendTextDisabled,
                ]}>
                  Send                </Text>
              </>
            )}
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <Ionicons name="chatbubbles" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryCount}>{engagementIds.length}</Text>
                <Text style={styles.summaryLabel}>Engagements Selected</Text>
              </View>
              <PlatformBreakdown />
            </View>
          </View>

          {/* Preview Section */}
          {previewEngagements.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowPreview(!showPreview)}
              >
                <Text style={styles.sectionTitle}>
                  Preview ({Math.min(previewEngagements.length, 5)} of {engagementIds.length})
                </Text>
                <Ionicons
                  name={showPreview ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {showPreview && (
                <View style={styles.previewList}>
                  {loadingPreview ? (
                    <View style={styles.previewLoading}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text style={styles.previewLoadingText}>Loading preview...</Text>
                    </View>
                  ) : (
                    <>
                      {previewEngagements.map((eng) => (
                        <View key={eng._id} style={styles.previewCard}>
                          <View style={styles.previewHeader}>
                            <View style={styles.previewPlatform}>
                              <Ionicons
                                name={getPlatformIcon(eng.platform)}
                                size={14}
                                color={getPlatformColor(eng.platform)}
                              />
                              <Text style={styles.previewPlatformText}>
                                {eng.platform}
                              </Text>
                            </View>
                            <Text style={styles.previewType}>
                              {eng.type}
                            </Text>
                          </View>
                          <Text style={styles.previewUser} numberOfLines={1}>
                            {eng.user?.name || eng.user?.username || 'Unknown User'}
                          </Text>
                          <Text style={styles.previewContent} numberOfLines={2}>
                            {eng.content?.text || 'No content'}
                          </Text>
                        </View>
                      ))}
                      {engagementIds.length > 5 && (
                        <View style={styles.morePreview}>
                          <Ionicons name="more-horizontal" size={20} color={theme.colors.textSecondary} />
                          <Text style={styles.morePreviewText}>
                            +{engagementIds.length - 5} more engagement(s)
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          )}

          {/* AI Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Response Generator</Text>

            {/* Tone Selection */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toneContainer}
            >
              {[
                { key: 'professional', label: 'Professional', icon: 'briefcase-outline' },
                { key: 'friendly', label: 'Friendly', icon: 'happy-outline' },
                { key: 'casual', label: 'Casual', icon: 'cafe-outline' },
                { key: 'empathetic', label: 'Empathetic', icon: 'heart-outline' },
                { key: 'formal', label: 'Formal', icon: 'document-text-outline' },
              ].map((tone) => (
                <TouchableOpacity
                  key={tone.key}
                  style={[
                    styles.toneButton,
                    aiTone === tone.key && styles.toneButtonActive,
                  ]}
                  onPress={() => setAiTone(tone.key)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={tone.icon}
                    size={16}
                    color={aiTone === tone.key ? 'white' : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.toneText,
                      aiTone === tone.key && styles.toneTextActive,
                    ]}
                  >
                    {tone.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.aiGenerateButton, generating && styles.aiGenerateButtonLoading]}
              onPress={handleGenerateAI}
              disabled={generating}
              activeOpacity={0.7}
            >
              {generating ? (
                <>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.aiGenerateText}>Generating AI response...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="flash" size={20} color={theme.colors.primary} />
                  <Text style={styles.aiGenerateText}>Generate AI Response</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <View style={styles.messageHeader}>
              <Text style={styles.sectionTitle}>Your Reply Message</Text>
              {useAI && (
                <View style={styles.aiIndicator}>
                  <Ionicons name="flash" size={14} color="#FF9800" />
                  <Text style={styles.aiIndicatorText}>AI Generated</Text>
                  <TouchableOpacity onPress={() => {
                    setMessage('');
                    setUseAI(false);
                  }}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TextInput
              style={styles.messageInput}
              placeholder="Type your bulk reply message..."
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (useAI) setUseAI(false);
              }}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={2000}
            />

            <View style={styles.messageFooter}>
              <View style={styles.charCount}>
                <Text style={[
                  styles.charCountText,
                  message.length > 500 && styles.charCountWarning,
                  message.length > 1000 && styles.charCountError,
                ]}>
                  {message.length}
                </Text>
                <Text style={styles.charCountLabel}>/2000 characters</Text>
              </View>
              {message.length > 280 && (
                <View style={styles.platformWarning}>
                  <Ionicons name="warning" size={12} color="#FF9800" />
                  <Text style={styles.platformWarningText}>
                    May be truncated on Twitter
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Important Tips</Text>
            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <Ionicons name="information-circle" size={18} color={theme.colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Keep it Generic</Text>
                  <Text style={styles.tipText}>
                    Avoid using specific names or details since this will be sent to multiple people.
                  </Text>
                </View>
              </View>
              <View style={styles.tipDivider} />
              <View style={styles.tipItem}>
                <Ionicons name="information-circle" size={18} color="#FF9800" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Platform Limits</Text>
                  <Text style={styles.tipText}>
                    Twitter limits replies to 280 characters. Longer messages will be truncated.
                  </Text>
                </View>
              </View>
              <View style={styles.tipDivider} />
              <View style={styles.tipItem}>
                <Ionicons name="information-circle" size={18} color="#F44336" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Cannot Be Undone</Text>
                  <Text style={styles.tipText}>
                    Bulk replies are sent immediately and cannot be recalled. Review carefully before sending.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    gap: 4,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  sendTextDisabled: {
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    ...theme.shadows.medium,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  platformBreakdown: {
    flexDirection: 'row',
    gap: 8,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  platformCount: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  previewList: {
    paddingHorizontal: 16,
    gap: 6,
  },
  previewLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  previewLoadingText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  previewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewPlatformText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  previewType: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  previewUser: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  previewContent: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  morePreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  morePreviewText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  toneContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  toneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  toneButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toneText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  toneTextActive: {
    color: 'white',
  },
  aiGenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight + '15',
    borderWidth: 1,
    borderColor: theme.colors.primaryLight + '30',
    gap: 8,
  },
  aiGenerateButtonLoading: {
    opacity: 0.7,
  },
  aiGenerateText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF980015',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiIndicatorText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  messageInput: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    minHeight: 180,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  charCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  charCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  charCountWarning: {
    color: '#FF9800',
  },
  charCountError: {
    color: '#F44336',
  },
  charCountLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  platformWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  platformWarningText: {
    fontSize: 11,
    color: '#FF9800',
  },
  tipsCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  tipDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: 12,
  },
  bottomPadding: {
    height: 40,
  },
});