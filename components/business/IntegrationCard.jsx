// src/components/business/IntegrationCard.jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '../../utils/formatters';

const IntegrationCard = ({ integration, onSync, onConfigure, onRemove }) => {
  const getIntegrationIcon = (type) => {
    const icons = {
      social: 'share-social',
      crm: 'people',
      ecommerce: 'cart',
      analytics: 'bar-chart',
      email: 'mail',
      support: 'headset',
    };
    return icons[type] || 'apps';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIntegrationIcon(integration.type)} size={24} color="#1976d2" />
        </View>
        
        <View style={styles.info}>
          <Text style={styles.providerName}>
            {integration.provider.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
          <Text style={styles.typeLabel}>{integration.type.toUpperCase()}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(integration.status) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(integration.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(integration.status) }]}>
            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
          </Text>
        </View>
      </View>

      {integration.lastSync && (
        <View style={styles.syncInfo}>
          <Ionicons name="time-outline" size={14} color="#999" />
          <Text style={styles.syncText}>
            Last synced: {formatDateTime(integration.lastSync)}
          </Text>
        </View>
      )}

      {integration.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={14} color="#d32f2f" />
          <Text style={styles.errorText} numberOfLines={2}>
            {integration.error}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onSync}>
          <Ionicons name="sync-outline" size={20} color="#1976d2" />
          <Text style={styles.actionText}>Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onConfigure}>
          <Ionicons name="settings-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Configure</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.removeButton]} 
          onPress={onRemove}
        >
          <Ionicons name="trash-outline" size={20} color="#d32f2f" />
          <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#d32f2f',
    marginLeft: 6,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  removeButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  removeText: {
    color: '#d32f2f',
  },
});

export default IntegrationCard;