// components/engagement/BulkActionsBar.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const BulkActionsBar = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkReply,
  onBulkArchive,
  onBulkDelete,
  onBulkMarkRead,
  onBulkMarkSpam,
}) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action, handler) => {
    if (!selectedCount) return;
    
    setActionLoading(action);
    try {
      await handler?.();
    } catch (error) {
      Alert.alert('Error', `Failed to perform ${action} action`);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = (title, message, action, handler) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: title,
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: () => handleAction(action, handler),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity 
          onPress={onClearSelection}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.countText}>
          <Text style={styles.countNumber}>{selectedCount}</Text>
          {' '}selected
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Mark as Read */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction('markRead', onBulkMarkRead)}
          disabled={actionLoading === 'markRead'}
        >
          {actionLoading === 'markRead' ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={16} color={theme.colors.primary} />
              <Text style={styles.actionText}>Read</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Bulk Reply */}
        <TouchableOpacity
          style={[styles.actionButton, styles.replyButton]}
          onPress={() => handleAction('reply', onBulkReply)}
          disabled={actionLoading === 'reply'}
        >
          {actionLoading === 'reply' ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="chatbubbles" size={16} color="white" />
              <Text style={[styles.actionText, styles.replyText]}>Reply</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Archive */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmAction(
            'Archive',
            `Archive ${selectedCount} engagement(s)?`,
            'archive',
            onBulkArchive
          )}
          disabled={actionLoading === 'archive'}
        >
          {actionLoading === 'archive' ? (
            <ActivityIndicator size="small" color={theme.colors.textSecondary} />
          ) : (
            <Ionicons name="archive" size={16} color={theme.colors.textSecondary} />
          )}
        </TouchableOpacity>

        {/* Spam */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmAction(
            'Mark as Spam',
            `Mark ${selectedCount} engagement(s) as spam?`,
            'spam',
            onBulkMarkSpam
          )}
          disabled={actionLoading === 'spam'}
        >
          {actionLoading === 'spam' ? (
            <ActivityIndicator size="small" color="#F44336" />
          ) : (
            <Ionicons name="flag" size={16} color="#F44336" />
          )}
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => confirmAction(
            'Delete',
            `Permanently delete ${selectedCount} engagement(s)? This cannot be undone.`,
            'delete',
            onBulkDelete
          )}
          disabled={actionLoading === 'delete'}
        >
          {actionLoading === 'delete' ? (
            <ActivityIndicator size="small" color="#F44336" />
          ) : (
            <Ionicons name="trash" size={16} color="#F44336" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryLight + '10',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  closeButton: {
    padding: 4,
  },
  countText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  countNumber: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  replyButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  replyText: {
    color: 'white',
  },
});

export default BulkActionsBar;