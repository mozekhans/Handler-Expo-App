import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../hooks/useAuth';
import { useTheme } from '../../../../hooks/useTheme';
import { theme } from '../../../../styles/theme';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import Divider from '../../../../components/common/Divider';
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog';

export default function SettingsScreen() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: true,
    allowTagging: true,
  });
  const [clearCacheDialog, setClearCacheDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const togglePrivacy = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  const handleClearCache = () => {
    setClearCacheDialog(false);
    Alert.alert('Success', 'Cache cleared successfully');
  };

  const handleDeleteAccount = () => {
    setDeleteAccountDialog(false);
    Alert.alert('Account Deleted', 'Your account has been deleted');
  };

  const SettingItem = ({ icon, title, value, onPress, type = 'link' }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={type === 'switch'}
      activeOpacity={type === 'link' ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor="#fff"
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon="person-outline"
            title="Profile Information"
            onPress={() => router.push('/profile')}
          />
          <Divider />
          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            onPress={() => router.push('/settings)/security')}
          />
          <Divider />
          <SettingItem
            icon="language-outline"
            title="Language"
            value="English"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem
            icon="time-outline"
            title="Timezone"
            value="UTC"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            value={notifications.push}
            onPress={() => toggleNotification('push')}
            type="switch"
          />
          <Divider />
          <SettingItem
            icon="mail-outline"
            title="Email Notifications"
            value={notifications.email}
            onPress={() => toggleNotification('email')}
            type="switch"
          />
          <Divider />
          <SettingItem
            icon="chatbubble-outline"
            title="SMS Notifications"
            value={notifications.sms}
            onPress={() => toggleNotification('sms')}
            type="switch"
          />
          <Divider />
          <SettingItem
            icon="megaphone-outline"
            title="Marketing Communications"
            value={notifications.marketing}
            onPress={() => toggleNotification('marketing')}
            type="switch"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            value={isDarkMode}
            onPress={toggleTheme}
            type="switch"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <SettingItem
            icon="globe-outline"
            title="Public Profile"
            value={privacy.profilePublic}
            onPress={() => togglePrivacy('profilePublic')}
            type="switch"
          />
          <Divider />
          <SettingItem
            icon="eye-outline"
            title="Show Activity"
            value={privacy.showActivity}
            onPress={() => togglePrivacy('showActivity')}
            type="switch"
          />
          <Divider />
          <SettingItem
            icon="pricetag-outline"
            title="Allow Tagging"
            value={privacy.allowTagging}
            onPress={() => togglePrivacy('allowTagging')}
            type="switch"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <SettingItem
            icon="folder-outline"
            title="Storage Usage"
            value="245 MB"
            onPress={() => {}}
          />
          <Divider />
          <SettingItem
            icon="refresh-outline"
            title="Clear Cache"
            onPress={() => setClearCacheDialog(true)}
          />
          <Divider />
          <SettingItem
            icon="cloud-upload-outline"
            title="Backup Data"
            onPress={() => {}}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => router.push('/(help)/help-center')}
          />
          <Divider />
          <SettingItem
            icon="chatbubble-ellipses-outline"
            title="FAQ"
            onPress={() => router.push('/(help)/faq')}
          />
          <Divider />
          <SettingItem
            icon="headset-outline"
            title="Contact Support"
            onPress={() => router.push('/(help)/contact-support')}
          />
          <Divider />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            value="Version 1.0.0"
            onPress={() => {}}
          />
        </Card>

        <Card style={[styles.section, styles.dangerSection]}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => setDeleteAccountDialog(true)}
          >
            <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <ConfirmationDialog
        visible={clearCacheDialog}
        onClose={() => setClearCacheDialog(false)}
        onConfirm={handleClearCache}
        title="Clear Cache"
        message="Are you sure you want to clear the app cache? This will free up storage space."
        confirmText="Clear"
        type="warning"
      />

      <ConfirmationDialog
        visible={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
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
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingTitle: {
    fontSize: 16,
    color: theme.colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dangerSection: {
    borderColor: theme.colors.error,
    borderWidth: 1,
    backgroundColor: theme.colors.error + '10',
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  dangerButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
});