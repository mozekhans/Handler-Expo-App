// import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
// import { useState, useEffect, useCallback } from 'react';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import { useBusiness } from '../../../../../hooks/useBusiness';
// import { useEngagement } from '../../../../../hooks/useEngagement';
// import { theme } from '../../../../../styles/theme';
// import { formatRelativeTime } from '../../../../../utils/formatters';
// import Header from '../../../../../components/common/Header';
// import Avatar from '../../../../../components/common/Avatar';
// import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
// import ErrorMessage from '../../../../../components/common/ErrorMessage';
// import EmptyState from '../../../../../components/common/EmptyState';
// import SearchBar from '../../../../../components/common/SearchBar';
// import Tabs from '../../../../../components/common/Tabs';
// import Card from '../../../../../components/common/Card';

// const tabs = [
//   { label: 'All', value: 'all' },
//   { label: 'Comments', value: 'comment' },
//   { label: 'Messages', value: 'message' },
//   { label: 'Mentions', value: 'mention' },
// ];

// export default function EngagementScreen() {
//   const [screenLoading, setScreenLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [unreadCount, setUnreadCount] = useState(0);

//   const { 
//     currentBusiness, 
//     businesses,
//     loading: businessLoading, 
//     error: businessError,
//     loadBusinesses 
//   } = useBusiness();
//   const { getConversations, getStats } = useEngagement();

//   // Load businesses on mount if not loaded
//   useEffect(() => {
//     if (businesses.length === 0 && !businessLoading) {
//       loadBusinesses();
//     }
//   }, []);

//   // Load conversations when business or tab changes
//   useEffect(() => {
//     if (currentBusiness && !businessLoading) {
//       loadConversations();
//       loadStats();
//     }
//   }, [currentBusiness, activeTab]);

//   useFocusEffect(
//     useCallback(() => {
//       if (currentBusiness) {
//         loadConversations();
//         loadStats();
//       }
//     }, [currentBusiness])
//   );

//   const loadConversations = async () => {
//     if (!currentBusiness) {
//       setConversations([]);
//       setScreenLoading(false);
//       return;
//     }

//     try {
//       setScreenLoading(true);
//       setError(null);
//       const type = tabs[activeTab]?.value === 'all' ? undefined : tabs[activeTab]?.value;
//       const data = await getConversations(currentBusiness._id, {
//         type,
//         search: searchQuery || undefined,
//       });
//       setConversations(data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to load conversations');
//     } finally {
//       setScreenLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const loadStats = async () => {
//     if (!currentBusiness) {
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       const stats = await getStats(currentBusiness._id);
//       setUnreadCount(stats?.unread || 0);
//     } catch (err) {
//       console.error('Failed to load stats:', err);
//       setUnreadCount(0);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadConversations();
//     loadStats();
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     // Debounce search
//     setTimeout(() => {
//       loadConversations();
//     }, 300);
//   };

//   const getPlatformIcon = (platform) => {
//     const icons = {
//       facebook: 'logo-facebook',
//       instagram: 'logo-instagram',
//       twitter: 'logo-twitter',
//       linkedin: 'logo-linkedin',
//     };
//     return icons[platform] || 'chatbubble-outline';
//   };

//   const getPlatformColor = (platform) => {
//     const colors = {
//       facebook: '#1877f2',
//       instagram: '#e4405f',
//       twitter: '#1da1f2',
//       linkedin: '#0077b5',
//     };
//     return colors[platform] || theme.colors.primary;
//   };

//   // Show loading while business context is initializing
//   if (businessLoading) {
//     return (
//       <View style={styles.container}>
//         <Header title="Messages" showBack={false} showMenu={true} />
//         <LoadingIndicator fullScreen text="Loading..." />
//       </View>
//     );
//   }

