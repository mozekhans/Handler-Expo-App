import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

const AnalyticsCard = ({ title, data, metrics, onPress }) => {
  const getChangeColor = (change) => {
    if (change > 0) return theme.colors.success;
    if (change < 0) return theme.colors.error;
    return theme.colors.textSecondary;
  };

  const getChangeIcon = (change) => {
    if (change > 5) return 'trending-up';
    if (change > 0) return 'arrow-upward';
    if (change < -5) return 'trending-down';
    if (change < 0) return 'arrow-downward';
    return 'trending-flat';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
      </View>

      {data && data.length > 0 && (
        <LineChart
          data={{
            labels: [],
            datasets: [{
              data: data.map(d => d.value)
            }]
          }}
          width={width - 80}
          height={100}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            decimalPlaces: 0,
            color: (opacity = 1) => theme.colors.primary,
            labelColor: () => 'transparent',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '0',
              strokeWidth: '0'
            }
          }}
          bezier
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          style={styles.chart}
        />
      )}

      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <View style={styles.metricValueContainer}>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <View style={[styles.changeContainer, { backgroundColor: getChangeColor(metric.change) + '20' }]}>
                <Icon 
                  name={getChangeIcon(metric.change)} 
                  size={14} 
                  color={getChangeColor(metric.change)} 
                />
                <Text style={[styles.changeText, { color: getChangeColor(metric.change) }]}>
                  {Math.abs(metric.change)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  chart: {
    marginVertical: 8,
    marginLeft: -16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  metricItem: {
    flex: 1,
    minWidth: '40%',
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default AnalyticsCard;