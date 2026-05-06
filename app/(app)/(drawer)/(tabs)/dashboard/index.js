// import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
// import { useState, useEffect, useCallback } from 'react';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import { useBusiness } from '../../../../../hooks/useBusiness';
// import { useAnalytics } from '../../../../../hooks/useAnalytics';
// import { useNotifications } from '../../../../../hooks/useNotifications';
// import { useAuth } from '../../../../../hooks/useAuth';
// import { theme } from '../../../../../styles/theme';
// import { formatCompactNumber, formatRelativeTime } from '../../../../../utils/formatters';
// import Header from '../../../../../components/common/Header';
// import Card from '../../../../../components/common/Card';
// import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
// import ErrorMessage from '../../../../../components/common/ErrorMessage';
// import EmptyState from '../../../../../components/common/EmptyState';

// const { width } = Dimensions.get('window');

// export default function DashboardScreen() {
//   const [refreshing, setRefreshing] = useState(false);
//   const [screenLoading, setScreenLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dashboardData, setDashboardData] = useState(null);

//   const { 
//     currentBusiness, 
//     businesses,
//     loading: businessLoading, 
//     error: businessError,
//     loadBusinesses 
//   } = useBusiness();
//   const { getDashboardData } = useAnalytics();
//   const { unreadCount } = useNotifications();
//   const { user } = useAuth();

//   // Load businesses on mount if not loaded
//   useEffect(() => {
//     if (businesses.length === 0 && !businessLoading) {
//       loadBusinesses();
//     }
//   }, []);

//   // Load dashboard data when business is available
//   useEffect(() => {
//     if (currentBusiness && !businessLoading) {
//       loadDashboardData();
//     } else if (!currentBusiness && !businessLoading) {
//       setScreenLoading(false);
//       setDashboardData(null);
//     }
//   }, [currentBusiness, businessLoading]);

//   useFocusEffect(
//     useCallback(() => {
//       if (currentBusiness) {
//         loadDashboardData();
//       }
//     }, [currentBusiness])
//   );

//   const loadDashboardData = async () => {
//     if (!currentBusiness) {
//       setScreenLoading(false);
//       setDashboardData(null);
//       return;
//     }

//     try {
//       setScreenLoading(true);
//       setError(null);
//       const data = await getDashboardData(currentBusiness._id);
//       setDashboardData(data);
//     } catch (err) {
//       setError(err.message || 'Failed to load dashboard data');
//     } finally {
//       setScreenLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadDashboardData();
//   };

//   const getTimeOfDay = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Morning';
//     if (hour < 18) return 'Afternoon';
//     return 'Evening';
//   };

//   const MetricCard = ({ title, value, change, icon, color, onPress }) => (
//     <TouchableOpacity style={[styles.metricCard, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.7}>
//       <View style={styles.metricHeader}>
//         <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
//           <Ionicons name={icon} size={24} color={color} />
//         </View>
//         <Text style={[styles.metricChange, { color: change >= 0 ? theme.colors.success : theme.colors.error }]}>
//           {change > 0 ? '+' : ''}{change}%
//         </Text>
//       </View>
//       <Text style={styles.metricValue}>{value}</Text>
//       <Text style={styles.metricTitle}>{title}</Text>
//     </TouchableOpacity>
//   );

//   const ActivityItem = ({ item }) => (
//     <View style={styles.activityItem}>
//       <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
//         <Ionicons name={item.icon} size={20} color={item.color} />
//       </View>
//       <View style={styles.activityContent}>
//         <Text style={styles.activityText}>{item.text}</Text>
//         <Text style={styles.activityTime}>{item.time}</Text>
//       </View>
//     </View>
//   );

//   // Show loading while business context is initializing
//   if (businessLoading) {
//     return (
//       <View style={styles.container}>
//         <Header title="Dashboard" showBack={false} showMenu={true} />
//         <LoadingIndicator fullScreen text="Loading..." />
//       </View>
//     );
//   }

