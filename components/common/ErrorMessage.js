import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Changed import
import { theme } from '../../styles/theme';

const ErrorMessage = ({ 
  message = 'An error occurred', 
  onRetry, 
  fullScreen = false,
  icon = 'alert-circle-outline'
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <Ionicons name={icon} size={64} color={theme.colors.error} />
        <Text style={styles.fullScreenTitle}>Oops!</Text>
        <Text style={styles.fullScreenMessage}>{message}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name={icon} size={24} color={theme.colors.error} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity style={styles.retryLink} onPress={onRetry}>
          <Text style={styles.retryLinkText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  retryLink: {
    paddingHorizontal: theme.spacing.sm,
  },
  retryLinkText: {
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: '600',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  fullScreenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  fullScreenMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorMessage;