// src/components/business/BusinessSwitcherHeader.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BusinessSwitcherModal from './BusinessSwitcherModal';
import { useBusinessStore } from '../../stores/businessStore';

const BusinessSwitcherHeader = ({ onSwitch }) => {
  const { currentBusiness } = useBusinessStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSwitch = (business) => {
    onSwitch?.(business);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={styles.businessName} numberOfLines={1}>
            {currentBusiness?.name || 'Select Business'}
          </Text>
          {currentBusiness && (
            <Text style={styles.businessIndustry} numberOfLines={1}>
              {currentBusiness.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={18} color="#666" />
      </TouchableOpacity>

      <BusinessSwitcherModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSwitch={handleSwitch}
        currentBusinessId={currentBusiness?._id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    maxWidth: 200,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  businessIndustry: {
    fontSize: 11,
    color: '#666',
  },
});

export default BusinessSwitcherHeader;