//   // Show error if business context failed
//   if (businessError) {
//     return (
//       <View style={styles.container}>
//         <Header title="Dashboard" showBack={false} showMenu={true} />
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
//         <Header 
//           title="Dashboard" 
//           showBack={false} 
//           showMenu={true}
//           rightComponent={
//             <TouchableOpacity onPress={() => router.push('/notifications')}>
//               <View>
//                 <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
//                 {unreadCount > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           }
//         />
//         <EmptyState
//           icon="business-outline"
//           title="No Business Selected"
//           message="Please select or create a business to view your dashboard"
//           actionText="Get Started"
//           onAction={() => router.push('/business/select')}
//         />
//       </View>
//     );
//   }

//   // Show screen-specific loading or error
//   if (screenLoading && !refreshing) {
//     return (
//       <View style={styles.container}>
//         <Header 
//           title="Dashboard" 
//           showBack={false} 
//           showMenu={true}
//           rightComponent={
//             <TouchableOpacity onPress={() => router.push('/notifications')}>
//               <View>
//                 <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
//                 {unreadCount > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           }
//         />
//         <LoadingIndicator fullScreen text="Loading dashboard..." />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Header 
//           title="Dashboard" 
//           showBack={false} 
//           showMenu={true}
//           rightComponent={
//             <TouchableOpacity onPress={() => router.push('/notifications')}>
//               <View>
//                 <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
//                 {unreadCount > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           }
//         />
//         <ErrorMessage
//           fullScreen
//           message={error}
//           onRetry={loadDashboardData}
//           icon="alert-circle-outline"
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Header 
//         title="Dashboard" 
//         showBack={false} 
//         showMenu={true}
//         rightComponent={
//           <TouchableOpacity onPress={() => router.push('/notifications')}>
//             <View>
//               <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
//               {unreadCount > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         }
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Welcome Section */}
//         <View style={styles.welcomeSection}>
//           <Text style={styles.greeting}>
//             Good {getTimeOfDay()}, {user?.firstName || 'User'}!
//           </Text>
//           <Text style={styles.subGreeting}>
//             Welcome back to {currentBusiness?.name}
//           </Text>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <TouchableOpacity
//             style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
//             onPress={() => router.push('/content/create')}
//           >
//             <Ionicons name="add" size={24} color="#fff" />
//             <Text style={styles.actionText}>Create Post</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
//             onPress={() => router.push('/calendar')}
//           >
//             <Ionicons name="calendar" size={24} color="#fff" />
//             <Text style={styles.actionText}>Schedule</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
//             onPress={() => router.push('/engagement')}
//           >
//             <Ionicons name="chatbubbles" size={24} color="#fff" />
//             <Text style={styles.actionText}>Engage</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Key Metrics */}
//         <Text style={styles.sectionTitle}>Overview</Text>
//         <View style={styles.metricsGrid}>
//           <MetricCard
//             title="Total Followers"
//             value={formatCompactNumber(dashboardData?.followers?.total || 0)}
//             change={dashboardData?.followers?.growth || 0}
//             icon="people-outline"
//             color={theme.colors.primary}
//             onPress={() => router.push('/analytics')}
//           />
//           <MetricCard
//             title="Engagement Rate"
//             value={`${dashboardData?.engagement?.rate || 0}%`}
//             change={dashboardData?.engagement?.change || 0}
//             icon="thumbs-up-outline"
//             color={theme.colors.success}
//             onPress={() => router.push('/analytics')}
//           />
//           <MetricCard
//             title="Total Reach"
//             value={formatCompactNumber(dashboardData?.reach?.total || 0)}
//             change={dashboardData?.reach?.change || 0}
//             icon="eye-outline"
//             color={theme.colors.warning}
//             onPress={() => router.push('/analytics')}
//           />
//           <MetricCard
//             title="Total Posts"
//             value={dashboardData?.posts?.total || 0}
//             change={dashboardData?.posts?.change || 0}
//             icon="create-outline"
//             color={theme.colors.secondary}
//             onPress={() => router.push('/content')}
//           />
//         </View>

//         {/* Recent Activity */}
//         <Text style={styles.sectionTitle}>Recent Activity</Text>
//         <Card style={styles.activityCard}>
//           {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
//             dashboardData.recentActivity.slice(0, 5).map((item, index) => (
//               <ActivityItem key={index} item={item} />
//             ))
//           ) : (
//             <View style={styles.noActivity}>
//               <Ionicons name="time-outline" size={48} color={theme.colors.textSecondary} />
//               <Text style={styles.noActivityText}>No recent activity</Text>
//               <Text style={styles.noActivitySubtext}>Your recent actions will appear here</Text>
//             </View>
//           )}
//         </Card>

