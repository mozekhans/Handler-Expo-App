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
  { label: 'This Year', value: 'this_year' },
];

const CAMPAIGN_STATUS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Draft', value: 'draft' },
];

export default function CampaignAnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [campaignData, setCampaignData] = useState(null);
  const [roiData, setRoiData] = useState(null);
  const [campaignComparison, setCampaignComparison] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getCampaignMetrics, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadCampaignData();
      }
    }, [currentBusiness, selectedPeriod, selectedStatus])
  );

  const loadCampaignData = async () => {
    const data = await getCampaignMetrics(currentBusiness?.id, {
      period: selectedPeriod,
      status: selectedStatus || undefined,
    });
    if (data) {
      setCampaignData(data.campaigns);
      setRoiData(data.roi);
      setCampaignComparison(data.campaignComparison);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampaignData();
    setRefreshing(false);
  };

  const getRoiChartData = () => {
    const campaigns = campaignComparison?.campaigns || [];
    return {
      labels: campaigns.slice(0, 5).map(c => c.name.substring(0, 10)),
      datasets: [{ data: campaigns.slice(0, 5).map(c => c.roi || 0) }],
    };
  };

  const getSpendChartData = () => {
    const campaigns = campaignComparison?.campaigns || [];
    return {
      labels: campaigns.slice(0, 5).map(c => c.name.substring(0, 10)),
      datasets: [{ data: campaigns.slice(0, 5).map(c => c.spent || 0) }],
    };
  };

  const getStatusPieData = () => {
    const byStatus = campaignData?.byStatus || {};
    const colors = {
      active: '#4CAF50',
      completed: '#2196F3',
      paused: '#FF9800',
      draft: '#9E9E9E',
    };
    return Object.entries(byStatus).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      population: count,
      color: colors[status] || '#9E9E9E',
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const getRoiTrendData = () => {
    const trends = roiData?.trends?.daily || [];
    return {
      labels: trends.slice(-14).map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{ data: trends.slice(-14).map(d => d.roi || 0) }],
    };
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
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
      <Header title="Campaign Analytics" showBack={true} />

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
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Status</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={setSelectedStatus}
                style={{ color: colors.text }}
              >
                {CAMPAIGN_STATUS.map(s => (
                  <Picker.Item key={s.value} label={s.label} value={s.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Campaigns"
            value={campaignData?.total || 0}
            icon="megaphone-outline"
            color={colors.primary}
          />
          <MetricCard
            title="Active"
            value={campaignData?.active || 0}
            icon="play-outline"
            color={colors.success}
          />
          <MetricCard
            title="Completed"
            value={campaignData?.completed || 0}
            icon="checkmark-circle-outline"
            color={colors.info}
          />
        </View>

        {/* ROI Overview */}
        {roiData?.overall && (
          <Card style={styles.roiCard}>
            <Text style={[styles.roiTitle, { color: colors.textSecondary }]}>Return on Investment</Text>
            <Text style={[styles.roiValue, { color: roiData.overall.roi >= 0 ? colors.success : colors.error }]}>
              {roiData.overall.roi?.toFixed(1)}%
            </Text>
            <View style={styles.roiMetrics}>
              <View style={styles.roiMetric}>
                <Text style={[styles.roiMetricValue, { color: colors.text }]}>
                  {formatCurrency(roiData.overall.totalRevenue)}
                </Text>
                <Text style={[styles.roiMetricLabel, { color: colors.textSecondary }]}>Revenue</Text>
              </View>
              <View style={styles.roiMetric}>
                <Text style={[styles.roiMetricValue, { color: colors.text }]}>
                  {formatCurrency(roiData.overall.totalSpent)}
                </Text>
                <Text style={[styles.roiMetricLabel, { color: colors.textSecondary }]}>Spent</Text>
              </View>
              <View style={styles.roiMetric}>
                <Text style={[styles.roiMetricValue, { color: colors.text }]}>
                  {formatCurrency(roiData.overall.totalRevenue - roiData.overall.totalSpent)}
                </Text>
                <Text style={[styles.roiMetricLabel, { color: colors.textSecondary }]}>Profit</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Campaign Performance Metrics */}
        <View style={styles.metricsRow}>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Total Reach</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(campaignData?.performance?.reach)}
            </Text>
          </Card>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>Conversions</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatMetric(campaignData?.performance?.conversions)}
            </Text>
          </Card>
        </View>

        <View style={styles.metricsRow}>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>CPA</Text>
            <Text style={[styles.performanceValue, { color: colors.text }]}>
              {formatCurrency(campaignData?.performance?.cpa)}
            </Text>
          </Card>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>ROAS</Text>
            <Text style={[styles.performanceValue, { color: roiData?.overall?.roas >= 1 ? colors.success : colors.error }]}>
              {roiData?.overall?.roas?.toFixed(2)}x
            </Text>
          </Card>
        </View>

        {/* ROI Trend Chart */}
        {roiData?.trends?.daily?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>ROI Trend</Text>
            <LineChart
              data={getRoiTrendData()}
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

        {/* Campaign Status Distribution */}
        {getStatusPieData().length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Campaign Status</Text>
            <PieChart
              data={getStatusPieData()}
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

        {/* Campaign Comparison */}
        {campaignComparison?.campaigns?.length > 0 && (
          <>
            <Card style={styles.chartCard}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>ROI by Campaign</Text>
              <BarChart
                data={getRoiChartData()}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.success,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: { borderRadius: 16 },
                }}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </Card>

            <Card style={styles.chartCard}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Spend by Campaign</Text>
              <BarChart
                data={getSpendChartData()}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.warning,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: { borderRadius: 16 },
                }}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </Card>
          </>
        )}

        {/* Best & Worst Performing Campaigns */}
        {campaignComparison?.bestPerforming && (
          <Card style={styles.bestCampaignCard}>
            <View style={styles.bestCampaignHeader}>
              <Ionicons name="trophy-outline" size={24} color={colors.success} />
              <Text style={[styles.bestCampaignTitle, { color: colors.text }]}>Best Performing Campaign</Text>
            </View>
            <Text style={[styles.bestCampaignName, { color: colors.text, fontWeight: 'bold' }]}>
              {campaignComparison.bestPerforming.name}
            </Text>
            <View style={styles.bestCampaignMetrics}>
              <View style={styles.bestCampaignMetric}>
                <Text style={[styles.bestMetricValue, { color: colors.text }]}>
                  {campaignComparison.bestPerforming.roi?.toFixed(1)}%
                </Text>
                <Text style={[styles.bestMetricLabel, { color: colors.textSecondary }]}>ROI</Text>
              </View>
              <View style={styles.bestCampaignMetric}>
                <Text style={[styles.bestMetricValue, { color: colors.text }]}>
                  {formatCurrency(campaignComparison.bestPerforming.revenue)}
                </Text>
                <Text style={[styles.bestMetricLabel, { color: colors.textSecondary }]}>Revenue</Text>
              </View>
              <View style={styles.bestCampaignMetric}>
                <Text style={[styles.bestMetricValue, { color: colors.text }]}>
                  {formatCurrency(campaignComparison.bestPerforming.cpa)}
                </Text>
                <Text style={[styles.bestMetricLabel, { color: colors.textSecondary }]}>CPA</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Platform Performance */}
        {roiData?.byPlatform && Object.keys(roiData.byPlatform).length > 0 && (
          <Card style={styles.platformCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Platform Performance</Text>
            {Object.entries(roiData.byPlatform).map(([platform, data]) => (
              <View key={platform} style={styles.platformItem}>
                <View style={styles.platformHeader}>
                  <Text style={[styles.platformName, { color: colors.text }]}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Text>
                  <Text style={[styles.platformRoi, { color: data.roi >= 0 ? colors.success : colors.error }]}>
                    {data.roi?.toFixed(1)}% ROI
                  </Text>
                </View>
                <View style={styles.platformMetrics}>
                  <Text style={[styles.platformMetric, { color: colors.textSecondary }]}>
                    Spent: {formatCurrency(data.spent)}
                  </Text>
                  <Text style={[styles.platformMetric, { color: colors.textSecondary }]}>
                    Revenue: {formatCurrency(data.revenue)}
                  </Text>
                </View>
                <ProgressBar 
                  value={data.roi} 
                  maxValue={Math.max(...Object.values(roiData.byPlatform).map(d => d.roi), 100)} 
                  height={6}
                  color={data.roi >= 0 ? colors.success : colors.error}
                />
              </View>
            ))}
          </Card>
        )}

        {/* Campaign Recommendations */}
        {campaignData && (
          <Card style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Ionicons name="bulb-outline" size={24} color={colors.warning} />
              <Text style={[styles.recommendationTitle, { color: colors.text }]}>Campaign Insights</Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                {campaignData.active > 0 
                  ? `You have ${campaignData.active} active campaigns. Monitor their performance daily.`
                  : `No active campaigns. Start a new campaign to grow your audience.`}
              </Text>
            </View>

            {campaignData.performance?.roi < 10 && campaignData.active > 0 && (
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                  Your overall ROI is below target. Consider optimizing your ad spend or targeting.
                </Text>
              </View>
            )}

            {campaignData.performance?.cpa > 50 && (
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                  Your CPA is high. Try A/B testing different creatives and audiences.
                </Text>
              </View>
            )}
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
  roiCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  roiTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  roiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  roiMetric: {
    alignItems: 'center',
    flex: 1,
  },
  roiMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roiMetricLabel: {
    fontSize: 11,
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
  bestCampaignCard: {
    padding: 16,
    marginBottom: 16,
  },
  bestCampaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bestCampaignTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  bestCampaignName: {
    fontSize: 16,
    marginBottom: 12,
  },
  bestCampaignMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bestCampaignMetric: {
    alignItems: 'center',
    flex: 1,
  },
  bestMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bestMetricLabel: {
    fontSize: 11,
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
    marginBottom: 4,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
  },
  platformRoi: {
    fontSize: 13,
    fontWeight: '600',
  },
  platformMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  platformMetric: {
    fontSize: 11,
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 13,
    lineHeight: 18,
  },
});