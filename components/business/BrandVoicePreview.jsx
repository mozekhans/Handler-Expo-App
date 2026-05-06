// src/components/business/BrandVoicePreview.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BrandVoicePreview = ({ brandVoice }) => {
  if (!brandVoice) return null;

  const getToneDescription = (tone) => {
    const descriptions = {
      professional: 'Formal and authoritative',
      casual: 'Relaxed and conversational',
      friendly: 'Warm and approachable',
      humorous: 'Funny and entertaining',
      inspirational: 'Motivating and uplifting',
      educational: 'Informative and instructive',
      authoritative: 'Expert and commanding',
      empathetic: 'Understanding and supportive',
    };
    return descriptions[tone] || '';
  };

  const getSentenceLengthDescription = (length) => {
    const descriptions = {
      short: 'Brief, punchy sentences',
      medium: 'Balanced sentence structure',
      long: 'Detailed, flowing prose',
    };
    return descriptions[length] || '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="eye-outline" size={20} color="#1976d2" />
        <Text style={styles.title}>Brand Voice Preview</Text>
      </View>

      <View style={styles.previewCard}>
        <View style={styles.toneSection}>
          <Text style={styles.toneLabel}>Primary Tone</Text>
          <View style={styles.toneValue}>
            <Text style={styles.toneText}>
              {brandVoice.tone?.charAt(0).toUpperCase() + brandVoice.tone?.slice(1)}
            </Text>
            <Text style={styles.toneDescription}>
              {getToneDescription(brandVoice.tone)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.styleGrid}>
          <View style={styles.styleItem}>
            <Ionicons 
              name={brandVoice.style?.useEmojis ? "happy" : "happy-outline"} 
              size={18} 
              color={brandVoice.style?.useEmojis ? '#1976d2' : '#999'} 
            />
            <Text style={[
              styles.styleText,
              !brandVoice.style?.useEmojis && styles.styleTextInactive
            ]}>
              Emojis {brandVoice.style?.useEmojis ? 'On' : 'Off'}
            </Text>
          </View>

          <View style={styles.styleItem}>
            <Ionicons 
              name={brandVoice.style?.useHashtags ? "pricetag" : "pricetag-outline"} 
              size={18} 
              color={brandVoice.style?.useHashtags ? '#1976d2' : '#999'} 
            />
            <Text style={[
              styles.styleText,
              !brandVoice.style?.useHashtags && styles.styleTextInactive
            ]}>
              Hashtags {brandVoice.style?.useHashtags ? 'On' : 'Off'}
            </Text>
          </View>

          <View style={styles.styleItem}>
            <Ionicons 
              name={brandVoice.style?.useMentions ? "at" : "at-outline"} 
              size={18} 
              color={brandVoice.style?.useMentions ? '#1976d2' : '#999'} 
            />
            <Text style={[
              styles.styleText,
              !brandVoice.style?.useMentions && styles.styleTextInactive
            ]}>
              Mentions {brandVoice.style?.useMentions ? 'On' : 'Off'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Formality</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(brandVoice.style?.formality || 5) * 10}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Enthusiasm</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(brandVoice.style?.enthusiasm || 5) * 10}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Humor</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(brandVoice.style?.humor || 3) * 10}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.sentenceLength}>
          <Text style={styles.sentenceLengthLabel}>Sentence Length:</Text>
          <Text style={styles.sentenceLengthValue}>
            {brandVoice.style?.sentenceLength?.charAt(0).toUpperCase() + 
             brandVoice.style?.sentenceLength?.slice(1)}
          </Text>
          <Text style={styles.sentenceLengthDesc}>
            ({getSentenceLengthDescription(brandVoice.style?.sentenceLength)})
          </Text>
        </View>

        {brandVoice.keywords?.length > 0 && (
          <>
            <View style={styles.divider} />
            <View>
              <Text style={styles.keywordsLabel}>Brand Keywords</Text>
              <View style={styles.tagsContainer}>
                {brandVoice.keywords.slice(0, 5).map((keyword, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
                {brandVoice.keywords.length > 5 && (
                  <Text style={styles.moreTag}>+{brandVoice.keywords.length - 5}</Text>
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  previewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toneSection: {
    marginBottom: 12,
  },
  toneLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  toneValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  toneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginRight: 8,
  },
  toneDescription: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  styleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  styleItem: {
    alignItems: 'center',
  },
  styleText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  styleTextInactive: {
    color: '#999',
  },
  metricsRow: {
    marginBottom: 12,
  },
  metric: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 3,
  },
  sentenceLength: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sentenceLengthLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 6,
  },
  sentenceLengthValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 6,
  },
  sentenceLengthDesc: {
    fontSize: 12,
    color: '#999',
  },
  keywordsLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  moreTag: {
    fontSize: 12,
    color: '#999',
  },
});

export default BrandVoicePreview;