import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../../components/common/Header';
import MetricsCard from '../../../../../../components/social/MetricsCard';
import socialService from '../../../../../../services/socialService';
import { useSocialMetrics } from '../../../../../../hooks/useSocialMetrics';
import { theme } from '../../../../../../styles/theme';

const { width } = Dimensions.get('window');

export default function AccountMetricsScreen() {
  const { accountId, businessId } = useLocalSearchParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { metrics, syncMetrics, lastUpdated } = useSocialMetrics(businessId, accountId);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      const response = await socialService.getAccount(businessId, accountId);
      setAccount(response.account);
    } catch (err) {
      console.error('Failed to fetch account:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncMetrics();
    } catch (err) {
      console.error('Failed to refresh metrics:', err);
    } finally {
      setRefreshing(false);
    }
  }, [syncMetrics]);

  const timeRanges = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Metrics" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  const accountMetrics = account?.metrics || {};
  const getChange = (key) => {
    // This would come from historical data comparison
    return Math.random() * 20 - 5;
  };

  return (
    <View style={styles.container}>
      <Header title="Metrics" showBack />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Account Info */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>
            {account?.accountName || 'Account'}
          </Text>
          <Text style={styles.accountUsername}>
            @{account?.accountUsername || 'username'}
          </Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.key}
              style={[
                styles.timeRangeButton,
                timeRange === range.key && styles.timeRangeActive,
              ]}
              onPress={() => setTimeRange(range.key)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range.key && styles.timeRangeTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsRow}>
          <MetricsCard
            title="Followers"
            value={formatNumber(accountMetrics.followers || 0)}
            change={getChange('followers')}
            icon="people"
            color={theme.colors.primary}
          />
          <MetricsCard
            title="Following"
            value={formatNumber(accountMetrics.following || 0)}
            change={getChange('following')}
            icon="person-add"
            color={theme.colors.secondary}
          />
        </View>
        <View style={styles.metricsRow}>
          <MetricsCard
            title="Posts"
            value={formatNumber(accountMetrics.posts || 0)}
            change={getChange('posts')}
            icon="grid"
            color={theme.colors.warning}
          />
          <MetricsCard
            title="Engagement"
            value={formatNumber(accountMetrics.engagement || 0)}
            change={getChange('engagement')}
            icon="heart"
            color={theme.colors.error}
          />
        </View>

        {/* Reach & Impressions */}
        <Text style={styles.sectionTitle}>Reach & Impressions</Text>
        <View style={styles.metricsRow}>
          <MetricsCard
            title="Reach"
            value={formatNumber(accountMetrics.reach || 0)}
            change={getChange('reach')}
            icon="eye"
            color={theme.colors.success}
          />
          <MetricsCard
            title="Impressions"
            value={formatNumber(accountMetrics.impressions || 0)}
            change={getChange('impressions')}
            icon="trending-up"
            color={theme.colors.info}
          />
        </View>

        {/* Profile Activity */}
        <Text style={styles.sectionTitle}>Profile Activity</Text>
        <View style={styles.metricsRow}>
          <MetricsCard
            title="Profile Views"
            value={formatNumber(accountMetrics.profileViews || 0)}
            change={getChange('profileViews')}
            icon="person-circle"
            color={theme.colors.primary}
          />
          <MetricsCard
            title="Website Clicks"
            value={formatNumber(accountMetrics.websiteClicks || 0)}
            change={getChange('websiteClicks')}
            icon="link"
            color={theme.colors.secondary}
          />
        </View>

        {/* Sync Button */}
        <TouchableOpacity style={styles.syncButton} onPress={onRefresh}>
          <Ionicons name="sync" size={20} color="#fff" />
          <Text style={styles.syncText}>Refresh Metrics</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  accountInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  accountName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  accountUsername: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  lastUpdated: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: 4,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xs,
    alignItems: 'center',
  },
  timeRangeActive: {
    backgroundColor: theme.colors.primary,
  },
  timeRangeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.lg,
  },
  syncText: {
    color: '#fff',
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
    marginLeft: theme.spacing.sm,
  },
});