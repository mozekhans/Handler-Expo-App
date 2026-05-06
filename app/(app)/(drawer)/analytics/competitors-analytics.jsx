import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import { MetricCard } from '../../../../components/charts';

const { width: screenWidth } = Dimensions.get('window');

export default function CompetitorAnalysisScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [competitorData, setCompetitorData] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getCompetitorAnalysis, getBenchmarks, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadCompetitorData();
      }
    }, [currentBusiness])
  );

  const loadCompetitorData = async () => {
    const [competitors, industryBenchmarks] = await Promise.all([
      getCompetitorAnalysis(currentBusiness?.id),
      getBenchmarks(currentBusiness?.id),
    ]);
    if (competitors) {
      setCompetitorData(competitors);
    }
    if (industryBenchmarks) {
      setBenchmarks(industryBenchmarks);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCompetitorData();
    setRefreshing(false);
  };

  const getComparisonChartData = () => {
    if (!competitorData?.comparisons) return null;
    
    const labels = ['You', ...competitorData.competitorsCompared.map(c => c.name.substring(0, 8))];
    const engagementData = [
      competitorData.businessMetrics?.engagement || 0,
      ...competitorData.competitorsCompared.map(c => c.metrics?.engagement || 0),
    ];
    const followersData = [
      competitorData.businessMetrics?.followers || 0,
      ...competitorData.competitorsCompared.map(c => c.metrics?.followers || 0),
    ];

    return {
      engagement: {
        labels,
        datasets: [{ data: engagementData }],
      },
      followers: {
        labels,
        datasets: [{ data: followersData }],
      },
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'leading': return 'trophy-outline';
      case 'competitive': return 'happy-outline';
      case 'following': return 'trending-up-outline';
      case 'lagging': return 'trending-down-outline';
      case 'critical': return 'alert-circle-outline';
      default: return 'remove-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'leading': return '#FFD700';
      case 'competitive': return '#4CAF50';
      case 'following': return '#FF9800';
      case 'lagging': return '#F44336';
      case 'critical': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  const chartData = getComparisonChartData();

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Competitor Analysis" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Market Position */}
        {competitorData?.hasCompetitors && (
          <Card style={styles.positionCard}>
            <Text style={[styles.positionTitle, { color: colors.text }]}>Market Position</Text>
            <View style={styles.positionMetrics}>
              <View style={styles.positionMetric}>
                <Text style={[styles.positionValue, { color: colors.text }]}>
                  #{competitorData.marketPosition?.rank || 1}
                </Text>
                <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>Rank</Text>
              </View>
              <View style={styles.positionDivider} />
              <View style={styles.positionMetric}>
                <Text style={[styles.positionValue, { color: colors.text }]}>
                  {competitorData.marketPosition?.percentile?.toFixed(0)}%
                </Text>
                <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>Percentile</Text>
              </View>
              <View style={styles.positionDivider} />
              <View style={styles.positionMetric}>
                <Text style={[styles.positionValue, { color: colors.text }]}>
                  {competitorData.competitorCount || 0}
                </Text>
                <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>Competitors</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Industry Benchmarks */}
        {benchmarks?.benchmarks && (
          <Card style={styles.benchmarkCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Industry Benchmarks</Text>
            <View style={styles.benchmarkGrid}>
              <View style={styles.benchmarkItem}>
                <Text style={[styles.benchmarkValue, { color: colors.text }]}>
                  {benchmarks.benchmarks.engagementRate}%
                </Text>
                <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>
                  Engagement Rate
                </Text>
                <View style={styles.comparisonBadge}>
                  <Ionicons
                    name={benchmarks.comparison?.engagement?.ratio >= 1 ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={benchmarks.comparison?.engagement?.ratio >= 1 ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      { color: benchmarks.comparison?.engagement?.ratio >= 1 ? colors.success : colors.error },
                    ]}
                  >
                    {Math.abs(benchmarks.comparison?.engagement?.percentDiff || 0).toFixed(0)}%
                  </Text>
                </View>
              </View>
              <View style={styles.benchmarkItem}>
                <Text style={[styles.benchmarkValue, { color: colors.text }]}>
                  {benchmarks.benchmarks.postingFrequency}/week
                </Text>
                <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>
                  Posting Frequency
                </Text>
                <View style={styles.comparisonBadge}>
                  <Ionicons
                    name={benchmarks.comparison?.posting?.ratio >= 1 ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={benchmarks.comparison?.posting?.ratio >= 1 ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      { color: benchmarks.comparison?.posting?.ratio >= 1 ? colors.success : colors.error },
                    ]}
                  >
                    {Math.abs(benchmarks.comparison?.posting?.percentDiff || 0).toFixed(0)}%
                  </Text>
                </View>
              </View>
              <View style={styles.benchmarkItem}>
                <Text style={[styles.benchmarkValue, { color: colors.text }]}>
                  {benchmarks.benchmarks.followerGrowth}%
                </Text>
                <Text style={[styles.benchmarkLabel, { color: colors.textSecondary }]}>
                  Growth Rate
                </Text>
                <View style={styles.comparisonBadge}>
                  <Ionicons
                    name={benchmarks.comparison?.growth?.ratio >= 1 ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={benchmarks.comparison?.growth?.ratio >= 1 ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.comparisonText,
                      { color: benchmarks.comparison?.growth?.ratio >= 1 ? colors.success : colors.error },
                    ]}
                  >
                    {Math.abs(benchmarks.comparison?.growth?.percentDiff || 0).toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Comparison Charts */}
        {chartData && (
          <>
            <Card style={styles.chartCard}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement Comparison</Text>
              <BarChart
                data={chartData.engagement}
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

            <Card style={styles.chartCard}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Follower Comparison</Text>
              <BarChart
                data={chartData.followers}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.secondary,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: { borderRadius: 16 },
                }}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </Card>
          </>
        )}

        {/* Competitor Details */}
        {competitorData?.comparisons?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Competitor Breakdown</Text>
            {competitorData.comparisons.map((comparison, index) => (
              <Card key={index} style={styles.competitorCard}>
                <View style={styles.competitorHeader}>
                  <Text style={[styles.competitorName, { color: colors.text }]}>
                    {comparison.competitor.name}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(comparison.engagement.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(comparison.engagement.status)} size={14} color={getStatusColor(comparison.engagement.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(comparison.engagement.status) }]}>
                      {comparison.engagement.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.competitorMetrics}>
                  <View style={styles.competitorMetric}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {comparison.followers.value?.toLocaleString()}
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Followers</Text>
                    <Text style={[styles.metricDiff, { color: comparison.followers.percentDiff >= 0 ? colors.success : colors.error }]}>
                      {comparison.followers.percentDiff >= 0 ? '+' : ''}{comparison.followers.percentDiff?.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.competitorMetric}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {comparison.engagement.value?.toFixed(1)}%
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Engagement</Text>
                    <Text style={[styles.metricDiff, { color: comparison.engagement.percentDiff >= 0 ? colors.success : colors.error }]}>
                      {comparison.engagement.percentDiff >= 0 ? '+' : ''}{comparison.engagement.percentDiff?.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.competitorMetric}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>
                      {comparison.growth.value?.toFixed(1)}%
                    </Text>
                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Growth</Text>
                    <Text style={[styles.metricDiff, { color: comparison.growth.percentDiff >= 0 ? colors.success : colors.error }]}>
                      {comparison.growth.percentDiff >= 0 ? '+' : ''}{comparison.growth.percentDiff?.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Strengths & Weaknesses */}
        {competitorData && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>SWOT Analysis</Text>
            
            <View style={styles.swotGrid}>
              <Card style={[styles.swotCard, { borderTopColor: colors.success }]}>
                <View style={styles.swotHeader}>
                  <Ionicons name="bulb-outline" size={20} color={colors.success} />
                  <Text style={[styles.swotTitle, { color: colors.text }]}>Strengths</Text>
                </View>
                {competitorData.strengths?.map((strength, i) => (
                  <Text key={i} style={[styles.swotItem, { color: colors.textSecondary }]}>
                    • {strength.metric}: {strength.advantage}
                  </Text>
                ))}
                {(!competitorData.strengths || competitorData.strengths.length === 0) && (
                  <Text style={[styles.swotEmpty, { color: colors.textSecondary }]}>No significant strengths identified</Text>
                )}
              </Card>

              <Card style={[styles.swotCard, { borderTopColor: colors.error }]}>
                <View style={styles.swotHeader}>
                  <Ionicons name="warning-outline" size={20} color={colors.error} />
                  <Text style={[styles.swotTitle, { color: colors.text }]}>Weaknesses</Text>
                </View>
                {competitorData.weaknesses?.map((weakness, i) => (
                  <Text key={i} style={[styles.swotItem, { color: colors.textSecondary }]}>
                    • {weakness.metric}: {weakness.gap}
                  </Text>
                ))}
                {(!competitorData.weaknesses || competitorData.weaknesses.length === 0) && (
                  <Text style={[styles.swotEmpty, { color: colors.textSecondary }]}>No weaknesses identified</Text>
                )}
              </Card>
            </View>
          </View>
        )}

        {/* Recommendations */}
        {competitorData?.recommendations?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendations</Text>
            {competitorData.recommendations.map((rec, index) => (
              <Card key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={[styles.recommendationPriority, { backgroundColor: getPriorityColor(rec.priority) + '20' }]}>
                    <Text style={[styles.recommendationPriorityText, { color: getPriorityColor(rec.priority) }]}>
                      {rec.priority?.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.recommendationTitle, { color: colors.text }]}>{rec.title}</Text>
                </View>
                <Text style={[styles.recommendationDescription, { color: colors.textSecondary }]}>
                  {rec.description}
                </Text>
                {rec.expectedImpact && (
                  <View style={styles.recommendationImpact}>
                    <Ionicons name="trending-up" size={14} color={colors.success} />
                    <Text style={[styles.recommendationImpactText, { color: colors.success }]}>
                      Expected Impact: {rec.expectedImpact}
                    </Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#F44336';
    case 'medium': return '#FF9800';
    case 'low': return '#4CAF50';
    default: return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  positionCard: {
    padding: 16,
    marginBottom: 16,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  positionMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  positionMetric: {
    alignItems: 'center',
    flex: 1,
  },
  positionValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positionLabel: {
    fontSize: 12,
  },
  positionDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  benchmarkCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  benchmarkItem: {
    alignItems: 'center',
    flex: 1,
  },
  benchmarkValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  benchmarkLabel: {
    fontSize: 11,
    marginBottom: 6,
    textAlign: 'center',
  },
  comparisonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  comparisonText: {
    fontSize: 11,
    fontWeight: '500',
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
  competitorCard: {
    padding: 16,
    marginBottom: 12,
  },
  competitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  competitorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  competitorMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  competitorMetric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  metricDiff: {
    fontSize: 11,
    fontWeight: '500',
  },
  swotGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  swotCard: {
    flex: 1,
    padding: 12,
    borderTopWidth: 3,
  },
  swotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  swotTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  swotItem: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 16,
  },
  swotEmpty: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  recommendationPriority: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recommendationPriorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  recommendationDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  recommendationImpact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendationImpactText: {
    fontSize: 11,
    fontWeight: '500',
  },
});