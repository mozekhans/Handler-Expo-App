import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCampaigns } from '../../../../../hooks/useCampaigns';
import { theme } from '../../../../../styles/theme';
import { formatDate, formatCompactNumber } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Card from '../../../../../components/common/Card';
import Button from '../../../../../components/common/Button';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import ProgressBar from '../../../../../components/common/ProgressBar';
import ConfirmationDialog from '../../../../../components/common/ConfirmationDialog';

export default function CampaignDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const { getCampaign, deleteCampaign, startCampaign, pauseCampaign, completeCampaign } = useCampaigns();

  useEffect(() => {
    loadCampaign();
  }, []);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const data = await getCampaign(id);
      setCampaign(data);
    } catch (err) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteDialogVisible(false);
    try {
      await deleteCampaign(id);
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete campaign');
    }
  };

  const handleStart = async () => {
    try {
      await startCampaign(id);
      loadCampaign();
    } catch (err) {
      Alert.alert('Error', 'Failed to start campaign');
    }
  };

  const handlePause = async () => {
    try {
      await pauseCampaign(id);
      loadCampaign();
    } catch (err) {
      Alert.alert('Error', 'Failed to pause campaign');
    }
  };

  const handleComplete = async () => {
    try {
      await completeCampaign(id);
      loadCampaign();
    } catch (err) {
      Alert.alert('Error', 'Failed to complete campaign');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out our campaign: ${campaign.name}\n\n${campaign.description}`,
        title: campaign.name,
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'paused': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'draft': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const calculateProgress = () => {
    if (!campaign) return 0;
    const start = new Date(campaign.startDate).getTime();
    const end = new Date(campaign.endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return ((now - start) / (end - start)) * 100;
  };

  const progress = calculateProgress();

  if (loading) {
    return <LoadingIndicator fullScreen text="Loading campaign..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadCampaign}
        icon="alert-circle-outline"
      />
    );
  }

  if (!campaign) {
    return (
      <ErrorMessage
        fullScreen
        message="Campaign not found"
        icon="information-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Campaign Details"
        showBack={true}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/campaigns/edit/${campaign.id}`)}
              style={styles.headerButton}
            >
              <Ionicons name="create-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteDialogVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
              {campaign.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{campaign.name}</Text>
        <Text style={styles.description}>{campaign.description}</Text>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <ProgressBar progress={progress} height={8} />
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricValue}>{formatCompactNumber(campaign.metrics?.reach || 0)}</Text>
              <Text style={styles.metricLabel}>Total Reach</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricValue}>{formatCompactNumber(campaign.metrics?.engagement || 0)}</Text>
              <Text style={styles.metricLabel}>Engagement</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricValue}>{campaign.metrics?.conversions || 0}</Text>
              <Text style={styles.metricLabel}>Conversions</Text>
            </Card>
            <Card style={styles.metricCard}>
              <Text style={styles.metricValue}>{campaign.metrics?.roi || 0}%</Text>
              <Text style={styles.metricLabel}>ROI</Text>
            </Card>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Campaign Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatDate(campaign.startDate, 'MMM d, yyyy')} - {formatDate(campaign.endDate, 'MMM d, yyyy')}
            </Text>
          </View>
          {campaign.budget && (
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>
                Budget: ${formatCompactNumber(campaign.budget.total)} | Spent: ${formatCompactNumber(campaign.budget.spent)}
              </Text>
            </View>
          )}
          {campaign.objective && (
            <View style={styles.detailRow}>
              <Ionicons name="flag-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>Objective: {campaign.objective}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          {campaign.status === 'draft' && (
            <Button
              title="Start Campaign"
              onPress={handleStart}
              style={styles.actionButton}
            />
          )}
          {campaign.status === 'active' && (
            <View style={styles.actionRow}>
              <Button
                title="Pause"
                onPress={handlePause}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Complete"
                onPress={handleComplete}
                style={styles.actionButton}
              />
            </View>
          )}
          {campaign.status === 'paused' && (
            <Button
              title="Resume Campaign"
              onPress={handleStart}
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  statusContainer: {
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  metricsSection: {
    marginBottom: theme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  detailsSection: {
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  actionsSection: {
    marginBottom: theme.spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});