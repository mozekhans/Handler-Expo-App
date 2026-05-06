import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import Button from '../../../../components/common/Button';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import EmptyState from '../../../../components/common/EmptyState';

const REPORT_TYPES = [
  { label: 'Performance Report', value: 'performance', icon: 'stats-chart-outline' },
  { label: 'Campaign Report', value: 'campaign', icon: 'megaphone-outline' },
  { label: 'Audience Report', value: 'audience', icon: 'people-outline' },
  { label: 'Competitor Report', value: 'competitor', icon: 'business-outline' },
  { label: 'Custom Report', value: 'custom', icon: 'settings-outline' },
];

const FORMATS = [
  { label: 'PDF', value: 'pdf', icon: 'document-text-outline' },
  { label: 'Excel', value: 'excel', icon: 'grid-outline' },
  { label: 'CSV', value: 'csv', icon: 'code-outline' },
  { label: 'JSON', value: 'json', icon: 'code-slash-outline' },
];

export default function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'performance',
    format: 'pdf',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    includeInsights: true,
    sections: ['overview', 'engagement', 'content', 'audience'],
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { listReports, exportReport, getReportStatus, loading } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness) {
        loadReports();
      }
    }, [currentBusiness])
  );

  const loadReports = async () => {
    const data = await listReports(currentBusiness?.id);
    if (data) {
      setReports(data.reports || []);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const handleCreateReport = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a report title');
      return;
    }

    setGenerating(true);
    const result = await exportReport(currentBusiness.id, {
      title: formData.title,
      type: formData.type,
      format: formData.format,
      dateRange: {
        start: formData.dateRange.start.toISOString(),
        end: formData.dateRange.end.toISOString(),
      },
      includeInsights: formData.includeInsights,
      sections: formData.sections,
    });

    if (result) {
      Alert.alert(
        'Report Generation Started',
        'Your report is being generated. You will be notified when it\'s ready.',
        [{ text: 'OK', onPress: () => setShowCreateModal(false) }]
      );
      loadReports();
    } else {
      Alert.alert('Error', 'Failed to generate report');
    }
    setGenerating(false);
  };

  const handleDownload = async (report) => {
    if (report.status !== 'completed') {
      Alert.alert('Not Ready', 'Report is still being generated. Please wait.');
      return;
    }

    // Download logic would go here
    Alert.alert('Download Started', `Downloading ${report.title}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'generating': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'generating': return 'Generating...';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleSection = (section) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section],
    }));
  };

  const renderReportItem = ({ item: report }) => (
    <Card style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View>
          <Text style={[styles.reportTitle, { color: colors.text }]}>{report.title}</Text>
          <Text style={[styles.reportDate, { color: colors.textSecondary }]}>
            Generated: {formatDate(report.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
            {getStatusText(report.status)}
          </Text>
        </View>
      </View>

      <View style={styles.reportMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {report.type?.charAt(0).toUpperCase() + report.type?.slice(1)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {formatDate(report.dateRange?.start)} - {formatDate(report.dateRange?.end)}
          </Text>
        </View>
        {report.fileSize && (
          <View style={styles.metaItem}>
            <Ionicons name="hardware-chip-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {(report.fileSize / 1024).toFixed(1)} KB
            </Text>
          </View>
        )}
      </View>

      {report.status === 'completed' && (
        <TouchableOpacity
          style={[styles.downloadButton, { borderColor: colors.primary }]}
          onPress={() => handleDownload(report)}
        >
          <Ionicons name="download-outline" size={18} color={colors.primary} />
          <Text style={[styles.downloadText, { color: colors.primary }]}>Download Report</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Reports"
        showBack={true}
        rightAction={
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      {reports.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No Reports"
          description="Generate custom reports to analyze your social media performance"
          actionLabel="Create Report"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      )}

      {/* Create Report Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create Report</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Report Title</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Enter report title"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />

                <Text style={[styles.inputLabel, { color: colors.text }]}>Report Type</Text>
                <View style={styles.typeContainer}>
                  {REPORT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        formData.type === type.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                        { borderColor: colors.border },
                      ]}
                      onPress={() => setFormData({ ...formData, type: type.value })}
                    >
                      <Ionicons name={type.icon} size={24} color={formData.type === type.value ? colors.primary : colors.textSecondary} />
                      <Text style={[styles.typeText, { color: formData.type === type.value ? colors.primary : colors.text }]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { color: colors.text }]}>Format</Text>
                <View style={styles.formatContainer}>
                  {FORMATS.map((format) => (
                    <TouchableOpacity
                      key={format.value}
                      style={[
                        styles.formatOption,
                        formData.format === format.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                        { borderColor: colors.border },
                      ]}
                      onPress={() => setFormData({ ...formData, format: format.value })}
                    >
                      <Ionicons name={format.icon} size={20} color={formData.format === format.value ? colors.primary : colors.textSecondary} />
                      <Text style={[styles.formatText, { color: formData.format === format.value ? colors.primary : colors.text }]}>
                        {format.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { color: colors.text }]}>Date Range</Text>
                <View style={styles.dateRangeContainer}>
                  <TouchableOpacity
                    style={[styles.dateButton, { borderColor: colors.border }]}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formData.dateRange.start.toLocaleDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={[styles.dateSeparator, { color: colors.text }]}>to</Text>
                  <TouchableOpacity
                    style={[styles.dateButton, { borderColor: colors.border }]}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {formData.dateRange.end.toLocaleDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Include Sections</Text>
                  <View style={styles.sectionOptions}>
                    {['overview', 'engagement', 'content', 'audience', 'campaigns'].map((section) => (
                      <TouchableOpacity
                        key={section}
                        style={[
                          styles.sectionOption,
                          formData.sections.includes(section) && { backgroundColor: colors.primary + '20' },
                        ]}
                        onPress={() => toggleSection(section)}
                      >
                        <Ionicons
                          name={formData.sections.includes(section) ? 'checkbox-outline' : 'square-outline'}
                          size={20}
                          color={formData.sections.includes(section) ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.sectionText, { color: colors.text }]}>
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.insightOption}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Include AI Insights</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      formData.includeInsights && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setFormData({ ...formData, includeInsights: !formData.includeInsights })}
                  >
                    <Text style={[styles.toggleText, { color: formData.includeInsights ? '#fff' : colors.textSecondary }]}>
                      {formData.includeInsights ? 'Enabled' : 'Disabled'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowCreateModal(false)}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                  <Button
                    title="Generate Report"
                    onPress={handleCreateReport}
                    loading={generating}
                    disabled={generating}
                    style={styles.generateButton}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={formData.dateRange.start}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setFormData({
                ...formData,
                dateRange: { ...formData.dateRange, start: selectedDate },
              });
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.dateRange.end}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setFormData({
                ...formData,
                dateRange: { ...formData.dateRange, end: selectedDate },
              });
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  reportCard: {
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  formatText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 14,
  },
  dateSeparator: {
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sectionText: {
    fontSize: 13,
  },
  insightOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  generateButton: {
    flex: 1,
  },
});