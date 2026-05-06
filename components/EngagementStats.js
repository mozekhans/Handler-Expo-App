import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

const EngagementStats = ({ stats }) => {
  const pieData = [
    {
      name: 'Positive',
      population: stats?.sentiment?.positive || 0,
      color: theme.colors.success,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Neutral',
      population: stats?.sentiment?.neutral || 0,
      color: theme.colors.warning,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Negative',
      population: stats?.sentiment?.negative || 0,
      color: theme.colors.error,
      legendFontColor: theme.colors.text,
    }
  ];

  const StatCard = ({ title, value, icon, color, change }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={20} color={color} />
        <Text style={[styles.statChange, { color: change > 0 ? theme.colors.success : theme.colors.error }]}>
          {change > 0 ? '+' : ''}{change}%
        </Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const ResponseTimeCard = () => (
    <View style={styles.responseCard}>
      <Text style={styles.responseTitle}>Response Time</Text>
      <View style={styles.responseGrid}>
        <View style={styles.responseItem}>
          <Text style={styles.responseValue}>{Math.round(stats?.responseTime?.average / 60)}m</Text>
          <Text style={styles.responseLabel}>Average</Text>
        </View>
        <View style={styles.responseDivider} />
        <View style={styles.responseItem}>
          <Text style={styles.responseValue}>{Math.round(stats?.responseTime?.min / 60)}m</Text>
          <Text style={styles.responseLabel}>Fastest</Text>
        </View>
        <View style={styles.responseDivider} />
        <View style={styles.responseItem}>
          <Text style={styles.responseValue}>{Math.round(stats?.responseTime?.max / 60)}m</Text>
          <Text style={styles.responseLabel}>Slowest</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Engagement Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total"
          value={stats?.total || 0}
          change={stats?.trends?.total || 0}
          icon="forum"
          color={theme.colors.primary}
        />
        <StatCard
          title="Unread"
          value={stats?.unread || 0}
          change={stats?.trends?.unread || 0}
          icon="markunread"
          color={theme.colors.warning}
        />
        <StatCard
          title="Replied"
          value={stats?.replied || 0}
          change={stats?.trends?.replied || 0}
          icon="reply"
          color={theme.colors.success}
        />
        <StatCard
          title="Response Rate"
          value={`${stats?.responseRate || 0}%`}
          change={stats?.trends?.responseRate || 0}
          icon="speed"
          color={theme.colors.info}
        />
      </View>

      <ResponseTimeCard />

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sentiment Distribution</Text>
        {pieData.some(d => d.population > 0) ? (
          <PieChart
            data={pieData}
            width={width - 64}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No sentiment data available</Text>
          </View>
        )}
      </View>

      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Breakdown by Type</Text>
        {stats?.byType && Object.entries(stats.byType).map(([type, count]) => (
          <View key={type} style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>{type}</Text>
            <View style={styles.breakdownBarContainer}>
              <View 
                style={[
                  styles.breakdownBar, 
                  { width: `${(count / stats.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.breakdownCount}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Breakdown by Platform</Text>
        {stats?.byPlatform && Object.entries(stats.byPlatform).map(([platform, count]) => (
          <View key={platform} style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>{platform}</Text>
            <View style={styles.breakdownBarContainer}>
              <View 
                style={[
                  styles.breakdownBar, 
                  { width: `${(count / stats.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.breakdownCount}>{count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  responseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  responseGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseItem: {
    flex: 1,
    alignItems: 'center',
  },
  responseValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  responseLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  responseDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  breakdownContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    width: 80,
    fontSize: 14,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  breakdownBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  breakdownCount: {
    width: 40,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'right',
  },
});

export default EngagementStats;