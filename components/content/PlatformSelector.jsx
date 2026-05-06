// components/PlatformSelector.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { SOCIAL_PLATFORMS, PLATFORM_ICONS } from '../../utils/constants';

const PlatformSelector = ({ selectedPlatforms = [], onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedPlatforms);

  const platforms = Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => ({
    id: value,
    name: key,
    value: value,
  }));

  const togglePlatform = (platform) => {
    const exists = tempSelected.find(p => p.platform === platform.value);
    if (exists) {
      setTempSelected(tempSelected.filter(p => p.platform !== platform.value));
    } else {
      setTempSelected([...tempSelected, { platform: platform.value }]);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedPlatforms);
    setModalVisible(false);
  };

  const getSelectedNames = () => {
    if (selectedPlatforms.length === 0) return 'No platforms selected';
    if (selectedPlatforms.length === 1) return selectedPlatforms[0].platform;
    if (selectedPlatforms.length === 2) 
      return `${selectedPlatforms[0].platform}, ${selectedPlatforms[1].platform}`;
    return `${selectedPlatforms[0].platform} +${selectedPlatforms.length - 1}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>{getSelectedNames()}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Platforms</Text>
            
            <FlatList
              data={platforms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.platformItem}
                  onPress={() => togglePlatform(item)}
                >
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformIcon}>
                      {PLATFORM_ICONS[item.value] || '📱'}
                    </Text>
                    <Text style={styles.platformName}>{item.name}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    tempSelected.some(p => p.platform === item.value) && styles.checkboxChecked
                  ]}>
                    {tempSelected.some(p => p.platform === item.value) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm ({tempSelected.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  chevron: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlatformSelector;