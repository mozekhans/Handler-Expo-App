// import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
// import { useState, useEffect, useCallback } from 'react';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// // import { LineChart, PieChart } from 'react-native-chart-kit';
// import { useBusiness } from '../../../../hooks/useBusiness';
// import { useAnalytics } from '../../../../hooks/useAnalytics';
// import { theme } from '../../../../styles/theme';
// import { formatCompactNumber } from '../../../../utils/formatters';
// import Header from '../../../../components/common/Header';
// import Card from '../../../../components/common/Card';
// import LoadingIndicator from '../../../../components/common/LoadingIndicator';
// import ErrorMessage from '../../../../components/common/ErrorMessage';
// import Tabs from '../../../../components/common/Tabs';

// const { width } = Dimensions.get('window');

// const timeframes = [
//   { label: 'Week', value: 'week' },
//   { label: 'Month', value: 'month' },
//   { label: 'Year', value: 'year' },
// ];

// export default function AnalyticsScreen() {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [timeframe, setTimeframe] = useState(0);
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const { currentBusiness } = useBusiness();
//   const { getAnalytics } = useAnalytics();

//   useEffect(() => {
//     loadAnalytics();
//   }, [currentBusiness, timeframe]);

//   useFocusEffect(
//     useCallback(() => {
//       loadAnalytics();
//     }, [])
//   );

//   const loadAnalytics = async () => {
//     if (!currentBusiness) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getAnalytics(currentBusiness.id, {
//         timeframe: timeframes[timeframe]?.value,
//       });
//       setAnalyticsData(data);
//     } catch (err) {
//       setError(err.message || 'Failed to load analytics');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadAnalytics();
//   };

//   const MetricCard = ({ title, value, change, icon, color }) => (
//     <View style={[styles.metricCard, { borderLeftColor: color }]}>
//       <View style={styles.metricHeader}>
//         <Ionicons name={icon} size={20} color={color} />
//         <Text style={[styles.metricChange, { color: change >= 0 ? theme.colors.success : theme.colors.error }]}>
//           {change > 0 ? '+' : ''}{change}%
//         </Text>
//       </View>
//       <Text style={styles.metricValue}>{value}</Text>
//       <Text style={styles.metricTitle}>{title}</Text>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return <LoadingIndicator fullScreen text="Loading analytics..." />;
//   }

//   if (error) {
//     return (
//       <ErrorMessage
//         fullScreen
//         message={error}
//         onRetry={loadAnalytics}
//         icon="alert-circle-outline"
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Header
//         title="Analytics"
//         showBack={false}
//         showMenu={true}
//         rightComponent={
//           <TouchableOpacity onPress={() => router.push('/settings/export')}>
//             <Ionicons name="download-outline" size={24} color={theme.colors.text} />
//           </TouchableOpacity>
//         }
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View style={styles.timeframeContainer}>
//           {timeframes.map((tf, index) => (
//             <TouchableOpacity
//               key={tf.value}
//               style={[
//                 styles.timeframeButton,
//                 timeframe === index && styles.timeframeButtonActive,
//               ]}
//               onPress={() => setTimeframe(index)}
//             >
//               <Text
//                 style={[
//                   styles.timeframeText,
//                   timeframe === index && styles.timeframeTextActive,
//                 ]}
//               >
//                 {tf.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.metricsGrid}>
//           <MetricCard
//             title="Engagement"
//             value={formatCompactNumber(analyticsData?.engagement?.total || 0)}
//             change={analyticsData?.engagement?.change || 0}
//             icon="thumbs-up-outline"
//             color={theme.colors.primary}
//           />
//           <MetricCard
//             title="Reach"
//             value={formatCompactNumber(analyticsData?.reach?.total || 0)}
//             change={analyticsData?.reach?.change || 0}
//             icon="eye-outline"
//             color={theme.colors.success}
//           />
//           <MetricCard
//             title="Followers"
//             value={formatCompactNumber(analyticsData?.followers?.total || 0)}
//             change={analyticsData?.followers?.change || 0}
//             icon="people-outline"
//             color={theme.colors.warning}
//           />
//           <MetricCard
//             title="Posts"
//             value={analyticsData?.posts?.total || 0}
//             change={analyticsData?.posts?.change || 0}
//             icon="create-outline"
//             color={theme.colors.secondary}
//           />
//         </View>

//         {/* <Card style={styles.chartCard}>
//           <Text style={styles.chartTitle}>Engagement Over Time</Text>
//           {analyticsData?.chartData && (
//             <LineChart
//               data={{
//                 labels: analyticsData.chartData.labels || [],
//                 datasets: [{
//                   data: analyticsData.chartData.values || [],
//                 }]
//               }}
//               width={width - 48}
//               height={220}
//               chartConfig={{
//                 backgroundColor: 'transparent',
//                 backgroundGradientFrom: 'transparent',
//                 backgroundGradientTo: 'transparent',
//                 decimalPlaces: 0,
//                 color: (opacity = 1) => theme.colors.primary,
//                 labelColor: (opacity = 1) => theme.colors.textSecondary,
//                 style: {
//                   borderRadius: 16,
//                 },
//                 propsForDots: {
//                   r: '4',
//                   strokeWidth: '2',
//                   stroke: theme.colors.primary,
//                 },
//               }}
//               bezier
//               style={styles.chart}
//             />
//           )}
//         </Card> */}

//         {/* <Card style={styles.chartCard}>
//           <Text style={styles.chartTitle}>Platform Distribution</Text>
//           {analyticsData?.platformData && (
//             <PieChart
//               data={analyticsData.platformData.map(item => ({
//                 name: item.platform,
//                 population: item.value,
//                 color: item.color,
//                 legendFontColor: theme.colors.text,
//                 legendFontSize: 12,
//               }))}
//               width={width - 48}
//               height={200}
//               chartConfig={{
//                 color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               }}
//               accessor="population"
//               backgroundColor="transparent"
//               paddingLeft="15"
//               absolute
//             />
//           )}
//         </Card> */}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   timeframeContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     gap: theme.spacing.sm,
//   },
//   timeframeButton: {
//     flex: 1,
//     paddingVertical: theme.spacing.sm,
//     alignItems: 'center',
//     borderRadius: theme.borderRadius.md,
//     backgroundColor: theme.colors.surface,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   timeframeButtonActive: {
//     backgroundColor: theme.colors.primary,
//     borderColor: theme.colors.primary,
//   },
//   timeframeText: {
//     fontSize: 14,
//     color: theme.colors.text,
//   },
//   timeframeTextActive: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: theme.spacing.md,
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//   },
//   metricCard: {
//     width: '48%',
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.md,
//     padding: theme.spacing.sm,
//     borderLeftWidth: 4,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.xs,
//   },
//   metricChange: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   metricValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 2,
//   },
//   metricTitle: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   chartCard: {
//     marginHorizontal: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     padding: theme.spacing.sm,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.sm,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// });

















import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import { MetricCard, Sparkline } from '../../../../components/charts';

const { width: screenWidth } = Dimensions.get('window');

const QUICK_ACTIONS = [
  {
    title: 'Overview',
    icon: 'stats-chart-outline',
    path: '/analytics-overview',
    color: '#1976D2',
    description: 'Key metrics at a glance',
  },
  {
    title: 'Engagement',
    icon: 'heart-outline',
    path: '/engagement-analytics',
    color: '#E91E63',
    description: 'Likes, comments, shares',
  },
  {
    title: 'Content',
    icon: 'document-text-outline',
    path: '/content-analytics',
    color: '#4CAF50',
    description: 'Post performance',
  },
  {
    title: 'Audience',
    icon: 'people-outline',
    path: '/audience-analytics',
    color: '#9C27B0',
    description: 'Demographics & growth',
  },
  {
    title: 'Campaigns',
    icon: 'megaphone-outline',
    path: '/campaigns-analytics',
    color: '#FF9800',
    description: 'ROI & performance',
  },
  {
    title: 'Competitors',
    icon: 'business-outline',
    path: '/competitors-analytics',
    color: '#F44336',
    description: 'Market comparison',
  },
  {
    title: 'Benchmarks',
    icon: 'trending-up-outline',
    path: '/(app)/analytics/benchmarks',
    color: '#00BCD4',
    description: 'Industry standards',
  },
  {
    title: 'Reports',
    icon: 'document-text-outline',
    path: '/reports-analytics',
    color: '#607D8B',
    description: 'Export & schedule',
  },
];

