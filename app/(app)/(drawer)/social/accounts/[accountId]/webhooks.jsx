import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../../components/common/Header';
import WebhookForm from '../../../../../../components/social/WebhookForm';
import socialService from '../../../../../../services/socialService';
import { theme } from '../../../../../../styles/theme';

export default function WebhooksScreen() {
  const { accountId, businessId } = useLocalSearchParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [testingId, setTestingId] = useState(null);

  const fetchAccount = useCallback(async () => {
    try {
      const response = await socialService.getAccount(businessId, accountId);
      setAccount(response.account);
    } catch (err) {
      Alert.alert('Error', 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  }, [accountId, businessId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAccount();
    }, [fetchAccount])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAccount();
    setRefreshing(false);
  }, [fetchAccount]);

  const handleCreateWebhook = async (webhookData) => {
    try {
      const response = await socialService.createWebhook(
        businessId,
        accountId,
        webhookData
      );
      Alert.alert('Success', 'Webhook created successfully');
      setShowForm(false);
      await fetchAccount();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create webhook');
    }
  };

  const handleDeleteWebhook = (webhookId) => {
    Alert.alert(
      'Delete Webhook',
      'Are you sure you want to delete this webhook?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await socialService.deleteWebhook(businessId, accountId, webhookId);
              Alert.alert('Success', 'Webhook deleted');
              await fetchAccount();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleTestWebhook = async (webhookId) => {
    try {
      setTestingId(webhookId);
      const response = await socialService.testWebhook(
        businessId,
        accountId,
        webhookId
      );
      Alert.alert(
        'Test Result',
        `Status: ${response.statusCode}\nResponse: ${JSON.stringify(response.response)}`
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Webhook test failed');
    } finally {
      setTestingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Webhooks" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  const webhooks = account?.webhooks || [];

  return (
    <View style={styles.container}>
      <Header title="Webhooks" showBack />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerActions}>
          <Text style={styles.title}>
            Webhooks ({webhooks.length})
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(!showForm)}
          >
            <Ionicons
              name={showForm ? 'close' : 'add'}
              size={20}
              color="#fff"
            />
            <Text style={styles.addButtonText}>
              {showForm ? 'Cancel' : 'Add Webhook'}
            </Text>
          </TouchableOpacity>
        </View>

        {showForm && (
          <WebhookForm
            account={account}
            onSubmit={handleCreateWebhook}
            onCancel={() => setShowForm(false)}
          />
        )}

        {webhooks.length === 0 && !showForm ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="link" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No webhooks configured</Text>
            <Text style={styles.emptySubtext}>
              Webhooks allow you to receive real-time notifications for account events
            </Text>
          </View>
        ) : (
          webhooks.map((webhook) => (
            <View key={webhook._id} style={styles.webhookCard}>
              <View style={styles.webhookHeader}>
                <View style={styles.webhookUrl}>
                  <Ionicons
                    name={webhook.isActive ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={webhook.isActive ? theme.colors.success : theme.colors.error}
                  />
                  <Text style={styles.urlText} numberOfLines={1}>
                    {webhook.url}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteWebhook(webhook._id)}
                >
                  <Ionicons name="trash" size={18} color={theme.colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.eventsContainer}>
                {webhook.events?.map((event) => (
                  <View key={event} style={styles.eventBadge}>
                    <Text style={styles.eventText}>{event}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.testButton, testingId === webhook._id && styles.testingButton]}
                onPress={() => handleTestWebhook(webhook._id)}
                disabled={testingId !== null}
              >
                {testingId === webhook._id ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <>
                    <Ionicons name="pulse" size={14} color={theme.colors.primary} />
                    <Text style={styles.testText}>Test Webhook</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  webhookCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  webhookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  webhookUrl: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  urlText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  eventsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  eventBadge: {
    backgroundColor: theme.colors.primary + '15',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  eventText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  testingButton: {
    opacity: 0.7,
  },
  testText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
});