// src/components/business/AIInsightsCard.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AIInsightsCard = ({ aiLearning }) => {
  if (!aiLearning) return null;

  const getTopTopics = () => {
    return aiLearning.voiceProfile?.topics?.slice(0, 3) || [];
  };

  const getTopHashtags = () => {
    return aiLearning.voiceProfile?.hashtags
      ?.sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3) || [];
  };

  const getToneAnalysis = () => {
    const tones = aiLearning.voiceProfile?.tone || {};
    const dominantTone = Object.entries(tones).sort((a, b) => b[1] - a[1])[0];
    return dominantTone ? {
      name: dominantTone[0],
      value: Math.round(dominantTone[1] * 100)
    } : null;
  };

  const dominantTone = getToneAnalysis();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={20} color="#ffc107" />
        <Text style={styles.title}>AI Learning Insights</Text>
      </View>

      {dominantTone && (
        <View style={styles.insightRow}>
          <Ionicons name="mic-outline" size={16} color="#9c27b0" />
          <Text style={styles.insightLabel}>Dominant Tone:</Text>
          <Text style={styles.insightValue}>
            {dominantTone.name.charAt(0).toUpperCase() + dominantTone.name.slice(1)} 
            ({dominantTone.value}%)
          </Text>
        </View>
      )}

      {getTopTopics().length > 0 && (
        <View style={styles.insightSection}>
          <Text style={styles.insightSectionTitle}>Top Topics</Text>
          <View style={styles.tagsContainer}>
            {getTopTopics().map((topic, index) => (
              <View key={index} style={styles.topicTag}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {getTopHashtags().length > 0 && (
        <View style={styles.insightSection}>
          <Text style={styles.insightSectionTitle}>Best Performing Hashtags</Text>
          <View style={styles.tagsContainer}>
            {getTopHashtags().map((item, index) => (
              <View key={index} style={styles.hashtagTag}>
                <Text style={styles.hashtagText}>#{item.hashtag}</Text>
                <Text style={styles.hashtagPerformance}>
                  {(item.performance * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {aiLearning.contentPreferences?.optimalTimes?.length > 0 && (
        <View style={styles.insightSection}>
          <Text style={styles.insightSectionTitle}>Optimal Posting Times</Text>
          {aiLearning.contentPreferences.optimalTimes.slice(0, 2).map((time, index) => (
            <View key={index} style={styles.optimalTime}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.optimalTimeText}>
                {time.platform}: {time.dayOfWeek} at {time.hourOfDay}:00
              </Text>
              <Text style={styles.engagementScore}>
                {Math.round(time.engagementScore * 100)}% engagement
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Ionicons name="trending-up-outline" size={14} color="#4caf50" />
        <Text style={styles.footerText}>
          AI model trained on {aiLearning.voiceProfile?.vocabulary?.length || 0} words
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    marginRight: 4,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  insightSection: {
    marginBottom: 16,
  },
  insightSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  topicText: {
    fontSize: 12,
    color: '#9c27b0',
  },
  hashtagTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  hashtagText: {
    fontSize: 12,
    color: '#1976d2',
    marginRight: 6,
  },
  hashtagPerformance: {
    fontSize: 11,
    color: '#4caf50',
    fontWeight: '500',
  },
  optimalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  optimalTimeText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  engagementScore: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
});

export default AIInsightsCard;