//         {/* Upcoming Scheduled Posts */}
//         {dashboardData?.upcomingPosts && dashboardData.upcomingPosts.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Upcoming Posts</Text>
//             <Card style={styles.upcomingCard}>
//               {dashboardData.upcomingPosts.slice(0, 3).map((post, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.upcomingItem}
//                   onPress={() => router.push(`/content/${post.id}`)}
//                 >
//                   <View style={styles.upcomingInfo}>
//                     <Text style={styles.upcomingTitle} numberOfLines={1}>{post.title}</Text>
//                     <Text style={styles.upcomingTime}>
//                       <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
//                       {' '}{formatRelativeTime(post.scheduledFor)}
//                     </Text>
//                   </View>
//                   <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
//                 </TouchableOpacity>
//               ))}
//               {dashboardData.upcomingPosts.length > 3 && (
//                 <TouchableOpacity
//                   style={styles.viewAllButton}
//                   onPress={() => router.push('/calendar')}
//                 >
//                   <Text style={styles.viewAllText}>View all scheduled posts</Text>
//                   <Ionicons name="arrow-forward-outline" size={16} color={theme.colors.primary} />
//                 </TouchableOpacity>
//               )}
//             </Card>
//           </>
//         )}

//         {/* Platform Performance */}
//         {dashboardData?.platformPerformance && dashboardData.platformPerformance.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Platform Performance</Text>
//             <Card style={styles.platformCard}>
//               {dashboardData.platformPerformance.map((platform, index) => (
//                 <View key={index} style={styles.platformItem}>
//                   <View style={styles.platformHeader}>
//                     <Ionicons 
//                       name={platform.icon || 'logo-facebook'} 
//                       size={20} 
//                       color={platform.color || theme.colors.primary} 
//                     />
//                     <Text style={styles.platformName}>{platform.name}</Text>
//                     <Text style={styles.platformEngagement}>
//                       {formatCompactNumber(platform.engagement)} engagements
//                     </Text>
//                   </View>
//                   <View style={styles.platformProgress}>
//                     <View 
//                       style={[
//                         styles.platformProgressFill, 
//                         { width: `${platform.percentage}%`, backgroundColor: platform.color || theme.colors.primary }
//                       ]} 
//                     />
//                   </View>
//                   <Text style={styles.platformPercentage}>{platform.percentage}% of total</Text>
//                 </View>
//               ))}
//             </Card>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   badge: {
//     position: 'absolute',
//     top: -4,
//     right: -8,
//     backgroundColor: theme.colors.error,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   welcomeSection: {
//     paddingHorizontal: theme.spacing.md,
//     paddingTop: theme.spacing.sm,
//     paddingBottom: theme.spacing.md,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 4,
//   },
//   subGreeting: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//   },
//   quickActions: {
//     flexDirection: 'row',
//     paddingHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.lg,
//     gap: theme.spacing.sm,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: theme.spacing.sm,
//     paddingHorizontal: theme.spacing.md,
//     borderRadius: theme.borderRadius.md,
//     gap: theme.spacing.xs,
//   },
//   actionText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.sm,
//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: theme.spacing.md,
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.lg,
//   },
//   metricCard: {
//     width: '48%',
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.md,
//     padding: theme.spacing.md,
//     borderLeftWidth: 4,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.sm,
//   },
//   metricIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   metricChange: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   metricValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 4,
//   },
//   metricTitle: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   activityCard: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.lg,
//     padding: theme.spacing.sm,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: theme.spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   activityIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.sm,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityText: {
//     fontSize: 14,
//     color: theme.colors.text,
//     marginBottom: 2,
//   },
//   activityTime: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   noActivity: {
//     alignItems: 'center',
//     padding: theme.spacing.xl,
//   },
//   noActivityText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: theme.colors.text,
//     marginTop: theme.spacing.md,
//   },
//   noActivitySubtext: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   upcomingCard: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.lg,
//     padding: theme.spacing.sm,
//   },
//   upcomingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: theme.spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   upcomingInfo: {
//     flex: 1,
//   },
//   upcomingTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: theme.colors.text,
//     marginBottom: 4,
//   },
//   upcomingTime: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   viewAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: theme.spacing.sm,
//     gap: theme.spacing.xs,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: theme.colors.primary,
//     fontWeight: '500',
//   },
//   platformCard: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.lg,
//     padding: theme.spacing.md,
//   },
//   platformItem: {
//     marginBottom: theme.spacing.md,
//   },
//   platformHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//     gap: theme.spacing.sm,
//   },
//   platformName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: theme.colors.text,
//     flex: 1,
//   },
//   platformEngagement: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   platformProgress: {
//     height: 6,
//     backgroundColor: theme.colors.border,
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 4,
//   },
//   platformProgressFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   platformPercentage: {
//     fontSize: 11,
//     color: theme.colors.textSecondary,
//   },
// });













