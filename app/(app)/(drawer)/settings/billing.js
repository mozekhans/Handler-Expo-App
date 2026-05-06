import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../../../hooks/useSubscription';
import { theme } from '../../../../styles/theme';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import Button from '../../../../components/common/Button';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog';

export default function BillingScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const { getCurrentSubscription, getPaymentMethods, getInvoices, cancelSubscription } = useSubscription();

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [subData, paymentData, invoiceData] = await Promise.all([
        getCurrentSubscription(),
        getPaymentMethods(),
        getInvoices(),
      ]);
      setSubscription(subData);
      setPaymentMethods(paymentData);
      setInvoices(invoiceData);
    } catch (err) {
      setError(err.message || 'Failed to load billing data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBillingData();
  };

  const handleCancelSubscription = async () => {
    setCancelDialogVisible(false);
    try {
      await cancelSubscription();
      Alert.alert('Success', 'Subscription cancelled successfully');
      loadBillingData();
    } catch (err) {
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading billing info..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadBillingData}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Billing" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{subscription?.plan?.name || 'Free Plan'}</Text>
                <Text style={styles.planPrice}>
                  {subscription?.plan?.price ? formatCurrency(subscription.plan.price) : 'Free'} / {subscription?.plan?.interval || 'month'}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: subscription?.status === 'active' ? theme.colors.success + '20' : theme.colors.warning + '20' }]}>
                <Text style={[styles.statusText, { color: subscription?.status === 'active' ? theme.colors.success : theme.colors.warning }]}>
                  {subscription?.status?.toUpperCase() || 'INACTIVE'}
                </Text>
              </View>
            </View>

            {subscription?.nextBillingDate && (
              <View style={styles.planDetail}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.planDetailText}>
                  Next billing: {formatDate(subscription.nextBillingDate, 'MMM d, yyyy')}
                </Text>
              </View>
            )}

            {subscription?.trialEnds && (
              <View style={styles.planDetail}>
                <Ionicons name="hourglass-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.planDetailText}>
                  Trial ends: {formatDate(subscription.trialEnds, 'MMM d, yyyy')}
                </Text>
              </View>
            )}

            <View style={styles.planActions}>
              <Button
                title="Change Plan"
                onPress={() => router.push('/settings/plans')}
                variant="outline"
                size="sm"
                style={styles.planActionButton}
              />
              {subscription?.status === 'active' && (
                <Button
                  title="Cancel"
                  onPress={() => setCancelDialogVisible(true)}
                  variant="outline"
                  size="sm"
                  color="error"
                  style={styles.planActionButton}
                />
              )}
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.addButton}>Add New</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={40} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>No payment methods added</Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodCard}>
                <View style={styles.paymentMethodIcon}>
                  <Ionicons name={method.brand === 'visa' ? 'card-outline' : 'card-outline'} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>
                    {method.brand} •••• {method.last4}
                  </Text>
                  <Text style={styles.paymentMethodExpiry}>
                    Expires {method.expMonth}/{method.expYear}
                  </Text>
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Invoices</Text>
            <TouchableOpacity onPress={() => router.push('/settings/invoices')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          {invoices.slice(0, 5).map((invoice) => (
            <TouchableOpacity
              key={invoice.id}
              style={styles.invoiceItem}
              onPress={() => router.push(`/settings/invoices/${invoice.id}`)}
            >
              <View style={styles.invoiceInfo}>
                <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                <Text style={styles.invoiceDate}>{formatDate(invoice.date, 'MMM d, yyyy')}</Text>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</Text>
                <View style={[styles.invoiceStatus, { backgroundColor: invoice.status === 'paid' ? theme.colors.success + '20' : theme.colors.warning + '20' }]}>
                  <Text style={[styles.invoiceStatusText, { color: invoice.status === 'paid' ? theme.colors.success : theme.colors.warning }]}>
                    {invoice.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>

      <ConfirmationDialog
        visible={cancelDialogVisible}
        onClose={() => setCancelDialogVisible(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period."
        confirmText="Cancel Subscription"
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  viewAllButton: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  planCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  planPrice: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: 4,
  },
  planDetailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  planActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  planActionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  paymentMethodExpiry: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  invoiceDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  invoiceStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  invoiceStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});