//   // Show error if business context failed
//   if (businessError) {
//     return (
//       <View style={styles.container}>
//         <Header title="Messages" showBack={false} showMenu={true} />
//         <ErrorMessage
//           fullScreen
//           message={businessError}
//           onRetry={loadBusinesses}
//           icon="alert-circle-outline"
//         />
//       </View>
//     );
//   }

//   // Show empty state if no business selected
//   if (!currentBusiness) {
//     return (
//       <View style={styles.container}>
//         <Header title="Messages" showBack={false} showMenu={true} />
//         <EmptyState
//           icon="business-outline"
//           title="No Business Selected"
//           message="Please select or create a business to view messages"
//           actionText="Select Business"
//           onAction={() => router.push('/business/select')}
//         />
//       </View>
//     );
//   }

//   const renderConversationItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.conversationItem}
//       onPress={() => router.push(`/engagement/conversation/${item.id}`)}
//     >
//       <View style={styles.avatarContainer}>
//         <Avatar
//           source={item.user?.avatar}
//           name={item.user?.name}
//           size={50}
//         />
//         {item.unread > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadText}>{item.unread}</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.conversationInfo}>
//         <View style={styles.conversationHeader}>
//           <Text style={styles.userName}>{item.user?.name}</Text>
//           <Text style={styles.messageTime}>
//             {formatRelativeTime(item.lastMessageTime)}
//           </Text>
//         </View>

//         <Text style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
//           {item.lastMessage}
//         </Text>

//         <View style={styles.messageFooter}>
//           <Ionicons name={getPlatformIcon(item.platform)} size={14} color={getPlatformColor(item.platform)} />
//           {item.type && (
//             <Text style={styles.messageType}>{item.type}</Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Header
//         title="Messages"
//         showBack={false}
//         showMenu={true}
//         rightComponent={
//           <TouchableOpacity onPress={() => router.push('/engagement/mentions')}>
//             <View style={styles.headerIcon}>
//               <Ionicons name="at-outline" size={24} color={theme.colors.text} />
//               {unreadCount > 0 && (
//                 <View style={styles.headerBadge}>
//                   <Text style={styles.headerBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         }
//       />

//       <View style={styles.searchContainer}>
//         <SearchBar
//           value={searchQuery}
//           onChangeText={handleSearch}
//           placeholder="Search messages..."
//         />
//       </View>

//       <Tabs
//         tabs={tabs}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         variant="pills"
//         style={styles.tabs}
//       />

