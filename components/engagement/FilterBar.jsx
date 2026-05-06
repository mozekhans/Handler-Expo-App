// components/engagement/FilterBar.js
import React, { useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../styles/theme';
import { formatDate } from '../../utils/engagementHelpers';

const FilterBar = memo(({ filters, onFilterChange, stats }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('start');
  const [tempFilters, setTempFilters] = useState({});

  const quickFilters = [
    { 
      key: 'all', 
      label: 'All', 
      icon: 'list-outline',
      count: stats?.total 
    },
    { 
      key: 'unread', 
      label: 'Unread', 
      icon: 'mail-unread-outline',
      count: stats?.unread,
      color: theme.colors.primary 
    },
    { 
      key: 'unreplied', 
      label: 'Unreplied', 
      icon: 'chatbubble-ellipses-outline',
      count: stats?.unreplied,
      color: '#F44336' 
    },
    { 
      key: 'assigned', 
      label: 'Assigned', 
      icon: 'person-outline' 
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      icon: 'flag-outline' 
    },
  ];

  const platformOptions = [
    { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
    { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
    { key: 'twitter', label: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin', color: '#0A66C2' },
    { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', color: '#000000' },
    { key: 'youtube', label: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
  ];

  const sentimentOptions = [
    { key: 'positive', label: 'Positive', color: '#4CAF50' },
    { key: 'neutral', label: 'Neutral', color: '#9E9E9E' },
    { key: 'negative', label: 'Negative', color: '#F44336' },
  ];

  const priorityOptions = [
    { key: 'low', label: 'Low', color: '#4CAF50' },
    { key: 'medium', label: 'Medium', color: '#2196F3' },
    { key: 'high', label: 'High', color: '#FF9800' },
    { key: 'urgent', label: 'Urgent', color: '#F44336' },
  ];

  const typeOptions = [
    { key: 'comment', label: 'Comments' },
    { key: 'message', label: 'Messages' },
    { key: 'mention', label: 'Mentions' },
    { key: 'reply', label: 'Replies' },
  ];

  const handleQuickFilter = (key) => {
    if (key === 'all') {
      onFilterChange({ 
        status: undefined, 
        priority: undefined,
        platform: undefined,
        sentiment: undefined,
        type: undefined,
        startDate: undefined,
        endDate: undefined,
      });
    } else if (key === 'unread' || key === 'unreplied' || key === 'assigned') {
      onFilterChange({ status: key, priority: undefined });
    } else if (key === 'priority') {
      setTempFilters({ ...filters });
      setShowFilterModal(true);
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      platform: undefined,
      sentiment: undefined,
      priority: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
    };
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setShowFilterModal(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTempFilters(prev => ({
        ...prev,
        [datePickerType === 'start' ? 'startDate' : 'endDate']: selectedDate.toISOString(),
      }));
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.platform) count++;
    if (filters.sentiment) count++;
    if (filters.priority) count++;
    if (filters.type) count++;
    if (filters.startDate || filters.endDate) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <View style={styles.container}>
      {/* Stats Summary */}
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.unread || 0}
            </Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {stats.unreplied || 0}
            </Text>
            <Text style={styles.statLabel}>Unreplied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {stats.responseRate ? `${Math.round(stats.responseRate * 100)}%` : '0%'}
            </Text>
            <Text style={styles.statLabel}>Response</Text>
          </View>
        </View>
      )}

      {/* Quick Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {quickFilters.map((option) => {
          const isActive = 
            option.key === 'all' 
              ? !filters.status && !filters.priority
              : filters.status === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
              ]}
              onPress={() => handleQuickFilter(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={isActive ? 'white' : option.color || theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {option.label}
                {option.count !== undefined && option.count > 0 && 
                  ` (${option.count})`}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Advanced Filter Button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilterCount > 0 && styles.filterButtonActive,
          ]}
          onPress={() => {
            setTempFilters({ ...filters });
            setShowFilterModal(true);
          }}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={activeFilterCount > 0 ? 'white' : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.filterText,
              activeFilterCount > 0 && styles.filterTextActive,
            ]}
          >
            Filters
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFilters}
        >
          {filters.platform && (
            <View style={styles.activeFilterChip}>
              <Ionicons 
                name={`logo-${filters.platform}`} 
                size={12} 
                color={theme.colors.primary} 
              />
              <Text style={styles.activeFilterText}>
                {filters.platform}
              </Text>
              <TouchableOpacity onPress={() => onFilterChange({ platform: undefined })}>
                <Ionicons name="close" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {filters.sentiment && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                {filters.sentiment}
              </Text>
              <TouchableOpacity onPress={() => onFilterChange({ sentiment: undefined })}>
                <Ionicons name="close" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {filters.priority && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                {filters.priority}
              </Text>
              <TouchableOpacity onPress={() => onFilterChange({ priority: undefined })}>
                <Ionicons name="close" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Advanced Filters Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Platform Filter */}
              <Text style={styles.filterSectionTitle}>Platform</Text>
              <View style={styles.chipContainer}>
                {platformOptions.map((platform) => (
                  <TouchableOpacity
                    key={platform.key}
                    style={[
                      styles.chip,
                      tempFilters.platform === platform.key && 
                        { backgroundColor: platform.color, borderColor: platform.color },
                    ]}
                    onPress={() => setTempFilters(prev => ({
                      ...prev,
                      platform: prev.platform === platform.key ? undefined : platform.key,
                    }))}
                  >
                    <Ionicons
                      name={platform.icon}
                      size={16}
                      color={tempFilters.platform === platform.key ? 'white' : platform.color}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        tempFilters.platform === platform.key && styles.chipTextActive,
                      ]}
                    >
                      {platform.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sentiment Filter */}
              <Text style={styles.filterSectionTitle}>Sentiment</Text>
              <View style={styles.chipContainer}>
                {sentimentOptions.map((sentiment) => (
                  <TouchableOpacity
                    key={sentiment.key}
                    style={[
                      styles.chip,
                      tempFilters.sentiment === sentiment.key && 
                        { backgroundColor: sentiment.color, borderColor: sentiment.color },
                    ]}
                    onPress={() => setTempFilters(prev => ({
                      ...prev,
                      sentiment: prev.sentiment === sentiment.key ? undefined : sentiment.key,
                    }))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tempFilters.sentiment === sentiment.key && styles.chipTextActive,
                      ]}
                    >
                      {sentiment.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Priority Filter */}
              <Text style={styles.filterSectionTitle}>Priority</Text>
              <View style={styles.chipContainer}>
                {priorityOptions.map((priority) => (
                  <TouchableOpacity
                    key={priority.key}
                    style={[
                      styles.chip,
                      tempFilters.priority === priority.key && 
                        { backgroundColor: priority.color, borderColor: priority.color },
                    ]}
                    onPress={() => setTempFilters(prev => ({
                      ...prev,
                      priority: prev.priority === priority.key ? undefined : priority.key,
                    }))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tempFilters.priority === priority.key && styles.chipTextActive,
                      ]}
                    >
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Type Filter */}
              <Text style={styles.filterSectionTitle}>Type</Text>
              <View style={styles.chipContainer}>
                {typeOptions.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.chip,
                      tempFilters.type === type.key && styles.chipActive,
                    ]}
                    onPress={() => setTempFilters(prev => ({
                      ...prev,
                      type: prev.type === type.key ? undefined : type.key,
                    }))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        tempFilters.type === type.key && styles.chipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Range */}
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerType('start');
                    setShowDatePicker(true);
                  }}
                >
                  <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                  <Text style={[
                    styles.dateText,
                    !tempFilters.startDate && styles.datePlaceholder,
                  ]}>
                    {tempFilters.startDate 
                      ? formatDate(tempFilters.startDate)
                      : 'Start Date'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.dateSeparator}>to</Text>
                
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setDatePickerType('end');
                    setShowDatePicker(true);
                  }}
                >
                  <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
                  <Text style={[
                    styles.dateText,
                    !tempFilters.endDate && styles.datePlaceholder,
                  ]}>
                    {tempFilters.endDate 
                      ? formatDate(tempFilters.endDate)
                      : 'End Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Search */}
              <Text style={styles.filterSectionTitle}>Search</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by user, content, or hashtags..."
                value={tempFilters.search || ''}
                onChangeText={(text) => setTempFilters(prev => ({ ...prev, search: text }))}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={
            datePickerType === 'start' && tempFilters.startDate
              ? new Date(tempFilters.startDate)
              : datePickerType === 'end' && tempFilters.endDate
              ? new Date(tempFilters.endDate)
              : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.divider,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  activeFilters: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight + '15',
    gap: 4,
  },
  activeFilterText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalBody: {
    padding: 16,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  datePlaceholder: {
    color: theme.colors.textSecondary,
  },
  dateSeparator: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
});

export default FilterBar;