// src/components/business/BusinessStats.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatNumber } from '../../utils/formatters';

const BusinessStats = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    {
      label: 'Total Posts',
      value: formatNumber(stats.totalPosts || 0),
      icon: 'grid-outline',
      color: '#1976d2',
    },
    {
      label: 'Followers',
      value: formatNumber(stats.totalFollowers || 0),
      icon: 'people-outline',
      color: '#2e7d32',
    },
    {
      label: 'Engagement',
      value: `${stats.averageEngagementRate?.toFixed(1) || 0}%`,
      icon: 'heart-outline',
      color: '#e91e63',
    },
    {
      label: 'Total Reach',
      value: formatNumber(stats.totalReach || 0),
      icon: 'eye-outline',
      color: '#f57c00',
    },
  ];

  const secondaryStats = [
    {
      label: 'Team Size',
      value: stats.teamSize || 0,
      icon: 'people-circle-outline',
    },
    {
      label: 'Social Accounts',
      value: stats.socialAccounts || 0,
      icon: 'share-social-outline',
    },
    {
      label: 'Active Campaigns',
      value: stats.campaigns || 0,
      icon: 'megaphone-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mainStats}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.secondaryStats}>
        {secondaryStats.map((item, index) => (
          <View key={index} style={styles.secondaryStatItem}>
            <Ionicons name={item.icon} size={16} color="#999" />
            <Text style={styles.secondaryStatValue}>{item.value}</Text>
            <Text style={styles.secondaryStatLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {stats.topPerformingPlatform && (
        <View style={styles.topPlatform}>
          <Ionicons name="trophy-outline" size={18} color="#ffc107" />
          <Text style={styles.topPlatformText}>
            Best Platform: <Text style={styles.platformName}>{stats.topPerformingPlatform}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  secondaryStatItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  secondaryStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
    marginRight: 3,
  },
  secondaryStatLabel: {
    fontSize: 12,
    color: '#999',
  },
  topPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  topPlatformText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  platformName: {
    fontWeight: '600',
    color: '#333',
  },
});

export default BusinessStats;