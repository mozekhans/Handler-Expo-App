// src/components/ui/FormSelect.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormSelect = ({
  label,
  value,
  onSelect,
  options = [],
  placeholder = 'Select an option',
  error,
  success,
  warning,
  helper,
  required = false,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  multiple = false,
  variant = 'default', // default, outlined, filled
  size = 'medium', // small, medium, large
  leftIcon,
  clearable = true,
  loading = false,
  emptyMessage = 'No options available',
  grouped = false,
  groupKey = 'group',
  labelKey = 'label',
  valueKey = 'value',
  renderOption,
  renderSelected,
  zIndex = 1,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const getSelectedLabels = () => {
    if (multiple) {
      const selectedOptions = options.filter(opt => 
        value?.includes(opt[valueKey])
      );
      return selectedOptions.map(opt => opt[labelKey]);
    }
    const selectedOption = options.find(opt => opt[valueKey] === value);
    return selectedOption ? [selectedOption[labelKey]] : [];
  };

  const selectedLabels = getSelectedLabels();

  const filteredOptions = React.useMemo(() => {
    if (!searchText) return options;
    
    return options.filter(opt => {
      const label = opt[labelKey]?.toLowerCase() || '';
      const value = opt[valueKey]?.toString().toLowerCase() || '';
      const search = searchText.toLowerCase();
      return label.includes(search) || value.includes(search);
    });
  }, [options, searchText, labelKey, valueKey]);

  const groupedOptions = React.useMemo(() => {
    if (!grouped) return null;
    
    const groups = {};
    filteredOptions.forEach(opt => {
      const group = opt[groupKey] || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(opt);
    });
    return groups;
  }, [filteredOptions, grouped, groupKey]);

  const handleSelect = (selectedValue) => {
    if (multiple) {
      const currentValues = value || [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue];
      onSelect(newValues);
    } else {
      onSelect(selectedValue);
      setModalVisible(false);
    }
  };

  const handleClear = () => {
    if (multiple) {
      onSelect([]);
    } else {
      onSelect('');
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return value?.includes(optionValue);
    }
    return value === optionValue;
  };

  const getBorderColor = () => {
    if (error) return '#d32f2f';
    if (success) return '#4caf50';
    if (warning) return '#ff9800';
    if (isFocused) return '#1976d2';
    return '#e0e0e0';
  };

  const getDisplayText = () => {
    if (selectedLabels.length === 0) return placeholder;
    if (selectedLabels.length === 1) return selectedLabels[0];
    if (selectedLabels.length <= 3) {
      return selectedLabels.join(', ');
    }
    return `${selectedLabels.length} selected`;
  };

  const renderDefaultOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        isSelected(item[valueKey]) && styles.selectedOption
      ]}
      onPress={() => handleSelect(item[valueKey])}
    >
      <View style={styles.optionContent}>
        <Text style={[
          styles.optionText,
          isSelected(item[valueKey]) && styles.selectedOptionText
        ]}>
          {item[labelKey]}
        </Text>
        {item.description && (
          <Text style={styles.optionDescription}>{item.description}</Text>
        )}
      </View>
      {isSelected(item[valueKey]) && (
        <Ionicons name="checkmark" size={20} color="#1976d2" />
      )}
      {multiple && !isSelected(item[valueKey]) && (
        <View style={styles.checkbox} />
      )}
    </TouchableOpacity>
  );

  const renderGroupedOptions = () => {
    return (
      <ScrollView style={styles.groupedContainer}>
        {Object.entries(groupedOptions).map(([group, groupOptions]) => (
          <View key={group} style={styles.groupSection}>
            <Text style={styles.groupHeader}>{group}</Text>
            {groupOptions.map((option) => (
              <View key={option[valueKey]}>
                {renderDefaultOption({ item: option })}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { zIndex }]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            borderColor: getBorderColor(),
            minHeight: size === 'small' ? 40 : size === 'large' ? 56 : 48,
          },
          variant === 'outlined' && styles.outlined,
          variant === 'filled' && styles.filled,
          isFocused && styles.focused,
          error && styles.error,
          success && styles.success,
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && !loading && setModalVisible(true)}
        disabled={disabled || loading}
        activeOpacity={0.7}
        testID={testID}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <Text
          style={[
            styles.selectText,
            selectedLabels.length === 0 && styles.placeholderText,
            disabled && styles.disabledText,
            size === 'small' && styles.smallText,
            size === 'large' && styles.largeText,
          ]}
          numberOfLines={1}
        >
          {renderSelected ? renderSelected(value, options) : getDisplayText()}
        </Text>

        <View style={styles.rightIcons}>
          {clearable && value && (multiple ? value.length > 0 : true) && !disabled && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
          
          {loading ? (
            <View style={styles.loadingIcon}>
              <Ionicons name="sync" size={18} color="#999" />
            </View>
          ) : (
            <Ionicons
              name={modalVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
          )}
        </View>
      </TouchableOpacity>

      {(error || success || warning || helper) && (
        <View style={styles.helperContainer}>
          {error && (
            <>
              <Ionicons name="alert-circle" size={14} color="#d32f2f" />
              <Text style={[styles.helperText, styles.errorText]}>{error}</Text>
            </>
          )}
          {success && !error && (
            <>
              <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
              <Text style={[styles.helperText, styles.successText]}>{success}</Text>
            </>
          )}
          {warning && !error && !success && (
            <>
              <Ionicons name="warning" size={14} color="#ff9800" />
              <Text style={[styles.helperText, styles.warningText]}>{warning}</Text>
            </>
          )}
          {helper && !error && !success && !warning && (
            <Text style={styles.helperText}>{helper}</Text>
          )}
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Select'}
                {multiple && value?.length > 0 && ` (${value.length} selected)`}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSearchText('');
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#999"
                  autoFocus
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {filteredOptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : grouped ? (
              renderGroupedOptions()
            ) : (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item[valueKey]?.toString()}
                renderItem={renderOption || renderDefaultOption}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.optionsList}
                showsVerticalScrollIndicator={false}
              />
            )}

            {multiple && (
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => {
                    setModalVisible(false);
                    setSearchText('');
                  }}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: '#d32f2f',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  outlined: {
    backgroundColor: 'transparent',
  },
  filled: {
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  focused: {
    borderColor: '#1976d2',
  },
  error: {
    borderColor: '#d32f2f',
  },
  success: {
    borderColor: '#4caf50',
  },
  disabled: {
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  smallText: {
    fontSize: 14,
    paddingVertical: 10,
  },
  largeText: {
    fontSize: 18,
    paddingVertical: 14,
  },
  placeholderText: {
    color: '#999',
  },
  disabledText: {
    color: '#999',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  loadingIcon: {
    marginLeft: 4,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    flex: 1,
  },
  errorText: {
    color: '#d32f2f',
  },
  successText: {
    color: '#4caf50',
  },
  warningText: {
    color: '#ff9800',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    paddingVertical: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  optionsList: {
    flexGrow: 1,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  groupedContainer: {
    flex: 1,
  },
  groupSection: {
    marginBottom: 8,
  },
  groupHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  doneButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormSelect;