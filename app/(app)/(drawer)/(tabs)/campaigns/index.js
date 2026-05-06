// import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
// import { useState, useEffect, useCallback } from 'react';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import { useBusiness } from '../../../../hooks/useBusiness';
// import { useCampaigns } from '../../../../hooks/useCampaigns';
// import { theme } from '../../../../styles/theme';
// import { formatDate, formatCompactNumber } from '../../../../utils/formatters';
// import Header from '../../../../components/common/Header';
// import Card from '../../../../components/common/Card';
// import LoadingIndicator from '../../../../components/common/LoadingIndicator';
// import ErrorMessage from '../../../../components/common/ErrorMessage';
// import EmptyState from '../../../../components/common/EmptyState';
// import Badge from '../../../../components/common/Badge';
// import ProgressBar from '../../../../components/common/ProgressBar';
// import Tabs from '../../../../components/common/Tabs';

// const tabs = [
//   { label: 'Active', value: 'active' },
//   { label: 'All', value: 'all' },
//   { label: 'Completed', value: 'completed' },
//   { label: 'Drafts', value: 'draft' },
// ];

// export default function CampaignScreen() {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [campaigns, setCampaigns] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const { currentBusiness } = useBusiness();
//   const { getCampaigns } = useCampaigns();

//   useEffect(() => {
//     loadCampaigns();
//   }, [currentBusiness, activeTab]);

//   useFocusEffect(
//     useCallback(() => {
//       loadCampaigns();
//     }, [])
//   );

//   const loadCampaigns = async () => {
//     if (!currentBusiness) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const status = tabs[activeTab]?.value === 'all' ? undefined : tabs[activeTab]?.value;
//       const data = await getCampaigns(currentBusiness.id, { status });
//       setCampaigns(data);
//     } catch (err) {
//       setError(err.message || 'Failed to load campaigns');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadCampaigns();
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return theme.colors.success;
//       case 'paused': return theme.colors.warning;
//       case 'completed': return theme.colors.info;
//       case 'draft': return theme.colors.textSecondary;
//       default: return theme.colors.textSecondary;
//     }
//   };

//   const calculateProgress = (campaign) => {
//     const start = new Date(campaign.startDate).getTime();
//     const end = new Date(campaign.endDate).getTime();
//     const now = Date.now();
    
//     if (now < start) return 0;
//     if (now > end) return 100;
    
//     return ((now - start) / (end - start)) * 100;
//   };

//   const renderCampaignItem = ({ item }) => {
//     const progress = calculateProgress(item);

//     return (
//       <TouchableOpacity
//         style={styles.campaignCard}
//         onPress={() => router.push(`/campaigns/${item.id}`)}
//       >
//         <View style={styles.campaignHeader}>
//           <View style={styles.campaignTitleContainer}>
//             <Ionicons name="megaphone-outline" size={24} color={theme.colors.primary} />
//             <Text style={styles.campaignTitle} numberOfLines={1}>{item.name}</Text>
//           </View>
//           <Badge
//             label={item.status}
//             color={getStatusColor(item.status)}
//             size="sm"
//           />
//         </View>

//         <Text style={styles.campaignDescription} numberOfLines={2}>
//           {item.description}
//         </Text>

//         <View style={styles.campaignMetrics}>
//           <View style={styles.metric}>
//             <Text style={styles.metricValue}>{formatCompactNumber(item.metrics?.reach || 0)}</Text>
//             <Text style={styles.metricLabel}>Reach</Text>
//           </View>
//           <View style={styles.metric}>
//             <Text style={styles.metricValue}>{formatCompactNumber(item.metrics?.engagement || 0)}</Text>
//             <Text style={styles.metricLabel}>Engagement</Text>
//           </View>
//           <View style={styles.metric}>
//             <Text style={styles.metricValue}>{item.metrics?.conversions || 0}</Text>
//             <Text style={styles.metricLabel}>Conversions</Text>
//           </View>
//         </View>

//         <View style={styles.progressContainer}>
//           <ProgressBar progress={progress} height={6} />
//           <Text style={styles.progressText}>{Math.round(progress)}%</Text>
//         </View>

//         <View style={styles.campaignFooter}>
//           <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
//           <Text style={styles.footerText}>
//             {formatDate(item.startDate, 'MMM d')} - {formatDate(item.endDate, 'MMM d, yyyy')}
//           </Text>
//         </View>

//         {item.budget && (
//           <View style={styles.campaignFooter}>
//             <Ionicons name="cash-outline" size={14} color={theme.colors.textSecondary} />
//             <Text style={styles.footerText}>
//               ${formatCompactNumber(item.budget.spent)} / ${formatCompactNumber(item.budget.total)}
//             </Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   if (loading && !refreshing) {
//     return <LoadingIndicator fullScreen text="Loading campaigns..." />;
//   }

//   if (error) {
//     return (
//       <ErrorMessage
//         fullScreen
//         message={error}
//         onRetry={loadCampaigns}
//         icon="alert-circle-outline"
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Header
//         title="Campaigns"
//         showBack={false}
//         showMenu={true}
//         rightComponent={
//           <TouchableOpacity onPress={() => router.push('/campaigns/create')}>
//             <Ionicons name="add" size={24} color={theme.colors.text} />
//           </TouchableOpacity>
//         }
//       />

//       <Tabs
//         tabs={tabs}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         variant="pills"
//         style={styles.tabs}
//       />

//       <FlatList
//         data={campaigns}
//         renderItem={renderCampaignItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <EmptyState
//             icon="megaphone-outline"
//             title="No Campaigns"
//             message={activeTab === 0 ? "No active campaigns" : "Create your first campaign"}
//             actionText="Create Campaign"
//             onAction={() => router.push('/campaigns/create')}
//           />
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   tabs: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//   },
//   listContainer: {
//     padding: theme.spacing.md,
//   },
//   campaignCard: {
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.md,
//     padding: theme.spacing.sm,
//     marginBottom: theme.spacing.sm,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   campaignHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//   },
//   campaignTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//     flex: 1,
//   },
//   campaignTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.colors.text,
//     flex: 1,
//   },
//   campaignDescription: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.sm,
//   },
//   campaignMetrics: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   metric: {
//     alignItems: 'center',
//   },
//   metricValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: theme.colors.text,
//   },
//   metricLabel: {
//     fontSize: 11,
//     color: theme.colors.textSecondary,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.sm,
//   },
//   progressText: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   campaignFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.xs,
//     marginBottom: 2,
//   },
//   footerText: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
// });


























import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useBusiness } from '../../../../../hooks/useBusiness';
import { useCampaigns } from '../../../../../hooks/useCampaigns';
import { theme } from '../../../../../styles/theme';
import { formatDate, formatCompactNumber } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Card from '../../../../../components/common/Card';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import EmptyState from '../../../../../components/common/EmptyState';
import Badge from '../../../../../components/common/Badge';
import ProgressBar from '../../../../../components/common/ProgressBar';
import Tabs from '../../../../../components/common/Tabs';

const tabs = [
  { label: 'Active', value: 'active' },
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Drafts', value: 'draft' },
];

export default function CampaignScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { currentBusiness } = useBusiness();
  const { getCampaigns } = useCampaigns();

  useEffect(() => {
    if (currentBusiness) {
      loadCampaigns();
    }
  }, [currentBusiness, activeTab]);

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadCampaigns();
      }
    }, [currentBusiness])
  );

  const loadCampaigns = async () => {
    if (!currentBusiness) return;
    
    try {
      setLoading(true);
      setError(null);
      const status = tabs[activeTab]?.value === 'all' ? undefined : tabs[activeTab]?.value;
      const data = await getCampaigns(currentBusiness._id, { status });
      setCampaigns(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'paused': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'draft': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const calculateProgress = (campaign) => {
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return ((now - start) / (end - start)) * 100;
  };

  const renderCampaignItem = ({ item }) => {
    const progress = calculateProgress(item);

    return (
      <TouchableOpacity
        style={styles.campaignCard}
        onPress={() => router.push(`/campaigns/${item._id}`)}
      >
        <View style={styles.campaignHeader}>
          <View style={styles.campaignTitleContainer}>
            <Ionicons name="megaphone-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.campaignTitle} numberOfLines={1}>{item.name}</Text>
          </View>
          <Badge
            label={item.status}
            color={getStatusColor(item.status)}
            size="sm"
          />
        </View>

        <Text style={styles.campaignDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.campaignMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatCompactNumber(item.metrics?.reach || 0)}</Text>
            <Text style={styles.metricLabel}>Reach</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{formatCompactNumber(item.metrics?.engagement || 0)}</Text>
            <Text style={styles.metricLabel}>Engagement</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{item.metrics?.conversions || 0}</Text>
            <Text style={styles.metricLabel}>Conversions</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} height={6} />
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <View style={styles.campaignFooter}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.footerText}>
            {formatDate(item.startDate, 'MMM d')} - {formatDate(item.endDate, 'MMM d, yyyy')}
          </Text>
        </View>

        {item.budget && (
          <View style={styles.campaignFooter}>
            <Ionicons name="cash-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.footerText}>
              ${formatCompactNumber(item.budget.spent)} / ${formatCompactNumber(item.budget.total)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading campaigns..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadCampaigns}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Campaigns"
        showBack={false}
        showMenu={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/campaigns/create')}>
            <Ionicons name="add" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        style={styles.tabs}
      />

      <FlatList
        data={campaigns}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="megaphone-outline"
            title="No Campaigns"
            message={activeTab === 0 ? "No active campaigns" : "Create your first campaign"}
            actionText="Create Campaign"
            onAction={() => router.push('/campaigns/create')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabs: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  campaignCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  campaignTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  campaignDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  campaignMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  campaignFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});