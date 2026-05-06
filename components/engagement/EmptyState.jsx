// components/engagement/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const EmptyState = ({ 
  icon = 'alert-circle-outline', 
  title = 'No Data', 
  message = 'Nothing to display at the moment',
  action,
  compact = false 
}) => {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={[styles.iconContainer, compact && styles.compactIcon]}>
        <Ionicons 
          name={icon} 
          size={compact ? 40 : 64} 
          color={theme.colors.textSecondary} 
        />
      </View>
      <Text style={[styles.title, compact && styles.compactTitle]}>
        {title}
      </Text>
      <Text style={[styles.message, compact && styles.compactMessage]}>
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          {action.icon && (
            <Ionicons name={action.icon} size={18} color="white" />
          )}
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  compactContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
  },
  compactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  compactMessage: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...theme.shadows.medium,
  },
  actionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default EmptyState;