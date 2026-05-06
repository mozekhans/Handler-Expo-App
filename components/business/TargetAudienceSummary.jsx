// src/components/business/TargetAudienceSummary.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TargetAudienceSummary = ({ targetAudience }) => {
  if (!targetAudience) return null;

  const hasData = 
    targetAudience.ageRange ||
    targetAudience.gender?.length > 0 ||
    targetAudience.locations?.length > 0 ||
    targetAudience.interests?.length > 0 ||
    targetAudience.income ||
    targetAudience.education?.length > 0;

  if (!hasData) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={40} color="#ccc" />
        <Text style={styles.emptyText}>No target audience defined yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Demographics */}
      {(targetAudience.ageRange || targetAudience.gender?.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          
          {targetAudience.ageRange && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Age: {targetAudience.ageRange.min} - {targetAudience.ageRange.max} years
              </Text>
            </View>
          )}

          {targetAudience.gender?.length > 0 && (
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Gender: {targetAudience.gender.map(g => 
                  g.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                ).join(', ')}
              </Text>
            </View>
          )}

          {targetAudience.income && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Income: ${targetAudience.income.replace(/-/g, ' - $').replace(/\+\+/, '+')}
              </Text>
            </View>
          )}

          {targetAudience.education?.length > 0 && (
            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Education: {targetAudience.education.slice(0, 2).map(e => 
                  e.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                ).join(', ')}
                {targetAudience.education.length > 2 && ` +${targetAudience.education.length - 2}`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Location */}
      {targetAudience.locations?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.tagsContainer}>
            {targetAudience.locations.slice(0, 3).map((location, index) => (
              <View key={index} style={styles.tag}>
                <Ionicons name="location" size={12} color="#1976d2" />
                <Text style={styles.tagText}>{location}</Text>
              </View>
            ))}
            {targetAudience.locations.length > 3 && (
              <Text style={styles.moreText}>+{targetAudience.locations.length - 3} more</Text>
            )}
          </View>
        </View>
      )}

      {/* Interests & Behaviors */}
      {targetAudience.interests?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tagsContainer}>
            {targetAudience.interests.slice(0, 5).map((interest, index) => (
              <View key={index} style={[styles.tag, styles.interestTag]}>
                <Text style={[styles.tagText, styles.interestTagText]}>{interest}</Text>
              </View>
            ))}
            {targetAudience.interests.length > 5 && (
              <Text style={styles.moreText}>+{targetAudience.interests.length - 5}</Text>
            )}
          </View>
        </View>
      )}

      {targetAudience.behaviors?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behaviors</Text>
          <View style={styles.tagsContainer}>
            {targetAudience.behaviors.slice(0, 4).map((behavior, index) => (
              <View key={index} style={[styles.tag, styles.behaviorTag]}>
                <Text style={[styles.tagText, styles.behaviorTagText]}>{behavior}</Text>
              </View>
            ))}
            {targetAudience.behaviors.length > 4 && (
              <Text style={styles.moreText}>+{targetAudience.behaviors.length - 4}</Text>
            )}
          </View>
        </View>
      )}

      {/* Languages */}
      {targetAudience.languages?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languageContainer}>
            {targetAudience.languages.map((lang, index) => {
              const languageNames = {
                en: 'English',
                ha: 'Hausa',
                ig: 'Igbo',
                yo: 'Yoruba',
                pcm: 'Pidgin',
              };
              return (
                <View key={index} style={styles.languageBadge}>
                  <Text style={styles.languageText}>{languageNames[lang] || lang}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestTag: {
    backgroundColor: '#e8f5e9',
  },
  behaviorTag: {
    backgroundColor: '#fff3e0',
  },
  tagText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  interestTagText: {
    color: '#2e7d32',
  },
  behaviorTagText: {
    color: '#f57c00',
  },
  moreText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
});

export default TargetAudienceSummary;