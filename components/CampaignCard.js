import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const CampaignCard = ({ campaign, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'paused': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'draft': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'play-arrow';
      case 'paused': return 'pause';
      case 'completed': return 'check-circle';
      case 'draft': return 'edit';
      default: return 'campaign';
    }
  };

  const calculateProgress = () => {
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 1;
    
    return (now - start) / (end - start);
  };

  const progress = calculateProgress();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="campaign" size={24} color={theme.colors.primary} />
          <Text style={styles.title} numberOfLines={1}>{campaign.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) + '20' }]}>
          <Icon name={getStatusIcon(campaign.status)} size={14} color={getStatusColor(campaign.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
            {campaign.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {campaign.description}
      </Text>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{campaign.metrics?.reach?.toLocaleString() || 0}</Text>
          <Text style={styles.metricLabel}>Reach</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{campaign.metrics?.engagement?.toLocaleString() || 0}</Text>
          <Text style={styles.metricLabel}>Engagement</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{campaign.metrics?.conversions || 0}</Text>
          <Text style={styles.metricLabel}>Conversions</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          {Platform.OS === 'android' ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          ) : (
            <ProgressViewIOS
              progress={progress}
              progressTintColor={theme.colors.primary}
              trackTintColor={theme.colors.border}
              style={styles.progressBar}
            />
          )}
        </View>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Icon name="event" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.dateText}>
            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
          </Text>
        </View>
        {campaign.budget && (
          <View style={styles.budgetContainer}>
            <Icon name="attach-money" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.budgetText}>
              ${campaign.budget.spent?.toLocaleString()} / ${campaign.budget.total?.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  footer: {
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default CampaignCard;