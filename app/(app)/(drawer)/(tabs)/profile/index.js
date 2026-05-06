import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../../hooks/useAuth';
import { useBusiness } from '../../../../../hooks/useBusiness';
import { theme } from '../../../../../styles/theme';
import { formatNumber } from '../../../../../utils/formatters';
import Header from '../../../../../components/common/Header';
import Avatar from '../../../../../components/common/Avatar';
import Card from '../../../../../components/common/Card';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import ConfirmationDialog from '../../../../../components/common/ConfirmationDialog';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const { user, logout } = useAuth();
  const { businesses, currentBusiness, switchBusiness } = useBusiness();

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      Alert.alert('Error', 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchBusiness = (business) => {
    Alert.alert(
      'Switch Business',
      `Switch to ${business.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            try {
              await switchBusiness(business.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to switch business');
            }
          },
        },
      ]
    );
  };

  const stats = [
    { label: 'Businesses', value: businesses.length },
    { label: 'Posts', value: user?.stats?.posts || 0 },
    { label: 'Followers', value: formatNumber(user?.stats?.followers || 0) },
    { label: 'Following', value: formatNumber(user?.stats?.following || 0) },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/profile/edit')}>
            <Ionicons name="create-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar
            source={user?.avatar}
            name={`${user?.firstName} ${user?.lastName}`}
            size={80}
          />
          <Text style={styles.userName}>{`${user?.firstName} ${user?.lastName}`}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.userRole}>
            <Ionicons name="business-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Current Business</Text>
          <View style={styles.businessCard}>
            <View style={styles.businessIcon}>
              <Ionicons name="business-outline" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{currentBusiness?.name}</Text>
              <Text style={styles.businessIndustry}>{currentBusiness?.industry}</Text>
            </View>
          </View>
        </Card>

        {businesses.length > 1 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Other Businesses</Text>
            {businesses
              .filter(b => b.id !== currentBusiness?.id)
              .map((business) => (
                <TouchableOpacity
                  key={business.id}
                  style={styles.businessCard}
                  onPress={() => handleSwitchBusiness(business)}
                >
                  <View style={styles.businessIcon}>
                    <Ionicons name="business-outline" size={32} color={theme.colors.textSecondary} />
                  </View>
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessNameSecondary}>{business.name}</Text>
                    <Text style={styles.businessIndustrySecondary}>{business.industry}</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings/billing')}
          >
            <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.menuText}>Billing & Subscription</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/help/help-center')}
          >
            <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutDialogVisible(true)}
        >
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      <ConfirmationDialog
        visible={logoutDialogVisible}
        onClose={() => setLogoutDialogVisible(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        type="danger"
      />

      {loading && <LoadingIndicator overlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  userRole: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  businessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  businessIndustry: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  businessNameSecondary: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  businessIndustrySecondary: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
});