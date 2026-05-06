// components/engagement/StatsOverview.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const StatsOverview = ({ stats, visible = true, onToggle }) => {
  const [expanded, setExpanded] = useState(visible);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    onToggle?.(!expanded);
  };

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total',
      value: stats.total || 0,
      icon: 'chatbubbles',
      color: theme.colors.primary,
    },
    {
      label: 'Unread',
      value: stats.unread || 0,
      icon: 'mail-unread',
      color: '#FF9800',
    },
    {
      label: 'Unreplied',
      value: stats.unreplied || 0,
      icon: 'chatbubble-ellipses',
      color: '#F44336',
    },
    {
      label: 'Response Rate',
      value: `${Math.round((stats.responseRate || 0) * 100)}%`,
      icon: 'trending-up',
      color: '#4CAF50',
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="stats-chart" size={16} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Overview</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.statsGrid}>
          {statCards.map((card, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: card.color + '20' }]}>
                <Ionicons name={card.icon} size={18} color={card.color} />
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
          ))}
        </View>
      )}

      {expanded && stats.typeBreakdown && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>By Platform</Text>
          <View style={styles.breakdownList}>
            {Object.entries(stats.platformBreakdown || {}).map(([platform, count]) => (
              <View key={platform} style={styles.breakdownItem}>
                <View style={styles.breakdownInfo}>
                  <Ionicons
                    name={`logo-${platform}`}
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.breakdownName}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                </View>
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownFill,
                      {
                        width: `${(count / stats.total) * 100}%`,
                        backgroundColor: getPlatformColor(platform),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.breakdownCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
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
  return colors[platform] || theme.colors.primary;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  breakdownSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    gap: 4,
  },
  breakdownName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  breakdownBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 2,
  },
  breakdownCount: {
    width: 30,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'right',
  },
});

export default StatsOverview;