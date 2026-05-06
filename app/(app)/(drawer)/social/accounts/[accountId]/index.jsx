import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../../components/common/Header';
import MetricsCard from '../../../../../../components/social/MetricsCard';
import PlatformIcon from '../../../../../../components/social/PlatformIcon';
import socialService from '../../../../../../services/socialService';
import { PLATFORMS } from '../../../../../../utils/platforms';
import { theme } from '../../../../../../styles/theme';

export default function AccountDetailScreen() {
  const { accountId, businessId } = useLocalSearchParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccount = useCallback(async () => {
    if (!accountId || !businessId) return;
    
    try {
      setError(null);
      const response = await socialService.getAccount(businessId, accountId);
      setAccount(response.account);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch account:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId, businessId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAccount();
    }, [fetchAccount])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAccount();
    setRefreshing(false);
  }, [fetchAccount]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Account Details" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !account) {
    return (
      <View style={styles.container}>
        <Header title="Account Details" showBack />
        <View style={styles.center}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{error || 'Account not found'}</Text>
        </View>
      </View>
    );
  }

  const platform = PLATFORMS[account.platform] || {};
  const metrics = account.metrics || {};

  return (
    <View style={styles.container}>
      <Header title={account.accountName || 'Account'} showBack />
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
        {/* Account Header */}
        <View style={styles.accountHeader}>
          <PlatformIcon platform={account.platform} size={64} />
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>
              {account.accountName || 'Unknown'}
            </Text>
            <Text style={styles.accountUsername}>
              @{account.accountUsername || 'username'}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {account.accountType || 'business'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push(`/social/accounts/${accountId}/settings?businessId=${businessId}`)
            }
          >
            <Ionicons name="settings" size={18} color={theme.colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push(`/social/accounts/${accountId}/metrics?businessId=${businessId}`)
            }
          >
            <Ionicons name="analytics" size={18} color={theme.colors.primary} />
            <Text style={styles.actionText}>Metrics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push(`/social/accounts/${accountId}/webhooks?businessId=${businessId}`)
            }
          >
            <Ionicons name="link" size={18} color={theme.colors.primary} />
            <Text style={styles.actionText}>Webhooks</Text>
          </TouchableOpacity>
        </View>

        {/* Metrics Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.metricsGrid}>
          <MetricsCard
            title="Followers"
            value={formatNumber(metrics.followers || 0)}
            change={5.2}
            icon="people"
            color={theme.colors.primary}
          />
          <MetricsCard
            title="Engagement"
            value={formatNumber(metrics.engagement || 0)}
            change={-2.1}
            icon="heart"
            color={theme.colors.error}
          />
        </View>
        <View style={styles.metricsGrid}>
          <MetricsCard
            title="Reach"
            value={formatNumber(metrics.reach || 0)}
            change={8.7}
            icon="eye"
            color={theme.colors.success}
          />
          <MetricsCard
            title="Impressions"
            value={formatNumber(metrics.impressions || 0)}
            change={3.4}
            icon="trending-up"
            color={theme.colors.warning}
          />
        </View>

        {/* Account Status */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Active</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: account.isActive ? theme.colors.success : theme.colors.error },
              ]}
            />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Verified</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: account.isVerified ? theme.colors.success : theme.colors.textSecondary },
              ]}
            />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Last Synced</Text>
            <Text style={styles.statusValue}>
              {metrics.lastSync
                ? new Date(metrics.lastSync).toLocaleString()
                : 'Never'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const formatNumber = (num) => {
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
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  accountInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  accountUsername: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    marginHorizontal: -4,
  },
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  statusLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusValue: {
    fontSize: 14,
    color: theme.colors.text,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});