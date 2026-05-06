// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../../hooks/useTheme';
// import PlatformIcon from './PlatformIcon';

// export default function AccountCard({ account, onPress, onSync, onDisconnect, showActions = true }) {
//   const { colors } = useTheme();
  
//   const formatMetric = (value) => {
//     if (!value) return '0';
//     if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
//     return value.toString();
//   };
  
//   const getStatusColor = () => {
//     if (!account.isActive) return colors.error;
//     if (account.isTokenExpired) return colors.warning;
//     return colors.success;
//   };
  
//   return (
//     <TouchableOpacity
//       style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <View style={styles.header}>
//         <View style={styles.accountInfo}>
//           <PlatformIcon platform={account.platform} size={40} />
//           <View style={styles.accountDetails}>
//             <Text style={[styles.accountName, { color: colors.text }]} numberOfLines={1}>
//               {account.accountName}
//             </Text>
//             <Text style={[styles.accountUsername, { color: colors.textSecondary }]} numberOfLines={1}>
//               @{account.accountUsername || account.accountName}
//             </Text>
//           </View>
//         </View>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
//           <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
//           <Text style={[styles.statusText, { color: getStatusColor() }]}>
//             {account.isActive ? (account.isTokenExpired ? 'Expiring' : 'Active') : 'Inactive'}
//           </Text>
//         </View>
//       </View>
      
//       <View style={[styles.metrics, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.followers)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Followers</Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.following)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Following</Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.posts)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Posts</Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {(account.metrics?.engagementRate || 0).toFixed(1)}%
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Engagement</Text>
//         </View>
//       </View>
      
//       {showActions && (
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={[styles.actionButton, { borderColor: colors.border }]}
//             onPress={onSync}
//           >
//             <Ionicons name="sync-outline" size={18} color={colors.primary} />
//             <Text style={[styles.actionText, { color: colors.primary }]}>Sync</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.actionButton, { borderColor: colors.border }]}
//             onPress={onDisconnect}
//           >
//             <Ionicons name="trash-outline" size={18} color={colors.error} />
//             <Text style={[styles.actionText, { color: colors.error }]}>Disconnect</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 16,
//     borderWidth: 1,
//     overflow: 'hidden',
//     marginBottom: 12,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   accountInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   accountDetails: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   accountName: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   accountUsername: {
//     fontSize: 13,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   metrics: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//   },
//   metric: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   metricValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   metricLabel: {
//     fontSize: 11,
//   },
//   metricDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: '#E0E0E0',
//   },
//   actions: {
//     flexDirection: 'row',
//     padding: 12,
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     gap: 6,
//   },
//   actionText: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
// });

























import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../styles/theme';
import PlatformIcon from './PlatformIcon';
import { PLATFORMS } from '../../utils/platforms';

const AccountCard = ({ account, businessId, onDisconnect, onSync }) => {
  const platform = PLATFORMS[account.platform] || {};
  const metrics = account.metrics || {};

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Account',
      `Are you sure you want to disconnect your ${platform.name} account? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => onDisconnect?.(account._id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push(
          `/social/accounts/${account._id}?businessId=${businessId}`
        )
      }
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.platformInfo}>
          <PlatformIcon platform={account.platform} size={48} />
          <View style={styles.accountInfo}>
            <Text style={styles.accountName} numberOfLines={1}>
              {account.accountName || 'Unknown Account'}
            </Text>
            <Text style={styles.username} numberOfLines={1}>
              @{account.accountUsername || 'username'}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{account.accountType || 'business'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleDisconnect} style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Ionicons name="people" size={16} color={theme.colors.primary} />
          <Text style={styles.metricValue}>
            {formatNumber(metrics.followers || 0)}
          </Text>
          <Text style={styles.metricLabel}>Followers</Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="heart" size={16} color={theme.colors.error} />
          <Text style={styles.metricValue}>
            {formatNumber(metrics.engagement || 0)}
          </Text>
          <Text style={styles.metricLabel}>Engagement</Text>
        </View>
        <View style={styles.metricItem}>
          <Ionicons name="eye" size={16} color={theme.colors.success} />
          <Text style={styles.metricValue}>
            {formatNumber(metrics.impressions || 0)}
          </Text>
          <Text style={styles.metricLabel}>Impressions</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={() => onSync?.(account._id)}
        >
          <Ionicons name="sync" size={14} color={theme.colors.primary} />
          <Text style={styles.syncText}>
            {metrics.lastSync
              ? `Last synced: ${new Date(metrics.lastSync).toLocaleDateString()}`
              : 'Tap to sync'}
          </Text>
        </TouchableOpacity>
        {account.isVerified && (
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  username: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  menuButton: {
    padding: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});

export default AccountCard;