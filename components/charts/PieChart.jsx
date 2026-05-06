import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { useTheme } from '../../hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');

export default function PieChart({ 
  data, 
  title, 
  height = 220, 
  centerLabel = null,
  hasLegend = true
}) {
  const { colors } = useTheme();

  const chartConfig = {
    color: (opacity = 1) => colors.text,
    labelColor: (opacity = 1) => colors.textSecondary,
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }

  // Format data for the chart
  const formattedData = data.map(item => ({
    ...item,
    legendFontColor: item.legendFontColor || colors.text,
    legendFontSize: item.legendFontSize || 12,
  }));

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <RNPieChart
        data={formattedData}
        width={screenWidth - 48}
        height={height}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={hasLegend}
      />
      {centerLabel && (
        <View style={styles.centerLabelContainer}>
          <Text style={[styles.centerLabelText, { color: colors.text }]}>
            {centerLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
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
  centerLabelContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -10 }],
  },
  centerLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});