// src/components/business/BusinessSwitcher.jsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessSwitcher = ({ businesses, currentBusiness, onSwitch }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSwitch = (businessId) => {
    onSwitch(businessId);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.currentBusiness}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{currentBusiness?.name}</Text>
          <Text style={styles.businessIndustry}>
            {currentBusiness?.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Business</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={businesses}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.businessItem,
                    item._id === currentBusiness?._id && styles.activeBusinessItem
                  ]}
                  onPress={() => handleSwitch(item._id)}
                >
                  <View style={styles.businessItemInfo}>
                    <Text style={[
                      styles.businessItemName,
                      item._id === currentBusiness?._id && styles.activeBusinessName
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={styles.businessItemIndustry}>
                      {item.industry?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                  {item._id === currentBusiness?._id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1976d2" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  currentBusiness: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  businessIndustry: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  activeBusinessItem: {
    backgroundColor: '#e3f2fd',
  },
  businessItemInfo: {
    flex: 1,
  },
  businessItemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  activeBusinessName: {
    color: '#1976d2',
    fontWeight: '600',
  },
  businessItemIndustry: {
    fontSize: 13,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default BusinessSwitcher;