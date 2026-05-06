import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  onPress,
  loading = false,
  subtitle = null,
  trend = null,
  format = 'number'
}) {
  const { colors } = useTheme();
  
  const formatValue = (val) => {
    if (val === undefined || val === null) return '0';
    if (format === 'percentage') return `${val}%`;
    if (format === 'currency') return `$${val.toLocaleString()}`;
    if (format === 'compact') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    }
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  const getChangeColor = () => {
    if (!change) return colors.textSecondary;
    if (change > 0) return colors.success;
    if (change < 0) return colors.error;
    return colors.textSecondary;
  };

  const getChangeIcon = () => {
    if (!change) return 'remove-outline';
    if (change > 0) return 'trending-up-outline';
    if (change < 0) return 'trending-down-outline';
    return 'remove-outline';
  };

  const getTrendColor = () => {
    if (!trend) return colors.textSecondary;
    if (trend === 'up') return colors.success;
    if (trend === 'down') return colors.error;
    return colors.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'arrow-up-outline';
    if (trend === 'down') return 'arrow-down-outline';
    return 'remove-outline';
  };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Container
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      {...containerProps}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        {change !== undefined && change !== null && (
          <View style={styles.changeContainer}>
            <Ionicons name={getChangeIcon()} size={14} color={getChangeColor()} />
            <Text style={[styles.changeText, { color: getChangeColor() }]}>
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.skeletonContainer}>
            <View style={[styles.skeletonValue, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
          </View>
        ) : (
          <>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatValue(value)}
            </Text>
            <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
            {trend && (
              <View style={styles.trendContainer}>
                <Ionicons name={getTrendIcon()} size={12} color={getTrendColor()} />
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    minWidth: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  skeletonContainer: {
    gap: 8,
  },
  skeletonValue: {
    width: 80,
    height: 28,
    borderRadius: 4,
  },
  skeletonTitle: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
});