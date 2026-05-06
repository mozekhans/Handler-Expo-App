import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import MetricCard from '../../../../components/charts/MetricCard';

const { width: screenWidth } = Dimensions.get('window');

export default function OverviewScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [growth, setGrowth] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getOverview, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadOverview();
      }
    }, [currentBusiness])
  );

  const loadOverview = async () => {
    const data = await getOverview(currentBusiness?.id);
    if (data) {
      setOverviewData(data.overview);
      setPreviousData(data.previous);
      setGrowth(data.growth);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOverview();
    setRefreshing(false);
  };

  const getFollowerChartData = () => {
    const history = overviewData?.followers?.historical || [];
    return {
      labels: history.slice(-7).map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{ data: history.slice(-7).map(d => d.count || 0) }],
    };
  };

  const formatMetric = (value) => {
    if (!value) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatGrowth = (value) => {
    if (!value && value !== 0) return null;
    return value > 0 ? `+${value}` : value;
  };

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Analytics Overview" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
              <Text style={[styles.metricChange, { color: (growth?.followers || 0) >= 0 ? colors.success : colors.error }]}>
                {formatGrowth(growth?.followers)}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatMetric(overviewData?.followers?.total)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Followers</Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="heart-outline" size={24} color={colors.secondary} />
              <Text style={[styles.metricChange, { color: (growth?.engagement || 0) >= 0 ? colors.success : colors.error }]}>
                {formatGrowth(growth?.engagement)}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatMetric(overviewData?.engagement?.total)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Engagement</Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="eye-outline" size={24} color={colors.info} />
              <Text style={[styles.metricChange, { color: (growth?.reach || 0) >= 0 ? colors.success : colors.error }]}>
                {formatGrowth(growth?.reach)}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatMetric(overviewData?.reach?.total)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Reach</Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="document-text-outline" size={24} color={colors.success} />
              <Text style={[styles.metricChange, { color: (growth?.posts || 0) >= 0 ? colors.success : colors.error }]}>
                {formatGrowth(growth?.posts)}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {overviewData?.content?.published || 0}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Posts Published</Text>
          </Card>
        </View>

        {/* Engagement Rate */}
        <Card style={styles.rateCard}>
          <Text style={[styles.rateTitle, { color: colors.textSecondary }]}>Engagement Rate</Text>
          <Text style={[styles.rateValue, { color: colors.primary }]}>
            {(overviewData?.engagement?.rate || 0).toFixed(2)}%
          </Text>
          <View style={styles.rateBar}>
            <View
              style={[
                styles.rateBarFill,
                {
                  width: `${Math.min(100, overviewData?.engagement?.rate || 0)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.rateNote, { color: colors.textSecondary }]}>
            Industry average: 3.5%
          </Text>
        </Card>

        {/* Follower Growth Chart */}
        {overviewData?.followers?.historical?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Follower Growth</Text>
            <LineChart
              data={getFollowerChartData()}
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

        {/* Platform Breakdown */}
        {overviewData?.followers?.byPlatform && (
          <Card style={styles.platformCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Followers by Platform</Text>
            {Object.entries(overviewData.followers.byPlatform).map(([platform, data]) => (
              <View key={platform} style={styles.platformItem}>
                <View style={styles.platformHeader}>
                  <Text style={[styles.platformName, { color: colors.text }]}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                  <Text style={[styles.platformCount, { color: colors.text }]}>
                    {formatMetric(data.count)}
                  </Text>
                </View>
                <View style={styles.platformBar}>
                  <View
                    style={[
                      styles.platformBarFill,
                      {
                        width: `${(data.count / overviewData.followers.total) * 100}%`,
                        backgroundColor: getPlatformColor(platform),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.platformGrowth, { color: data.growth >= 0 ? colors.success : colors.error }]}>
                  {data.growth >= 0 ? '+' : ''}{data.growth}% growth
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Comparison with Previous Period */}
        {previousData && (
          <Card style={styles.comparisonCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Comparison</Text>
            <View style={styles.comparisonGrid}>
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>Current</Text>
                <Text style={[styles.comparisonValue, { color: colors.text }]}>
                  {formatMetric(overviewData?.engagement?.total)}
                </Text>
                <Text style={[styles.comparisonSub, { color: colors.textSecondary }]}>Engagement</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>Previous</Text>
                <Text style={[styles.comparisonValue, { color: colors.text }]}>
                  {formatMetric(previousData?.engagement?.total)}
                </Text>
                <Text style={[styles.comparisonSub, { color: colors.textSecondary }]}>Engagement</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonItem}>
                <Text style={[styles.comparisonLabel, { color: colors.textSecondary }]}>Change</Text>
                <Text
                  style={[
                    styles.comparisonValue,
                    { color: (growth?.engagement || 0) >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {formatGrowth(growth?.engagement)}
                </Text>
                <Text style={[styles.comparisonSub, { color: colors.textSecondary }]}>vs previous</Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const getPlatformColor = (platform) => {
  const colors = {
    instagram: '#E4405F',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    tiktok: '#000000',
    pinterest: '#BD081C',
    youtube: '#FF0000',
  };
  return colors[platform] || '#9E9E9E';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricChange: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
  },
  rateCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  rateTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rateBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  rateBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  rateNote: {
    fontSize: 12,
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
  platformCard: {
    padding: 16,
    marginBottom: 16,
  },
  platformItem: {
    marginBottom: 16,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
  },
  platformCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  platformBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  platformBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  platformGrowth: {
    fontSize: 11,
  },
  comparisonCard: {
    padding: 16,
    marginBottom: 16,
  },
  comparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comparisonSub: {
    fontSize: 11,
  },
  comparisonDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
});