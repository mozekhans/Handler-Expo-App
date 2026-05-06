// import { useState, useCallback, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import { router, useFocusEffect } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Dimensions } from 'react-native';
// import { useSocial } from '../../../../hooks/useSocial';
// import { useTheme } from '../../../../hooks/useTheme';
// import { useBusiness } from '../../../../hooks/useBusiness';
// import Header from '../../../../components/common/Header';
// import Button from '../../../../components/common/Button';
// import LoadingIndicator from '../../../../components/common/LoadingIndicator';
// import EmptyState from '../../../../components/common/EmptyState';
// import PlatformIcon from '../../../../components/social/PlatformIcon';

// const PLATFORMS = [
//   { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
//   { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
//   { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
//   { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0A66C2' },
//   { id: 'tiktok', name: 'TikTok', icon: 'logo-tiktok', color: '#000000' },
//   { id: 'pinterest', name: 'Pinterest', icon: 'logo-pinterest', color: '#BD081C' },
//   { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
// ];

// export default function SocialAccountsScreen() {
//   const [refreshing, setRefreshing] = useState(false);
//   const [showConnectModal, setShowConnectModal] = useState(false);
//   const [selectedPlatform, setSelectedPlatform] = useState(null);
//   const [syncing, setSyncing] = useState(false);
//   const hasCheckedAccounts = useRef(false);

//   const { colors } = useTheme();
//   const { currentBusiness } = useBusiness();
//   const {
//     accounts,
//     loading,
//     getAccounts,
//     disconnectAccount,
//     syncAccount,
//     syncAllAccounts,
//     getAuthUrl,
//     connectAccount
//   } = useSocial();

//   useFocusEffect(
//     useCallback(() => {
//       loadAccounts();
//     }, [currentBusiness])
//   );

//   const loadAccounts = async () => {
//     if (currentBusiness) {
//       await getAccounts();
//       hasCheckedAccounts.current = true;
//     }
//   };

//   // Redirect to connect screen if no accounts after loading
//   useEffect(() => {
//     if (!loading && hasCheckedAccounts.current && accounts.length === 0) {
//       router.replace('/(app)/social/connect');
//     }
//   }, [loading, accounts]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadAccounts();
//     setRefreshing(false);
//   };

//   const handleConnect = async (platform) => {
//     // Navigate to connect screen with platform pre-selected
//     router.push(`/(app)/social/connect?platform=${platform.id}`);
//   };

//   const handleDisconnect = (account) => {
//     Alert.alert(
//       'Disconnect Account',
//       `Are you sure you want to disconnect ${account.accountName}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Disconnect',
//           style: 'destructive',
//           onPress: async () => {
//             await disconnectAccount(account.id);
//             await loadAccounts();
//             // If no more accounts, redirect to connect
//             if (accounts.length <= 1) {
//               router.replace('/(app)/social/connect');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleSync = async (account) => {
//     setSyncing(true);
//     await syncAccount(account.id);
//     setSyncing(false);
//     Alert.alert('Success', 'Account synced successfully');
//   };

//   const handleSyncAll = async () => {
//     setSyncing(true);
//     await syncAllAccounts();
//     setSyncing(false);
//     Alert.alert('Success', 'All accounts synced successfully');
//   };

//   const handleViewAccount = (account) => {
//     router.push(`/(app)/social/${account.id}`);
//   };

//   const formatMetric = (value) => {
//     if (!value) return '0';
//     if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
//     return value.toString();
//   };

