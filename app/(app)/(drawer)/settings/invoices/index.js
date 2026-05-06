import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../../../../hooks/useSubscription';
import { theme } from '../../../../../styles/theme';
import { formatCurrency, formatDate } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Card from '../../../../../components/common/Card';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import EmptyState from '../../../../../components/common/EmptyState';
import ConfirmationDialog from '../../../../../components/common/ConfirmationDialog';

export default function InvoicesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [shareDialogVisible, setShareDialogVisible] = useState(false);
  const { getInvoices, downloadInvoice, emailInvoice } = useSubscription();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInvoices();
  };

  const handleDownload = async (invoice) => {
    try {
      await downloadInvoice(invoice.id);
      Alert.alert('Success', 'Invoice downloaded successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to download invoice');
    }
  };

  const handleEmail = async (invoice) => {
    try {
      await emailInvoice(invoice.id);
      Alert.alert('Success', 'Invoice sent to your email');
    } catch (err) {
      Alert.alert('Error', 'Failed to send invoice');
    }
  };

  const handleShare = async (invoice) => {
    setSelectedInvoice(invoice);
    setShareDialogVisible(true);
  };

  const handleShareConfirm = async () => {
    setShareDialogVisible(false);
    if (selectedInvoice) {
      try {
        await Share.share({
          message: `Invoice ${selectedInvoice.number} - ${formatCurrency(selectedInvoice.amount)}`,
          title: `Invoice ${selectedInvoice.number}`,
        });
      } catch (err) {
        if (!err.message?.includes('CANCELLED')) {
          Alert.alert('Error', 'Failed to share invoice');
        }
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

  const renderInvoiceItem = ({ item }) => (
    <Card style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View>
          <Text style={styles.invoiceNumber}>{item.number}</Text>
          <Text style={styles.invoiceDate}>{formatDate(item.date, 'MMM d, yyyy')}</Text>
        </View>
        <View style={[styles.invoiceStatus, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.invoiceStatusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.invoiceDetails}>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Description</Text>
          <Text style={styles.invoiceValue}>{item.description}</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Amount</Text>
          <Text style={styles.invoiceAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        {item.paidAt && (
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Paid on</Text>
            <Text style={styles.invoiceValue}>{formatDate(item.paidAt, 'MMM d, yyyy')}</Text>
          </View>
        )}
        {item.dueDate && item.status !== 'paid' && (
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Due date</Text>
            <Text style={[styles.invoiceValue, item.status === 'overdue' && styles.overdueText]}>
              {formatDate(item.dueDate, 'MMM d, yyyy')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.invoiceActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDownload(item)}>
          <Ionicons name="download-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEmail(item)}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading invoices..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadInvoices}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Invoices" showBack={true} />

      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Invoices"
            message="Your invoices will appear here once you make a payment"
          />
        }
      />

      <ConfirmationDialog
        visible={shareDialogVisible}
        onClose={() => setShareDialogVisible(false)}
        onConfirm={handleShareConfirm}
        title="Share Invoice"
        message={`Are you sure you want to share invoice ${selectedInvoice?.number}?`}
        confirmText="Share"
        type="info"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  invoiceCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  invoiceDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  invoiceStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  invoiceStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  invoiceDetails: {
    marginBottom: theme.spacing.sm,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  invoiceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  invoiceValue: {
    fontSize: 12,
    color: theme.colors.text,
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  overdueText: {
    color: theme.colors.error,
  },
  invoiceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: theme.spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
});