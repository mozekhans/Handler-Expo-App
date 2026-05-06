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
import { BarChart, PieChart } from 'react-native-chart-kit';
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

export default function AudienceAnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [audienceData, setAudienceData] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [retentionData, setRetentionData] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { getAudienceMetrics, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadAudienceData();
      }
    }, [currentBusiness, selectedPeriod])
  );

  const loadAudienceData = async () => {
    const data = await getAudienceMetrics(currentBusiness?.id, {
      period: selectedPeriod,
    });
    if (data) {
      setAudienceData(data.audience);
      setGrowthData(data.growth);
      setRetentionData(data.retention);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAudienceData();
    setRefreshing(false);
  };

  const getAgeChartData = () => {
    const ageData = audienceData?.demographics?.age || [];
    return {
      labels: ageData.map(a => a.range),
      datasets: [{ data: ageData.map(a => a.percentage || 0) }],
    };
  };

  // const getGenderPieData = () => {
  //   const genderData = audienceData?.demographics?.gender || [];
  //   const colorsMap = {
  //     male: '#2196F3',
  //     female: '#E91E63',
  //     non_binary: '#9C27B0',
  //     all: '#4CAF50',
  //   };
  //   return genderData.map(g => ({
  //     name: g.type?.charAt(0).toUpperCase() + g.type?.slice(1),
  //     population: g.percentage || 0,
  //     color: colorsMap[g.type] || '#9E9E9E',
  //     legendFontColor: colors.text,
  //     legendFontSize: 12,
  //   }));
  // };

  const getGenderPieData = () => {
  const rawGender = audienceData?.demographics?.gender;

  // Ensure it's always an array
  const genderData = Array.isArray(rawGender)
    ? rawGender
    : rawGender
    ? Object.values(rawGender) // handles object case
    : [];

  const colorsMap = {
    male: '#2196F3',
    female: '#E91E63',
    non_binary: '#9C27B0',
    all: '#4CAF50',
  };

  return genderData.map((g) => {
    const type = g?.type || 'unknown';

    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      population: g?.percentage ?? 0,
      color: colorsMap[type] || '#9E9E9E',
      legendFontColor: colors?.text || '#000', // fallback prevents crash
      legendFontSize: 12,
    };
  });
};

  const getLocationData = () => {
    const locationData = audienceData?.demographics?.location || [];
    return {
      labels: locationData.slice(0, 5).map(l => l.country),
      datasets: [{ data: locationData.slice(0, 5).map(l => l.percentage || 0) }],
    };
  };

  const getInterestsData = () => {
    const interests = audienceData?.interests || [];
    return {
      labels: interests.slice(0, 5).map(i => i.interest),
      datasets: [{ data: interests.slice(0, 5).map(i => i.strength || 0) }],
    };
  };

  const getGrowthChartData = () => {
    const history = growthData?.history || [];
    return {
      labels: history.slice(-14).map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: history.slice(-14).map(d => d.cumulativeUsers || 0),
          color: (opacity = 1) => colors.primary,
          strokeWidth: 2,
        },
      ],
    };
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
      <Header title="Audience Analytics" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <Text style={[styles.periodLabel, { color: colors.textSecondary }]}>Time Period</Text>
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

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Audience"
            value={formatMetric(audienceData?.total)}
            change={growthData?.rate}
            icon="people-outline"
            color={colors.primary}
          />
          <MetricCard
            title="Unique Users"
            value={formatMetric(audienceData?.unique)}
            icon="person-outline"
            color={colors.secondary}
          />
          <MetricCard
            title="Retention Rate"
            value={`${(retentionData?.retentionRate || 0).toFixed(1)}%`}
            icon="refresh-outline"
            color={colors.success}
          />
        </View>

        {/* Audience Growth */}
        {growthData?.history?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Audience Growth</Text>
            <LineChart
              data={getGrowthChartData()}
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
            <View style={styles.growthStats}>
              <View style={styles.growthStat}>
                <Text style={[styles.growthStatValue, { color: colors.text }]}>
                  {formatMetric(growthData?.total)}
                </Text>
                <Text style={[styles.growthStatLabel, { color: colors.textSecondary }]}>Total Audience</Text>
              </View>
              <View style={styles.growthStat}>
                <Text style={[styles.growthStatValue, { color: colors.success }]}>
                  +{formatMetric(growthData?.newUsers)}
                </Text>
                <Text style={[styles.growthStatLabel, { color: colors.textSecondary }]}>New Users</Text>
              </View>
              <View style={styles.growthStat}>
                <Text style={[styles.growthStatValue, { color: colors.error }]}>
                  -{formatMetric(retentionData?.churned)}
                </Text>
                <Text style={[styles.growthStatLabel, { color: colors.textSecondary }]}>Churned</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Age Distribution */}
        {audienceData?.demographics?.age?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Age Distribution</Text>
            <BarChart
              data={getAgeChartData()}
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

        {/* Gender Distribution */}
        {getGenderPieData().length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Gender Distribution</Text>
            <PieChart
              data={getGenderPieData()}
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

        {/* Top Locations */}
        {audienceData?.demographics?.location?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Top Locations</Text>
            <BarChart
              data={getLocationData()}
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
              horizontal
            />
          </Card>
        )}

        {/* Languages */}
        {audienceData?.demographics?.language?.length > 0 && (
          <Card style={styles.languageCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Languages</Text>
            <View style={styles.languageList}>
              {audienceData.demographics.language.map((lang, index) => (
                <View key={index} style={styles.languageItem}>
                  <Text style={[styles.languageName, { color: colors.text }]}>
                    {lang.language?.toUpperCase()}
                  </Text>
                  <ProgressBar value={lang.percentage} maxValue={100} height={6} />
                  <Text style={[styles.languagePercentage, { color: colors.textSecondary }]}>
                    {lang.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Interests */}
        {audienceData?.interests?.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Top Interests</Text>
            <BarChart
              data={getInterestsData()}
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
              horizontal
            />
          </Card>
        )}

        {/* Devices */}
        {audienceData?.devices?.length > 0 && (
          <Card style={styles.deviceCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Devices</Text>
            <View style={styles.deviceGrid}>
              {audienceData.devices.map((device, index) => (
                <View key={index} style={styles.deviceItem}>
                  <Ionicons
                    name={device.type === 'mobile' ? 'phone-portrait-outline' : 'laptop-outline'}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={[styles.deviceName, { color: colors.text }]}>
                    {device.type?.charAt(0).toUpperCase() + device.type?.slice(1)}
                  </Text>
                  <Text style={[styles.devicePercentage, { color: colors.textSecondary }]}>
                    {device.percentage}%
                  </Text>
                  <ProgressBar value={device.percentage} maxValue={100} height={4} />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Active Times */}
        {audienceData?.activeTimes && (
          <Card style={styles.chartCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Active Times</Text>
            <View style={styles.activeTimesGrid}>
              <View style={styles.activeTimeItem}>
                <Text style={[styles.activeTimeLabel, { color: colors.textSecondary }]}>Best Hour</Text>
                <Text style={[styles.activeTimeValue, { color: colors.text }]}>
                  {audienceData.activeTimes.bestTime || '12:00 PM'}
                </Text>
              </View>
              <View style={styles.activeTimeItem}>
                <Text style={[styles.activeTimeLabel, { color: colors.textSecondary }]}>Best Day</Text>
                <Text style={[styles.activeTimeValue, { color: colors.text }]}>
                  {Object.entries(audienceData.activeTimes.daily || {})
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Monday'}
                </Text>
              </View>
            </View>
            <View style={styles.hourlyBars}>
              {Object.entries(audienceData.activeTimes.hourly || {}).slice(0, 12).map(([hour, count]) => (
                <View key={hour} style={styles.hourlyBarItem}>
                  <Text style={[styles.hourlyLabel, { color: colors.textSecondary }]}>{hour}:00</Text>
                  <ProgressBar value={count} maxValue={100} height={4} />
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Audience Loyalty */}
        {audienceData?.loyalty && (
          <Card style={styles.loyaltyCard}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Audience Loyalty</Text>
            <View style={styles.loyaltyGrid}>
              <View style={styles.loyaltyItem}>
                <Text style={[styles.loyaltyValue, { color: colors.success }]}>
                  {formatMetric(audienceData.loyalty.new)}
                </Text>
                <Text style={[styles.loyaltyLabel, { color: colors.textSecondary }]}>New</Text>
              </View>
              <View style={styles.loyaltyItem}>
                <Text style={[styles.loyaltyValue, { color: colors.warning }]}>
                  {formatMetric(audienceData.loyalty.returning)}
                </Text>
                <Text style={[styles.loyaltyLabel, { color: colors.textSecondary }]}>Returning</Text>
              </View>
              <View style={styles.loyaltyItem}>
                <Text style={[styles.loyaltyValue, { color: colors.primary }]}>
                  {formatMetric(audienceData.loyalty.frequent)}
                </Text>
                <Text style={[styles.loyaltyLabel, { color: colors.textSecondary }]}>Frequent</Text>
              </View>
              <View style={styles.loyaltyItem}>
                <Text style={[styles.loyaltyValue, { color: colors.error }]}>
                  {formatMetric(audienceData.loyalty.churned)}
                </Text>
                <Text style={[styles.loyaltyLabel, { color: colors.textSecondary }]}>Churned</Text>
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
  periodContainer: {
    marginBottom: 16,
  },
  periodLabel: {
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
  growthStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  growthStat: {
    alignItems: 'center',
  },
  growthStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  growthStatLabel: {
    fontSize: 11,
  },
  languageCard: {
    padding: 16,
    marginBottom: 16,
  },
  languageList: {
    gap: 12,
  },
  languageItem: {
    gap: 4,
  },
  languageName: {
    fontSize: 13,
    fontWeight: '500',
  },
  languagePercentage: {
    fontSize: 11,
    textAlign: 'right',
  },
  deviceCard: {
    padding: 16,
    marginBottom: 16,
  },
  deviceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deviceItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '500',
  },
  devicePercentage: {
    fontSize: 11,
  },
  activeTimesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  activeTimeItem: {
    alignItems: 'center',
  },
  activeTimeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  activeTimeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  hourlyBars: {
    gap: 8,
  },
  hourlyBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hourlyLabel: {
    width: 35,
    fontSize: 11,
  },
  loyaltyCard: {
    padding: 16,
    marginBottom: 16,
  },
  loyaltyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loyaltyItem: {
    alignItems: 'center',
  },
  loyaltyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loyaltyLabel: {
    fontSize: 11,
  },
});