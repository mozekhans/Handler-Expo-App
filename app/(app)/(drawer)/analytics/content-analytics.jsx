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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import { MetricCard, ProgressBar } from '../../../../components/charts';

const { width: screenWidth } = Dimensions.get('window');

const PERIODS = [
  { label: '7 Days', value: 'last_7_days' },
  { label: '30 Days', value: 'last_30_days' },
  { label: '90 Days', value: 'last_90_days' },
];

const CONTENT_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'Carousels', value: 'carousel' },
  { label: 'Text Only', value: 'text' },
  { label: 'Stories', value: 'story' },
  { label: 'Reels', value: 'reel' },
];

export default function ContentAnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [contentData, setContentData] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getContentMetrics, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadContentData();
      }
    }, [currentBusiness, selectedPeriod, selectedType, selectedPlatform])
  );

  const loadContentData = async () => {
    const data = await getContentMetrics(currentBusiness?.id, {
      period: selectedPeriod,
      type: selectedType || undefined,
      platform: selectedPlatform || undefined,
    });
    if (data) {
      setContentData(data.content);
      setTopPosts(data.topPosts || []);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContentData();
    setRefreshing(false);
  };

  const getPerformanceChartData = () => {
    const history = contentData?.performance?.historical || [];
    return {
      labels: history.slice(-14).map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{ data: history.slice(-14).map(d => d.engagement || 0) }],
    };
  };

  const getTypePieData = () => {
    const byType = contentData?.byType || {};
    const colors = {
      image: '#4CAF50',
      video: '#2196F3',
      carousel: '#FF9800',
      text: '#9C27B0',
      story: '#E91E63',
      reel: '#00BCD4',
    };
    return Object.entries(byType).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      population: count,
      color: colors[type] || '#9E9E9E',
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const getPlatformBarData = () => {
    const byPlatform = contentData?.byPlatform || {};
    return {
      labels: Object.keys(byPlatform).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
      datasets: [{ data: Object.values(byPlatform) }],
    };
  };

  const formatMetric = (value) => {
    if (!value) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const getEngagementRateColor = (rate) => {
    if (rate >= 5) return colors.success;
    if (rate >= 2) return colors.warning;
    return colors.error;
  };

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Content Analytics" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Period</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker
                selectedValue={selectedPeriod}
                onValueChange={setSelectedPeriod}
                style={{ color: colors.text }}
              >
                {PERIODS.map(p => (
                  <Picker.Item key={p.value} label={p.label} value={p.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Content Type</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker
                selectedValue={selectedType}
                onValueChange={setSelectedType}
                style={{ color: colors.text }}
              >
                {CONTENT_TYPES.map(t => (
                  <Picker.Item key={t.value} label={t.label} value={t.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Posts"
            value={contentData?.total || 0}
            change={contentData?.publishedChange}
            icon="document-text-outline"
            color={colors.primary}
          />
          <MetricCard
            title="Published"
            value={contentData?.published || 0}
            icon="checkmark-circle-outline"
            color={colors.success}
          />
          <MetricCard
            title="Scheduled"
            value={contentData?.scheduled || 0}
            icon="calendar-outline"
            color={colors.warning}
          />
          <MetricCard
            title="Drafts"
            value={contentData?.drafts || 0}
            icon="create-outline"
            color={colors.textSecondary}
          />
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsRow}>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Total Engagement</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(contentData?.performance?.engagement)}
            </Text>
          </Card>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Avg. Engagement/Post</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(contentData?.performance?.averageEngagement)}
            </Text>
          </Card>
        </View>

        <View style={styles.metricsRow}>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Total Likes</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(contentData?.performance?.likes)}
            </Text>
          </Card>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Total Comments</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(contentData?.performance?.comments)}
            </Text>
          </Card>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Total Shares</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(contentData?.performance?.shares)}
            </Text>
          </Card>
        </View>

        {/* Engagement Trend Chart */}
        {contentData?.performance?.historical?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement Trend</Text>
            <LineChart
              data={getPerformanceChartData()}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        )}

        {/* Content Type Distribution */}
        {getTypePieData().length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Content Type Distribution</Text>
            <PieChart
              data={getTypePieData()}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                color: (opacity = 1) => colors.text,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card>
        )}

        {/* Platform Distribution */}
        {Object.keys(contentData?.byPlatform || {}).length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Posts by Platform</Text>
            <BarChart
              data={getPlatformBarData()}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </Card>
        )}

        {/* Top Performing Posts */}
        {topPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Performing Posts</Text>
            {topPosts.slice(0, 10).map((post, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.postItem, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/(app)/content/${post.postId}`)}
              >
                <View style={styles.postRank}>
                  <Text style={[styles.postRankText, { color: colors.primary }]}>#{index + 1}</Text>
                </View>
                <View style={styles.postDetails}>
                  <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={2}>
                    {post.title || 'Untitled Post'}
                  </Text>
                  <View style={styles.postStats}>
                    <Text style={[styles.postStat, { color: colors.textSecondary }]}>
                      <Ionicons name="heart-outline" size={12} /> {formatMetric(post.engagement)}
                    </Text>
                    <Text style={[styles.postStat, { color: colors.textSecondary }]}>
                      <Ionicons name="eye-outline" size={12} /> {formatMetric(post.reach)}
                    </Text>
                    {post.platform && (
                      <Text style={[styles.postStat, { color: colors.textSecondary }]}>
                        <Ionicons name="logo-{post.platform}" size={12} /> {post.platform}
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Best Performing Content Types */}
        {contentData?.performance?.bestPerformingTypes && (
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="trending-up" size={24} color={colors.success} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>Best Performing Content</Text>
            </View>
            {Object.entries(contentData.performance.bestPerformingTypes).slice(0, 5).map(([type, engagement], index) => (
              <View key={type} style={styles.bestTypeItem}>
                <Text style={[styles.bestTypeLabel, { color: colors.text }]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                <View style={styles.bestTypeBar}>
                  <View
                    style={[
                      styles.bestTypeFill,
                      {
                        width: `${(engagement / Math.max(...Object.values(contentData.performance.bestPerformingTypes))) * 100}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.bestTypeValue, { color: colors.textSecondary }]}>
                  {formatMetric(engagement)} engagements
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Content Insights */}
        {contentData && (
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb-outline" size={24} color={colors.warning} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>Content Insights</Text>
            </View>
            
            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Best Posting Time</Text>
              <Text style={[styles.insightValue, { color: colors.text }]}>
                {contentData.performance?.bestPerformingTimes?.bestTime || '12:00 PM'}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Optimal Post Length</Text>
              <Text style={[styles.insightValue, { color: colors.text }]}>
                {contentData.performance?.bestPerformingTimes?.optimalLength || '150-200 characters'}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Top Hashtags</Text>
              <View style={styles.hashtagList}>
                {(contentData.hashtags || []).slice(0, 5).map((tag, i) => (
                  <View key={i} style={[styles.hashtag, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.hashtagText, { color: colors.primary }]}>#{tag.tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.insightItem}>
              <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Top Topics</Text>
              <View style={styles.topicList}>
                {(contentData.topics || []).slice(0, 5).map((topic, i) => (
                  <View key={i} style={[styles.topic, { backgroundColor: colors.secondary + '20' }]}>
                    <Text style={[styles.topicText, { color: colors.secondary }]}>{topic.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
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
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  performanceCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  postRank: {
    width: 40,
  },
  postRankText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postDetails: {
    flex: 1,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  postStat: {
    fontSize: 11,
  },
  insightCard: {
    padding: 16,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  insightItem: {
    marginBottom: 16,
  },
  insightLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  hashtag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  topicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  topic: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bestTypeItem: {
    marginBottom: 12,
  },
  bestTypeLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  bestTypeBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bestTypeFill: {
    height: '100%',
    borderRadius: 3,
  },
  bestTypeValue: {
    fontSize: 11,
  },
});