// app/(app)/(drawer)/(tabs)/index.js
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useBusiness } from '../../../../../hooks/useBusiness';
import { useAnalytics } from '../../../../../hooks/useAnalytics';
import { useNotifications } from '../../../../../hooks/useNotifications';
import { useAuth } from '../../../../../hooks/useAuth';
import { theme } from '../../../../../styles/theme';
import { formatCompactNumber, formatRelativeTime } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Card from '../../../../../components/common/Card';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import EmptyState from '../../../../../components/common/EmptyState';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const { 
    currentBusiness, 
    businesses,
    loading: businessLoading, 
    error: businessError,
    loadBusinesses 
  } = useBusiness();
  
  // Get getDashboard from useAnalytics (not getDashboardData)
  const { getDashboard, getRecentActivity } = useAnalytics();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  // Load businesses on mount if not loaded
  useEffect(() => {
    if (businesses.length === 0 && !businessLoading) {
      loadBusinesses();
    }
  }, []);

  // Load dashboard data when business is available
  useEffect(() => {
    if (currentBusiness?._id && !businessLoading) {
      loadDashboardData();
    } else if (!currentBusiness && !businessLoading) {
      setScreenLoading(false);
      setDashboardData(null);
    }
  }, [currentBusiness?._id, businessLoading]);

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness?._id) {
        loadDashboardData();
      }
    }, [currentBusiness?._id])
  );

  const loadDashboardData = async () => {
    if (!currentBusiness?._id) {
      setScreenLoading(false);
      setDashboardData(null);
      return;
    }

    try {
      setScreenLoading(true);
      setError(null);
      
      // Use getDashboard with business ID
      const data = await getDashboard(currentBusiness._id);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setScreenLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const MetricCard = ({ title, value, change, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.metricCard, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {change !== undefined && change !== null && (
          <Text style={[styles.metricChange, { color: change >= 0 ? theme.colors.success : theme.colors.error }]}>
            {change > 0 ? '+' : ''}{change}%
          </Text>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: (item.color || theme.colors.primary) + '20' }]}>
        <Ionicons name={item.icon || 'notifications-outline'} size={20} color={item.color || theme.colors.primary} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{item.text}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  // Show loading while business context is initializing
  if (businessLoading) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showBack={false} showMenu={true} />
        <LoadingIndicator fullScreen text="Loading..." />
      </View>
    );
  }

  // Show error if business context failed
  if (businessError) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showBack={false} showMenu={true} />
        <ErrorMessage
          fullScreen
          message={businessError}
          onRetry={loadBusinesses}
          icon="alert-circle-outline"
        />
      </View>
    );
  }

  // Show empty state if no business selected
  if (!currentBusiness) {
    return (
      <View style={styles.container}>
        <Header 
          title="Dashboard" 
          showBack={false} 
          showMenu={true}
          rightComponent={
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          }
        />
        <EmptyState
          icon="business-outline"
          title="No Business Selected"
          message="Please select or create a business to view your dashboard"
          actionText="Get Started"
          onAction={() => router.push('/business/select')}
        />
      </View>
    );
  }

  // Show screen-specific loading or error
  if (screenLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header 
          title="Dashboard" 
          showBack={false} 
          showMenu={true}
          rightComponent={
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          }
        />
        <LoadingIndicator fullScreen text="Loading dashboard..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header 
          title="Dashboard" 
          showBack={false} 
          showMenu={true}
          rightComponent={
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <View>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          }
        />
        <ErrorMessage
          fullScreen
          message={error}
          onRetry={loadDashboardData}
          icon="alert-circle-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard" 
        showBack={false} 
        showMenu={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <View>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            Good {getTimeOfDay()}, {user?.firstName || 'User'}!
          </Text>
          <Text style={styles.subGreeting}>
            Welcome back to {currentBusiness?.name}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/content/create')}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.actionText}>Create Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={() => router.push('/calendar')}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
            onPress={() => router.push('/content')}
          >
            <Ionicons name="document-text" size={24} color="#fff" />
            <Text style={styles.actionText}>Content</Text>
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Followers"
            value={formatCompactNumber(dashboardData?.followers?.total || 0)}
            change={dashboardData?.followers?.growth || 0}
            icon="people-outline"
            color={theme.colors.primary}
            onPress={() => router.push('/analytics')}
          />
          <MetricCard
            title="Engagement Rate"
            value={`${dashboardData?.engagement?.rate || 0}%`}
            change={dashboardData?.engagement?.change || 0}
            icon="thumbs-up-outline"
            color={theme.colors.success}
            onPress={() => router.push('/analytics')}
          />
          <MetricCard
            title="Total Reach"
            value={formatCompactNumber(dashboardData?.reach?.total || 0)}
            change={dashboardData?.reach?.change || 0}
            icon="eye-outline"
            color={theme.colors.warning}
            onPress={() => router.push('/analytics')}
          />
          <MetricCard
            title="Total Posts"
            value={dashboardData?.posts?.total || 0}
            change={dashboardData?.posts?.change || 0}
            icon="create-outline"
            color={theme.colors.secondary}
            onPress={() => router.push('/content')}
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
            dashboardData.recentActivity.slice(0, 5).map((item, index) => (
              <ActivityItem key={index} item={item} />
            ))
          ) : (
            <View style={styles.noActivity}>
              <Ionicons name="time-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noActivityText}>No recent activity</Text>
              <Text style={styles.noActivitySubtext}>Your recent actions will appear here</Text>
            </View>
          )}
        </Card>

        {/* Upcoming Scheduled Posts */}
        {dashboardData?.upcomingPosts && dashboardData.upcomingPosts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Posts</Text>
            <Card style={styles.upcomingCard}>
              {dashboardData.upcomingPosts.slice(0, 3).map((post, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.upcomingItem}
                  onPress={() => router.push(`/content/${post.id}`)}
                >
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle} numberOfLines={1}>{post.title}</Text>
                    <Text style={styles.upcomingTime}>
                      <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                      {' '}{formatRelativeTime(post.scheduledFor)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
              {dashboardData.upcomingPosts.length > 3 && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push('/calendar')}
                >
                  <Text style={styles.viewAllText}>View all scheduled posts</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
            </Card>
          </>
        )}

        {/* Platform Performance */}
        {dashboardData?.platformPerformance && dashboardData.platformPerformance.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Platform Performance</Text>
            <Card style={styles.platformCard}>
              {dashboardData.platformPerformance.map((platform, index) => (
                <View key={index} style={styles.platformItem}>
                  <View style={styles.platformHeader}>
                    <Ionicons 
                      name={platform.icon || 'logo-facebook'} 
                      size={20} 
                      color={platform.color || theme.colors.primary} 
                    />
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={styles.platformEngagement}>
                      {formatCompactNumber(platform.engagement)} engagements
                    </Text>
                  </View>
                  <View style={styles.platformProgress}>
                    <View 
                      style={[
                        styles.platformProgressFill, 
                        { width: `${platform.percentage}%`, backgroundColor: platform.color || theme.colors.primary }
                      ]} 
                    />
                  </View>
                  <Text style={styles.platformPercentage}>{platform.percentage}% of total</Text>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  welcomeSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activityCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  noActivity: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  noActivityText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  upcomingCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  upcomingTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  platformCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  platformItem: {
    marginBottom: theme.spacing.md,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  platformEngagement: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  platformProgress: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  platformProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  platformPercentage: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});