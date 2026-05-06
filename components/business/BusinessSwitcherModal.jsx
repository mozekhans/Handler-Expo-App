// src/components/business/BusinessSwitcherModal.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBusinessList } from '../../hooks/useBusinessList';
import LoadingSpinner from '../ui/LoadingSpinner';

const BusinessSwitcherModal = ({
  visible,
  onClose,
  onSwitch,
  currentBusinessId,
}) => {
  const { businesses, loading, switchBusiness } = useBusinessList();
  const [switchingId, setSwitchingId] = useState(null);

  const handleSwitch = async (business) => {
    if (business._id === currentBusinessId) {
      onClose();
      return;
    }

    try {
      setSwitchingId(business._id);
      const result = await switchBusiness(business._id);
      if (result.success) {
        onSwitch?.(business);
        onClose();
      }
    } catch (error) {
      console.error('Failed to switch business:', error);
    } finally {
      setSwitchingId(null);
    }
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      technology: 'hardware-chip-outline',
      software: 'code-slash-outline',
      ecommerce: 'cart-outline',
      retail: 'storefront-outline',
      fashion: 'shirt-outline',
      beauty: 'flower-outline',
      food_beverage: 'restaurant-outline',
      other: 'business-outline',
    };
    return icons[industry] || 'business-outline';
  };

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.businessItem,
        item._id === currentBusinessId && styles.activeBusinessItem
      ]}
      onPress={() => handleSwitch(item)}
      disabled={switchingId === item._id}
    >
      <View style={styles.businessIcon}>
        {item.branding?.logo ? (
          <Image source={{ uri: item.branding.logo }} style={styles.logo} />
        ) : (
          <View style={styles.iconPlaceholder}>
            <Ionicons name={getIndustryIcon(item.industry)} size={24} color="#1976d2" />
          </View>
        )}
      </View>

      <View style={styles.businessInfo}>
        <Text style={styles.businessName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.businessMeta}>
          {item.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {item.teamMembers?.length > 0 && ` • ${item.teamMembers.length} members`}
        </Text>
      </View>

      {switchingId === item._id ? (
        <LoadingSpinner size="small" />
      ) : item._id === currentBusinessId ? (
        <View style={styles.currentBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Switch Business</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a business to manage
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner />
            </View>
          ) : (
            <FlatList
              data={businesses}
              keyExtractor={(item) => item._id}
              renderItem={renderBusinessItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              onClose();
              // Navigate to create business
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#1976d2" />
            <Text style={styles.createButtonText}>Create New Business</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeBusinessItem: {
    backgroundColor: '#e8f5e9',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  businessIcon: {
    marginRight: 15,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  businessMeta: {
    fontSize: 13,
    color: '#666',
  },
  currentBadge: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  createButtonText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default BusinessSwitcherModal;