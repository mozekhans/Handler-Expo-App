import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../../components/common/Header';
import socialService from '../../../../../../services/socialService';
import { theme } from '../../../../../../styles/theme';

export default function AccountSettingsScreen() {
  const { accountId, businessId } = useLocalSearchParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      const response = await socialService.getAccount(businessId, accountId);
      setAccount(response.account);
      setSettings(response.account.settings || {});
    } catch (err) {
      Alert.alert('Error', 'Failed to load account settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await socialService.updateAccount(businessId, accountId, settings);
      Alert.alert('Success', 'Settings updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedSetting = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Settings" showBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Auto Post */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automation</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="paper-plane" size={22} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Post</Text>
                <Text style={styles.settingDescription}>
                  Automatically publish scheduled posts
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoPost ?? true}
              onValueChange={(value) => updateSetting('autoPost', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={settings.autoPost ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubbles" size={22} color={theme.colors.secondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Engage</Text>
                <Text style={styles.settingDescription}>
                  Automatically like and follow relevant accounts
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoEngage ?? false}
              onValueChange={(value) => updateSetting('autoEngage', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.secondary + '80' }}
              thumbColor={settings.autoEngage ? theme.colors.secondary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbox" size={22} color={theme.colors.success} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Respond</Text>
                <Text style={styles.settingDescription}>
                  Automatically respond to comments
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoRespond ?? false}
              onValueChange={(value) => updateSetting('autoRespond', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.success + '80' }}
              thumbColor={settings.autoRespond ? theme.colors.success : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Caption Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caption Rules</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Max Length</Text>
            <TextInput
              style={styles.input}
              value={String(settings.captionRules?.maxLength || '')}
              onChangeText={(value) => updateNestedSetting('captionRules', 'maxLength', parseInt(value) || undefined)}
              placeholder="Maximum caption length"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Include Hashtags</Text>
              <Text style={styles.settingDescription}>
                Automatically add relevant hashtags
              </Text>
            </View>
            <Switch
              value={settings.captionRules?.includeHashtags ?? true}
              onValueChange={(value) => updateNestedSetting('captionRules', 'includeHashtags', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={settings.captionRules?.includeHashtags ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Include Mentions</Text>
              <Text style={styles.settingDescription}>
                Automatically mention relevant accounts
              </Text>
            </View>
            <Switch
              value={settings.captionRules?.includeMentions ?? false}
              onValueChange={(value) => updateNestedSetting('captionRules', 'includeMentions', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={settings.captionRules?.includeMentions ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Hashtag Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hashtag Rules</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Max Per Post</Text>
            <TextInput
              style={styles.input}
              value={String(settings.hashtagRules?.maxPerPost || '')}
              onChangeText={(value) => updateNestedSetting('hashtagRules', 'maxPerPost', parseInt(value) || undefined)}
              placeholder="Maximum hashtags per post"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Engagement Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Limits</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Like</Text>
            </View>
            <Switch
              value={settings.engagementRules?.autoLike ?? false}
              onValueChange={(value) => updateNestedSetting('engagementRules', 'autoLike', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
              thumbColor={settings.engagementRules?.autoLike ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Like Limit Per Day</Text>
            <TextInput
              style={styles.input}
              value={String(settings.engagementRules?.likeLimit || '')}
              onChangeText={(value) => updateNestedSetting('engagementRules', 'likeLimit', parseInt(value) || undefined)}
              placeholder="Maximum likes per day"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.savingButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="save" size={20} color="#fff" />
          )}
          <Text style={styles.saveText}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  savingButton: {
    opacity: 0.7,
  },
  saveText: {
    color: '#fff',
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
    marginLeft: theme.spacing.sm,
  },
});