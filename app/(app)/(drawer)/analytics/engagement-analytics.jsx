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
import SentimentBadge from '../../../../components/ai/SentimentBadge';

const { width: screenWidth } = Dimensions.get('window');

const PERIODS = [
  { label: '7 Days', value: 'last_7_days' },
  { label: '30 Days', value: 'last_30_days' },
  { label: '90 Days', value: 'last_90_days' },
];

const PLATFORMS = [
  { label: 'All Platforms', value: '' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'TikTok', value: 'tiktok' },
];

export default function EngagementAnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [engagementData, setEngagementData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getEngagementMetrics, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadEngagementData();
      }
    }, [currentBusiness, selectedPeriod, selectedPlatform])
  );

  const loadEngagementData = async () => {
    const data = await getEngagementMetrics(currentBusiness?.id, {
      period: selectedPeriod,
      platform: selectedPlatform || undefined,
    });
    if (data) {
      setEngagementData(data.engagement);
      setSentimentData(data.sentiment);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEngagementData();
    setRefreshing(false);
  };

  const getEngagementChartData = () => {
    const history = engagementData?.historical || [];
    return {
      labels: history.slice(-14).map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{ data: history.slice(-14).map(d => d.value || 0) }],
    };
  };

  const getHourlyChartData = () => {
    const byHour = engagementData?.byHour || {};
    const hours = Array(24).fill(0);
    Object.entries(byHour).forEach(([hour, count]) => {
      hours[parseInt(hour)] = count;
    });
    return {
      labels: hours.map((_, i) => `${i}:00`),
      datasets: [{ data: hours }],
    };
  };

  const getDayChartData = () => {
    const byDay = engagementData?.byDay || {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = days.map(day => byDay[day] || 0);
    return {
      labels: days.map(d => d.substring(0, 3)),
      datasets: [{ data }],
    };
  };

  const getTypePieData = () => {
    const byType = engagementData?.byType || {};
    return Object.entries(byType).map(([type, count]) => ({
      name: type,
      population: count,
      color: getTypeColor(type),
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      comment: '#4CAF50',
      like: '#2196F3',
      share: '#FF9800',
      mention: '#9C27B0',
      message: '#E91E63',
    };
    return colors[type] || '#9E9E9E';
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
      <Header title="Engagement Analytics" showBack={true} />

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
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Platform</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker
                selectedValue={selectedPlatform}
                onValueChange={setSelectedPlatform}
                style={{ color: colors.text }}
              >
                {PLATFORMS.map(p => (
                  <Picker.Item key={p.value} label={p.label} value={p.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatMetric(engagementData?.total)}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Engagements</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {engagementData?.unique || 0}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Unique Users</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {(engagementData?.rate || 0).toFixed(2)}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Engagement Rate</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {((engagementData?.responseRate || 0)).toFixed(1)}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Response Rate</Text>
          </Card>
        </View>

        {/* Engagement Trend Chart */}
        {engagementData?.historical?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement Trend</Text>
            <LineChart
              data={getEngagementChartData()}
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

        {/* Engagement by Type */}
        {getTypePieData().length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement by Type</Text>
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

        {/* Engagement by Hour */}
        {Object.keys(engagementData?.byHour || {}).length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement by Hour</Text>
            <BarChart
              data={getHourlyChartData()}
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

        {/* Engagement by Day */}
        {Object.keys(engagementData?.byDay || {}).length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Engagement by Day</Text>
            <BarChart
              data={getDayChartData()}
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

        {/* Sentiment Analysis */}
        {sentimentData && (
          <Card style={styles.sentimentCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Sentiment Analysis</Text>
            <View style={styles.sentimentContainer}>
              <View style={styles.sentimentItem}>
                <View style={[styles.sentimentIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.sentimentLabel, { color: colors.text }]}>Positive</Text>
                <Text style={[styles.sentimentValue, { color: colors.success }]}>
                  {sentimentData.percentages?.positive?.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.sentimentItem}>
                <View style={[styles.sentimentIndicator, { backgroundColor: '#FF9800' }]} />
                <Text style={[styles.sentimentLabel, { color: colors.text }]}>Neutral</Text>
                <Text style={[styles.sentimentValue, { color: colors.warning }]}>
                  {sentimentData.percentages?.neutral?.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.sentimentItem}>
                <View style={[styles.sentimentIndicator, { backgroundColor: '#F44336' }]} />
                <Text style={[styles.sentimentLabel, { color: colors.text }]}>Negative</Text>
                <Text style={[styles.sentimentValue, { color: colors.error }]}>
                  {sentimentData.percentages?.negative?.toFixed(1)}%
                </Text>
              </View>
            </View>
            <View style={styles.sentimentBar}>
              <View
                style={[
                  styles.sentimentBarFill,
                  {
                    width: `${sentimentData.percentages?.positive || 0}%`,
                    backgroundColor: '#4CAF50',
                  },
                ]}
              />
              <View
                style={[
                  styles.sentimentBarFill,
                  {
                    width: `${sentimentData.percentages?.neutral || 0}%`,
                    backgroundColor: '#FF9800',
                  },
                ]}
              />
              <View
                style={[
                  styles.sentimentBarFill,
                  {
                    width: `${sentimentData.percentages?.negative || 0}%`,
                    backgroundColor: '#F44336',
                  },
                ]}
              />
            </View>
            <Text style={[styles.sentimentScore, { color: colors.textSecondary }]}>
              Sentiment Score: {(sentimentData.score || 0).toFixed(2)}
            </Text>
          </Card>
        )}

        {/* Response Metrics */}
        <Card style={styles.responseCard}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Response Metrics</Text>
          <View style={styles.responseGrid}>
            <View style={styles.responseItem}>
              <Text style={[styles.responseValue, { color: colors.text }]}>
                {engagementData?.responded || 0}
              </Text>
              <Text style={[styles.responseLabel, { color: colors.textSecondary }]}>Replied</Text>
            </View>
            <View style={styles.responseItem}>
              <Text style={[styles.responseValue, { color: colors.text }]}>
                {engagementData?.total || 0}
              </Text>
              <Text style={[styles.responseLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            <View style={styles.responseItem}>
              <Text style={[styles.responseValue, { color: colors.text }]}>
                {((engagementData?.responded || 0) / (engagementData?.total || 1) * 100).toFixed(1)}%
              </Text>
              <Text style={[styles.responseLabel, { color: colors.textSecondary }]}>Response Rate</Text>
            </View>
          </View>
        </Card>

        {/* Best Time Insights */}
        {Object.keys(engagementData?.byHour || {}).length > 0 && (
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={[styles.insightTitle, { color: colors.text }]}>Best Time to Post</Text>
            </View>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Based on your engagement data, the best time to post is between{' '}
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                {getBestHour(engagementData?.byHour)}
              </Text>
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const getBestHour = (byHour) => {
  if (!byHour) return '12:00 PM - 2:00 PM';
  let bestHour = 0;
  let maxCount = 0;
  Object.entries(byHour).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      bestHour = parseInt(hour);
    }
  });
  const period = bestHour >= 12 ? 'PM' : 'AM';
  const displayHour = bestHour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

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
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
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
  sentimentCard: {
    padding: 16,
    marginBottom: 16,
  },
  sentimentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentimentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sentimentLabel: {
    fontSize: 13,
  },
  sentimentValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sentimentBarFill: {
    height: '100%',
  },
  sentimentScore: {
    fontSize: 12,
    textAlign: 'center',
  },
  responseCard: {
    padding: 16,
    marginBottom: 16,
  },
  responseGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  responseItem: {
    alignItems: 'center',
  },
  responseValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  responseLabel: {
    fontSize: 12,
  },
  insightCard: {
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightText: {
    flex: 1,
    fontSize: 13,
  },
});