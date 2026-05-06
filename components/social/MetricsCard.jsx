import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const MetricsCard = ({ title, value, change, icon, color }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={color || theme.colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {change !== undefined && (
        <View style={styles.changeContainer}>
          <Ionicons
            name={isPositive ? 'trending-up' : isNeutral ? 'remove' : 'trending-down'}
            size={14}
            color={isPositive ? theme.colors.success : isNeutral ? theme.colors.textSecondary : theme.colors.error}
          />
          <Text
            style={[
              styles.change,
              {
                color: isPositive
                  ? theme.colors.success
                  : isNeutral
                  ? theme.colors.textSecondary
                  : theme.colors.error,
              },
            ]}
          >
            {isPositive ? '+' : ''}{change}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    minWidth: 150,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default MetricsCard;