export default function AnalyticsIndexScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getDashboard, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadDashboard();
      }
    }, [currentBusiness])
  );

  const loadDashboard = async () => {
    const data = await getDashboard(currentBusiness?.id);
    if (data) {
      setDashboardData(data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const formatMetric = (value) => {
    if (!value) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Analytics" showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Analytics Dashboard
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Track your social media performance
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Followers"
            value={formatMetric(dashboardData?.overview?.followers?.total)}
            change={dashboardData?.overview?.followers?.growth}
            icon="people-outline"
            color={colors.primary}
          />
          <MetricCard
            title="Engagement Rate"
            value={`${(dashboardData?.engagement?.rate || 0).toFixed(1)}%`}
            change={dashboardData?.engagement?.rateChange}
            icon="heart-outline"
            color={colors.secondary}
          />
          <MetricCard
            title="Total Reach"
            value={formatMetric(dashboardData?.overview?.reach?.total)}
            change={dashboardData?.overview?.reach?.growth}
            icon="eye-outline"
            color={colors.info}
          />
          <MetricCard
            title="Posts Published"
            value={dashboardData?.content?.published || 0}
            change={dashboardData?.content?.publishedChange}
            icon="document-text-outline"
            color={colors.success}
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Analytics Modules</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.title}
                style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(action.path)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
                <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                  {action.description}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} style={styles.quickActionArrow} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Insights */}
        {dashboardData?.insights?.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Insights</Text>
            {dashboardData.insights.slice(0, 3).map((insight, index) => (
              <Card
                key={index}
                style={[
                  styles.insightCard,
                  insight.type === 'positive' && { backgroundColor: colors.success + '10' },
                  insight.type === 'warning' && { backgroundColor: colors.warning + '10' },
                ]}
              >
                <View style={styles.insightHeader}>
                  <Ionicons
                    name={insight.type === 'positive' ? 'trending-up' : 'alert-circle'}
                    size={20}
                    color={insight.type === 'positive' ? colors.success : colors.warning}
                  />
                  <Text style={[styles.insightTitle, { color: colors.text }]}>{insight.title}</Text>
                </View>
                <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>
                  {insight.description}
                </Text>
                <TouchableOpacity
                  style={styles.insightAction}
                  onPress={() => {
                    if (insight.metric === 'engagement') {
                      router.push('/(app)/analytics/engagement');
                    } else if (insight.metric === 'content') {
                      router.push('/(app)/analytics/content');
                    } else {
                      router.push('/(app)/analytics/overview');
                    }
                  }}
                >
                  <Text style={[styles.insightActionText, { color: colors.primary }]}>
                    View Details
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Reports */}
        {dashboardData?.recentReports?.length > 0 && (
          <View style={styles.reportsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reports</Text>
            {dashboardData.recentReports.slice(0, 3).map((report, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.reportItem, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/(app)/analytics/report/${report._id}`)}
              >
                <View>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>{report.title}</Text>
                  <Text style={[styles.reportDate, { color: colors.textSecondary }]}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.reportStatus}>
                  <View style={[styles.statusDot, { backgroundColor: report.status === 'completed' ? colors.success : colors.warning }]} />
                  <Text style={[styles.reportStatusText, { color: report.status === 'completed' ? colors.success : colors.warning }]}>
                    {report.status === 'completed' ? 'Ready' : 'Generating'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (screenWidth - 48) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  quickActionArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reportsSection: {
    marginBottom: 16,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 11,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reportStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
});