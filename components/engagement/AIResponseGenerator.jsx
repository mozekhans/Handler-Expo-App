// components/engagement/AIResponseGenerator.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import engagementService from '../../services/engagementService';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

const AIResponseGenerator = ({ visible, engagement, onUseResponse, onClose }) => {
  const { business } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [responses, setResponses] = useState([]);
  const [customContext, setCustomContext] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const tones = [
    { key: 'professional', label: 'Professional', icon: 'briefcase' },
    { key: 'friendly', label: 'Friendly', icon: 'happy' },
    { key: 'casual', label: 'Casual', icon: 'cafe' },
    { key: 'empathetic', label: 'Empathetic', icon: 'heart' },
  ];

  const generateResponses = async () => {
    setGenerating(true);
    setResponses([]);
    
    try {
      const response = await engagementService.generateAIResponse(
        business._id,
        {
          text: engagement?.content?.text,
          context: {
            ...engagement,
            customContext,
            tone: selectedTone,
          },
        }
      );
      
      // If the API returns a single response, create variations
      const aiResponse = response.data?.response || response.response;
      setResponses([
        aiResponse,
        `${aiResponse} We're here to help if you need anything else!`,
        `Thank you for reaching out! ${aiResponse}`,
      ]);
    } catch (error) {
      // Fallback responses if AI fails
      setResponses([
        "Thank you for your message! We appreciate your feedback and will get back to you shortly.",
        "We value your input! Our team is reviewing your comment and will respond soon.",
        "Thanks for reaching out! We're committed to providing the best experience possible.",
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const handleUseResponse = (response) => {
    onUseResponse?.(response);
    handleClose();
  };

  const handleClose = () => {
    setResponses([]);
    setCustomContext('');
    setSelectedIndex(null);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable 
            style={styles.container} 
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <View style={styles.headerRow}>
                <Ionicons name="flash" size={24} color="#FF9800" />
                <Text style={styles.title}>AI Response Generator</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Original Comment */}
              {engagement?.content?.text && (
                <View style={styles.originalComment}>
                  <Text style={styles.label}>Original Comment:</Text>
                  <Text style={styles.commentText} numberOfLines={3}>
                    {engagement.content.text}
                  </Text>
                </View>
              )}

              {/* Tone Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Response Tone:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tonesContainer}
                >
                  {tones.map((tone) => (
                    <TouchableOpacity
                      key={tone.key}
                      style={[
                        styles.toneButton,
                        selectedTone === tone.key && styles.toneButtonActive,
                      ]}
                      onPress={() => setSelectedTone(tone.key)}
                    >
                      <Ionicons
                        name={tone.icon}
                        size={16}
                        color={selectedTone === tone.key ? 'white' : theme.colors.text}
                      />
                      <Text style={[
                        styles.toneText,
                        selectedTone === tone.key && styles.toneTextActive,
                      ]}>
                        {tone.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Context Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Additional Context (optional):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add any specific details or instructions..."
                  value={customContext}
                  onChangeText={setCustomContext}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateResponses}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.generateButtonText}>Generating Responses...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="flash" size={20} color="white" />
                    <Text style={styles.generateButtonText}>Generate AI Responses</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Generated Responses */}
              {responses.length > 0 && (
                <View style={styles.responsesSection}>
                  <Text style={styles.responsesTitle}>
                    Generated Responses ({responses.length})
                  </Text>
                  {responses.map((response, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.responseCard,
                        selectedIndex === index && styles.responseCardSelected,
                      ]}
                      onPress={() => setSelectedIndex(index)}
                    >
                      <Text style={styles.responseText}>{response}</Text>
                      <View style={styles.responseActions}>
                        <Text style={styles.charCount}>
                          {response.length} characters
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.useButton,
                            selectedIndex === index && styles.useButtonActive,
                          ]}
                          onPress={() => handleUseResponse(response)}
                        >
                          <Text style={[
                            styles.useButtonText,
                            selectedIndex === index && styles.useButtonTextActive,
                          ]}>
                            Use Response
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  originalComment: {
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  section: {
    marginBottom: 16,
  },
  tonesContainer: {
    gap: 8,
  },
  toneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  toneButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toneText: {
    fontSize: 13,
    color: theme.colors.text,
  },
  toneTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  responsesSection: {
    marginTop: 20,
  },
  responsesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  responseCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  responseCardSelected: {
    borderColor: theme.colors.primary,
  },
  responseText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  useButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  useButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  useButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  useButtonTextActive: {
    color: 'white',
  },
});

export default AIResponseGenerator;