//   const renderAccountCard = ({ item: account }) => (
//     <TouchableOpacity
//       style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
//       onPress={() => handleViewAccount(account)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.accountHeader}>
//         <View style={styles.accountInfo}>
//           <PlatformIcon platform={account.platform} size={40} />
//           <View style={styles.accountDetails}>
//             <Text style={[styles.accountName, { color: colors.text }]}>
//               {account.accountName}
//             </Text>
//             <Text style={[styles.accountUsername, { color: colors.textSecondary }]}>
//               @{account.accountUsername || account.accountName}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.accountActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => handleSync(account)}
//           >
//             <Ionicons name="sync-outline" size={20} color={colors.primary} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => handleDisconnect(account)}
//           >
//             <Ionicons name="trash-outline" size={20} color={colors.error} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={[styles.metricsContainer, { borderTopColor: colors.border }]}>
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.followers)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
//             Followers
//           </Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.engagement)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
//             Engagement
//           </Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metric}>
//           <Text style={[styles.metricValue, { color: colors.text }]}>
//             {formatMetric(account.metrics?.posts)}
//           </Text>
//           <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
//             Posts
//           </Text>
//         </View>
//       </View>

//       {account.lastSync && (
//         <Text style={[styles.lastSync, { color: colors.textSecondary }]}>
//           Last synced: {new Date(account.lastSync).toLocaleString()}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );

//   if (loading && !refreshing) {
//     return <LoadingIndicator fullScreen />;
//   }

//   // If no accounts and already checked, show loading briefly before redirect
//   if (accounts.length === 0 && hasCheckedAccounts.current) {
//     return <LoadingIndicator fullScreen />;
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Header
//         title="Social Accounts"
//         showBack={false}
//         rightAction={
//           accounts.length > 0 ? (
//             <TouchableOpacity onPress={handleSyncAll} disabled={syncing}>
//               <Ionicons name="sync-outline" size={24} color={colors.primary} />
//             </TouchableOpacity>
//           ) : null
//         }
//       />

//       <FlatList
//         data={accounts}
//         renderItem={renderAccountCard}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
//         }
//       />

//       {/* Floating Action Button */}
//       {accounts.length > 0 && (
//         <TouchableOpacity
//           style={[styles.fab, { backgroundColor: colors.primary }]}
//           onPress={() => router.push('/(app)/social/connect')}
//         >
//           <Ionicons name="add" size={28} color="#fff" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   listContent: {
//     padding: 16,
//   },
//   accountCard: {
//     borderRadius: 16,
//     borderWidth: 1,
//     padding: 16,
//     marginBottom: 16,
//   },
//   accountHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
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
//   accountActions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   actionButton: {
//     padding: 8,
//   },
//   metricsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingTop: 16,
//     borderTopWidth: 1,
//   },
//   metric: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   metricValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   metricLabel: {
//     fontSize: 12,
//   },
//   metricDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: '#ccc',
//   },
//   lastSync: {
//     fontSize: 10,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
// });

import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../components/common/Header";
import AccountCard from "../../../../components/social/AccountCard";
import { useSocialAccounts } from "../../../../hooks/useSocial";
import { useBusiness } from "../../../../hooks/businessHooks/useBusiness";
import { theme } from "../../../../styles/theme";

export default function SocialAccountsScreen() {
  const { currentBusiness } = useBusiness();

  const businessId = currentBusiness?._id;
  const {
    accounts,
    loading,
    refreshing,
    error,
    fetchAccounts,
    refreshAccounts,
    disconnectAccount,
    syncAccount,
    syncAllAccounts,
  } = useSocialAccounts(businessId);

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [fetchAccounts]),
  );

  const renderHeader = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => router.push("/social/connect")}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.connectText}>Connect Account</Text>
      </TouchableOpacity>

      {accounts.length > 0 && (
        <TouchableOpacity
          style={styles.syncAllButton}
          onPress={syncAllAccounts}
        >
          <Ionicons name="sync" size={20} color={theme.colors.primary} />
          <Text style={styles.syncAllText}>Sync All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="share-social"
        size={80}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No Accounts Connected</Text>
      <Text style={styles.emptyText}>
        Connect your social media accounts to manage them from one place
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push("/social/connect")}
      >
        <Text style={styles.emptyButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && accounts.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Social Accounts" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Social Accounts" />
      <FlatList
        data={accounts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            businessId={businessId}
            onDisconnect={disconnectAccount}
            onSync={syncAccount}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAccounts}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  connectText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  syncAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  syncAllText: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
