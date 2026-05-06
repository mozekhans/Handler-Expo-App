import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../../../../hooks/useSubscription';
import { theme } from '../../../../../styles/theme';
import { formatCurrency, formatDate } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Card from '../../../../../components/common/Card';
import Button from '../../../../../components/common/Button';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const { getInvoice, downloadInvoice, emailInvoice } = useSubscription();

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data = await getInvoice(id);
      setInvoice(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadInvoice(id);
      Alert.alert('Success', 'Invoice downloaded successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to download invoice');
    }
  };

  const handleEmail = async () => {
    try {
      await emailInvoice(id);
      Alert.alert('Success', 'Invoice sent to your email');
    } catch (err) {
      Alert.alert('Error', 'Failed to send invoice');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Invoice ${invoice.number} - ${formatCurrency(invoice.amount)}`,
        title: `Invoice ${invoice.number}`,
      });
    } catch (err) {
      if (!err.message?.includes('CANCELLED')) {
        Alert.alert('Error', 'Failed to share invoice');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'overdue': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen text="Loading invoice..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadInvoice}
        icon="alert-circle-outline"
      />
    );
  }

  if (!invoice) {
    return (
      <ErrorMessage
        fullScreen
        message="Invoice not found"
        icon="information-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Invoice Details" showBack={true} />

      <ScrollView style={styles.content}>
        <Card style={styles.invoiceCard}>
          <View style={styles.header}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNumber}>{invoice.number}</Text>
            <Text style={styles.invoiceDate}>Date: {formatDate(invoice.date, 'MMMM d, yyyy')}</Text>
            {invoice.dueDate && (
              <Text style={styles.invoiceDate}>Due Date: {formatDate(invoice.dueDate, 'MMMM d, yyyy')}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.billingSection}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.billingName}>{invoice.customer?.name}</Text>
            <Text style={styles.billingEmail}>{invoice.customer?.email}</Text>
            {invoice.customer?.address && (
              <>
                <Text style={styles.billingAddress}>{invoice.customer.address.line1}</Text>
                {invoice.customer.address.line2 && (
                  <Text style={styles.billingAddress}>{invoice.customer.address.line2}</Text>
                )}
                <Text style={styles.billingAddress}>
                  {invoice.customer.address.city}, {invoice.customer.address.state} {invoice.customer.address.postalCode}
                </Text>
                <Text style={styles.billingAddress}>{invoice.customer.address.country}</Text>
              </>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.itemsHeader}>
              <Text style={styles.itemNameHeader}>Description</Text>
              <Text style={styles.itemQtyHeader}>Qty</Text>
              <Text style={styles.itemPriceHeader}>Price</Text>
              <Text style={styles.itemTotalHeader}>Total</Text>
            </View>
            {invoice.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.description}</Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.itemTotal}>{formatCurrency(item.total)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            {invoice.tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax ({invoice.taxRate}%):</Text>
                <Text style={styles.summaryValue}>{formatCurrency(invoice.tax)}</Text>
              </View>
            )}
            {invoice.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount:</Text>
                <Text style={styles.summaryValue}>-{formatCurrency(invoice.discount)}</Text>
              </View>
            )}
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>{formatCurrency(invoice.amount)}</Text>
            </View>
          </View>

          {invoice.paidAt && (
            <>
              <View style={styles.divider} />
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Information</Text>
                <Text style={styles.paymentText}>Paid on: {formatDate(invoice.paidAt, 'MMMM d, yyyy h:mm a')}</Text>
                {invoice.paymentMethod && (
                  <Text style={styles.paymentText}>Payment Method: {invoice.paymentMethod}</Text>
                )}
                {invoice.transactionId && (
                  <Text style={styles.paymentText}>Transaction ID: {invoice.transactionId}</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.actions}>
            <Button
              title="Download PDF"
              onPress={handleDownload}
              icon="download-outline"
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Email Invoice"
              onPress={handleEmail}
              icon="mail-outline"
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Share"
              onPress={handleShare}
              icon="share-outline"
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  invoiceCard: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
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
  invoiceInfo: {
    marginBottom: theme.spacing.md,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  billingSection: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  billingName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  billingEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  billingAddress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  itemsSection: {
    marginBottom: theme.spacing.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  itemNameHeader: {
    flex: 3,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  itemQtyHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  itemPriceHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  itemTotalHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.xs,
  },
  itemName: {
    flex: 3,
    fontSize: 14,
    color: theme.colors.text,
  },
  itemQty: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'right',
  },
  itemTotal: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'right',
  },
  summarySection: {
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  paymentSection: {
    marginBottom: theme.spacing.md,
  },
  paymentText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});