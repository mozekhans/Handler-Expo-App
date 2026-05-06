import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');

export default function LineChart({ 
  data, 
  title, 
  height = 220, 
  yAxisSuffix = '',
  yAxisPrefix = '',
  bezier = true,
  formatYLabel = (value) => value.toString()
}) {
  const { colors } = useTheme();

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    formatYLabel: (value) => `${yAxisPrefix}${formatYLabel(value)}${yAxisSuffix}`,
  };

  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <RNLineChart
          data={data}
          width={Math.max(screenWidth - 48, data.labels.length * 50)}
          height={height}
          chartConfig={chartConfig}
          bezier={bezier}
          style={styles.chart}
          formatYLabel={formatYLabel}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
  },
});