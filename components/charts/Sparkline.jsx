import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

export default function Sparkline({ 
  data, 
  width = 100, 
  height = 40, 
  color = null,
  showArea = false
}) {
  const { colors } = useTheme();
  const lineColor = color || colors.primary;

  const chartData = {
    labels: data.map((_, i) => ''),
    datasets: [{ data }],
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => lineColor,
    labelColor: (opacity = 1) => 'transparent',
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
  };

  if (!data || data.length < 2) {
    return (
      <View style={[styles.emptyContainer, { width, height }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>-</Text>
      </View>
    );
  }

  return (
    <LineChart
      data={chartData}
      width={width}
      height={height}
      chartConfig={chartConfig}
      bezier
      withDots={false}
      withInnerLines={false}
      withOuterLines={false}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      withVerticalLines={false}
      style={styles.chart}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    margin: 0,
    padding: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
  },
});