//       {screenLoading && !refreshing ? (
//         <LoadingIndicator fullScreen text="Loading messages..." />
//       ) : error ? (
//         <ErrorMessage
//           fullScreen
//           message={error}
//           onRetry={loadConversations}
//           icon="alert-circle-outline"
//         />
//       ) : (
//         <FlatList
//           data={conversations}
//           renderItem={renderConversationItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContainer}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <EmptyState
//               icon="chatbubbles-outline"
//               title="No Messages"
//               message={searchQuery ? "No results found" : "Your messages will appear here"}
//             />
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   headerIcon: {
//     position: 'relative',
//   },
//   headerBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: theme.colors.error,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   headerBadgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   searchContainer: {
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//   },
//   tabs: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//   },
//   listContainer: {
//     padding: theme.spacing.md,
//   },
//   conversationItem: {
//     flexDirection: 'row',
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.md,
//     padding: theme.spacing.sm,
//     marginBottom: theme.spacing.sm,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: theme.spacing.sm,
//   },
//   unreadBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: theme.colors.error,
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   unreadText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   conversationInfo: {
//     flex: 1,
//   },
//   conversationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.colors.text,
//   },
//   messageTime: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginBottom: 4,
//   },
//   unreadMessage: {
//     fontWeight: '600',
//     color: theme.colors.text,
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   messageType: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     textTransform: 'capitalize',
//   },
// });




















// app/(tabs)/engagements/index.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../components/common/Header';
import EngagementCard from '../../../../../components/engagement/EngagementCard';
import FilterBar from '../../../../../components/engagement/FilterBar';
import BulkActionsBar from '../../../../../components/engagement/BulkActionsBar';
import EmptyState from '../../../../../components/engagement/EmptyState';
import StatsOverview from '../../../../../components/engagement/StatsOverview';
import engagementService from '../../../../../services/engagementService';
import { useEngagements } from '../../../../../hooks/useEngagement';
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
import { theme } from '../../../../../styles/theme';

export default function EngagementsScreen() {
  const {
  currentBusiness: business,
  loading: businessLoading,
} = useBusiness();
  const [filters, setFilters] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const {
    engagements,
    stats,
    loading,
    refreshing,
    error,
    pagination,
    refresh,
    loadMore,
    fetchEngagements,
    } = useEngagements(business?._id || null, filters);

  // Debounced filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Remove undefined values
      Object.keys(updated).forEach(key => 
        updated[key] === undefined && delete updated[key]
      );
      return updated;
    });
  }, []);

  const handleEngagementPress = useCallback((engagement) => {
    if (selectionMode) {
      toggleSelection(engagement._id);
    } else {
      router.push({
        pathname: `/engagement/${engagement._id}`,
        params: { businessId: business?._id }
      });
    }
  }, [selectionMode, business?._id]);

  const handleLongPress = useCallback((engagement) => {
    setSelectionMode(true);
    toggleSelection(engagement._id);
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

 
  const handleBulkReply = () => {
  if (!business?._id) return;

  router.push({
    pathname: '/engagement/bulk-reply',
    params: {
      ids: selectedIds.join(','),
      businessId: business._id,
    },
  });
};

  const handleMarkAllRead = async () => {
  if (!business?._id) return;

  try {
    await engagementService.markAllAsRead(business._id);
    refresh();
  } catch (error) {
    Alert.alert('Error', 'Failed to mark all as read');
  }
};

  const renderHeader = () => (
    <View>
      <StatsOverview 
        stats={stats} 
        visible={showStats}
        onToggle={() => setShowStats(!showStats)}
      />
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        stats={stats}
      />
      {selectionMode && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={clearSelection}
          onBulkReply={handleBulkReply}
        />
      )}
    </View>
  );

  const renderItem = useCallback(({ item }) => (
    <EngagementCard
      engagement={item}
      onPress={handleEngagementPress}
      onLongPress={handleLongPress}
      selected={selectedIds.includes(item._id)}
      selectionMode={selectionMode}
    />
  ), [selectedIds, selectionMode]);

  const renderFooter = () => {
    if (!loading || engagements.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const keyExtractor = useCallback((item) => item._id, []);

  const memoizedEngagements = useMemo(
  () => engagements || [],
  [engagements]
);

  if (businessLoading) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

// if (!business?._id) {
//   return (
//     <View style={styles.container}>
//       <EmptyState
//         icon="business-outline"
//         title="No Business Selected"
//         message="Please select a business first"
//       />
//     </View>
//   );
// }

  return (
    <View style={styles.container}>
      <Header
        title="Engagements"
        showMenu
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleMarkAllRead}
              style={styles.headerButton}
            >
              <Ionicons 
                name="checkmark-done" 
                size={22} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/engagement/analytics')}
              style={styles.headerButton}
            >
              <Ionicons 
                name="analytics" 
                size={22} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          </View>
        }
      />

      <FlatList
        data={memoizedEngagements}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading && (
            <EmptyState
              icon="chatbubbles-outline"
              title="No Engagements Found"
              message={
                Object.keys(filters).length > 0
                  ? "Try adjusting your filters"
                  : "Your social media engagements will appear here"
              }
              action={
                Object.keys(filters).length > 0
                  ? {
                      label: 'Clear Filters',
                      onPress: () => setFilters({}),
                    }
                  : null
              }
            />
          )
        }
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={[
          styles.listContent,
          engagements.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyList: {
    flex: 1,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});