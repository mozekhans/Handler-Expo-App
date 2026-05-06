// src/components/business/CompetitorCard.jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CompetitorCard = ({ competitor, onPress, onRemove }) => {
  const getSocialCount = () => {
    return competitor.socialAccounts?.length || 0;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="business" size={24} color="#1976d2" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{competitor.name}</Text>
          {competitor.industry && (
            <Text style={styles.industry}>
              {competitor.industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          )}
        </View>

        {competitor.description && (
          <Text style={styles.description} numberOfLines={2}>
            {competitor.description}
          </Text>
        )}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="share-social" size={14} color="#999" />
            <Text style={styles.statText}>
              {getSocialCount()} {getSocialCount() === 1 ? 'platform' : 'platforms'}
            </Text>
          </View>

          {competitor.analysis?.marketShare > 0 && (
            <View style={styles.stat}>
              <Ionicons name="pie-chart" size={14} color="#999" />
              <Text style={styles.statText}>
                {competitor.analysis.marketShare}% market share
              </Text>
            </View>
          )}
        </View>

        {competitor.tracking?.enabled && (
          <View style={styles.trackingBadge}>
            <Ionicons name="pulse" size={12} color="#2e7d32" />
            <Text style={styles.trackingText}>Tracking Active</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color="#d32f2f" />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  industry: {
    fontSize: 13,
    color: '#666',
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trackingText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButton: {
    padding: 8,
    marginRight: 5,
  },
});

export default CompetitorCard;