import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../components/common/Header';
import { useBusiness } from "../../../../../hooks/businessHooks/useBusiness";
import { useSocialAccounts } from '../../../../../hooks/useSocial';
import { theme } from '../../../../../styles/theme';

export default function SyncScreen() {
  const { accounts, syncAllAccounts, fetchAccounts } = useSocialAccounts(businessId);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const { currentBusiness } = useBusiness();
  
  const businessId = currentBusiness?._id;

  const handleSyncAll = async () => {
    try {
      setSyncing(true);
      const syncResults = await syncAllAccounts();
      setResults(syncResults);
      Alert.alert(
        'Sync Complete',
        `Successfully synced ${syncResults.filter(r => r.success).length} of ${syncResults.length} accounts`
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to sync accounts');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sync Accounts" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="sync" size={48} color={theme.colors.primary} />
          <Text style={styles.heroTitle}>Sync All Accounts</Text>
          <Text style={styles.heroText}>
            Update metrics and data for all connected social media accounts
          </Text>
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncingButton]}
            onPress={handleSyncAll}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="sync" size={20} color="#fff" />
            )}
            <Text style={styles.syncButtonText}>
              {syncing ? 'Syncing...' : 'Sync All Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Sync Results</Text>
            {results.map((result, index) => (
              <View key={index} style={styles.resultRow}>
                <Ionicons
                  name={result.success ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={result.success ? theme.colors.success : theme.colors.error}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPlatform}>
                    {result.platform}
                  </Text>
                  {result.error && (
                    <Text style={styles.resultError}>{result.error}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  heroText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  syncingButton: {
    opacity: 0.7,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: theme.spacing.sm,
  },
  resultsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.xs,
  },
  resultInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  resultPlatform: {
    fontSize: 14,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  resultError: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 2,
  },
});