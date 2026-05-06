import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../hooks/useTheme';
import { useSocial } from '../../../../hooks/useSocial';
import { useBusiness } from '../../../../hooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import PlatformIcon from '../../../../components/social/PlatformIcon';
import Button from '../../../../components/common/Button';

const { width: screenWidth } = Dimensions.get('window');

export default function SocialAccountDetailScreen() {
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [autoPostEnabled, setAutoPostEnabled] = useState(false);
  const [autoRespondEnabled, setAutoRespondEnabled] = useState(false);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { 
    currentAccount, 
    loading, 
    getAccount, 
    updateAccount,
    syncAccount,
    getAccountInsights,
    getAccountMetrics,
    disconnectAccount
  } = useSocial();

  useFocusEffect(
    useCallback(() => {
      if (currentBusiness && id) {
        loadAccount();
      }
    }, [currentBusiness, id])
  );

  const loadAccount = async () => {
    await getAccount(id);
    if (currentAccount) {
      setAutoPostEnabled(currentAccount.settings?.autoPost || false);
      setAutoRespondEnabled(currentAccount.settings?.autoRespond || false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadAccount(), syncAccount(id)]);
    setRefreshing(false);
  };

  const handleSync = async () => {
    const metrics = await syncAccount(id);
    if (metrics) {
      Alert.alert('Success', 'Account synced successfully');
    }
  };

  const handleUpdateSettings = async () => {
    const result = await updateAccount(id, {
      settings: {
        autoPost: autoPostEnabled,
        autoRespond: autoRespondEnabled,
      },
    });
    if (result) {
      Alert.alert('Success', 'Settings updated successfully');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Account',
      `Are you sure you want to disconnect ${currentAccount?.accountName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            const success = await disconnectAccount(id);
            if (success) {
              router.back();
            }
          },
        },
      ]
    );
  };

  const getEngagementData = () => {
    const insights = currentAccount?.insights || {};
    const labels = Object.keys(insights).slice(-7);
    const data = Object.values(insights).slice(-7);
    return {
      labels: labels.map(l => l.substring(5)),
      datasets: [{ data }],
    };
  };

  if (loading && !currentAccount) {
    return <LoadingIndicator fullScreen />;
  }

  if (!currentAccount) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Account Details" showBack={true} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>Account not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Account Details" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Account Header */}
        <View style={styles.accountHeader}>
          <PlatformIcon platform={currentAccount.platform} size={60} />
          <Text style={[styles.accountName, { color: colors.text }]}>
            {currentAccount.accountName}
          </Text>
          <Text style={[styles.accountUsername, { color: colors.textSecondary }]}>
            @{currentAccount.accountUsername || currentAccount.accountName}
          </Text>
          <View style={styles.headerStats}>
            <View style={styles.headerStat}>
              <Text style={[styles.headerStatValue, { color: colors.text }]}>
                {currentAccount.metrics?.followers?.toLocaleString() || 0}
              </Text>
              <Text style={[styles.headerStatLabel, { color: colors.textSecondary }]}>
                Followers
              </Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStat}>
              <Text style={[styles.headerStatValue, { color: colors.text }]}>
                {currentAccount.metrics?.following?.toLocaleString() || 0}
              </Text>
              <Text style={[styles.headerStatLabel, { color: colors.textSecondary }]}>
                Following
              </Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStat}>
              <Text style={[styles.headerStatValue, { color: colors.text }]}>
                {currentAccount.metrics?.posts?.toLocaleString() || 0}
              </Text>
              <Text style={[styles.headerStatLabel, { color: colors.textSecondary }]}>
                Posts
              </Text>
            </View>
          </View>
        </View>

        {/* Engagement Rate */}
        <Card style={styles.engagementCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Engagement Rate</Text>
          <Text style={[styles.engagementRate, { color: colors.primary }]}>
            {(currentAccount.metrics?.engagementRate || 0).toFixed(2)}%
          </Text>
          <View style={styles.engagementBar}>
            <View
              style={[
                styles.engagementBarFill,
                { width: `${Math.min(100, currentAccount.metrics?.engagementRate || 0)}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.engagementNote, { color: colors.textSecondary }]}>
            Industry average: 3.5%
          </Text>
        </Card>

        {/* Engagement Chart */}
        {currentAccount.insights && Object.keys(currentAccount.insights).length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>7-Day Engagement Trend</Text>
            <LineChart
              data={getEngagementData()}
              width={screenWidth - 48}
              height={200}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        )}

        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Account Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="calendar-outline" size={22} color={colors.primary} />
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Post</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Automatically publish scheduled content
                </Text>
              </View>
            </View>
            <Switch
              value={autoPostEnabled}
              onValueChange={setAutoPostEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubbles-outline" size={22} color={colors.primary} />
              <View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Respond</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Automatically respond to comments and messages
                </Text>
              </View>
            </View>
            <Switch
              value={autoRespondEnabled}
              onValueChange={setAutoRespondEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <Button
            title="Save Settings"
            onPress={handleUpdateSettings}
            style={styles.saveSettingsButton}
          />
        </Card>

        {/* Recent Posts */}
        {currentAccount.recentPosts?.length > 0 && (
          <View style={styles.recentPostsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Posts</Text>
            {currentAccount.recentPosts.slice(0, 5).map((post, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.postItem, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/(app)/social/post/${post.id}`)}
              >
                <View style={styles.postContent}>
                  <Text style={[styles.postText, { color: colors.text }]} numberOfLines={2}>
                    {post.text || post.caption || 'No caption'}
                  </Text>
                  <Text style={[styles.postDate, { color: colors.textSecondary }]}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.postStats}>
                  <View style={styles.postStat}>
                    <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.postStatValue, { color: colors.textSecondary }]}>
                      {post.likes || 0}
                    </Text>
                  </View>
                  <View style={styles.postStat}>
                    <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.postStatValue, { color: colors.textSecondary }]}>
                      {post.comments || 0}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Sync Now"
            onPress={handleSync}
            variant="outline"
            icon={<Ionicons name="sync-outline" size={20} color={colors.primary} />}
            style={styles.actionButton}
          />
          <Button
            title="Disconnect Account"
            onPress={handleDisconnect}
            variant="danger"
            icon={<Ionicons name="trash-outline" size={20} color="#fff" />}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  accountHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accountName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  accountUsername: {
    fontSize: 14,
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  headerStat: {
    alignItems: 'center',
    flex: 1,
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
  },
  headerStatDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  engagementCard: {
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  engagementRate: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  engagementBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  engagementBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  engagementNote: {
    fontSize: 12,
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  settingsCard: {
    margin: 16,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  saveSettingsButton: {
    marginTop: 16,
  },
  recentPostsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  postItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  postContent: {
    flex: 1,
    marginRight: 12,
  },
  postText: {
    fontSize: 14,
    marginBottom: 4,
  },
  postDate: {
    fontSize: 11,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatValue: {
    fontSize: 12,
  },
  actionsSection: {
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 0,
  },
});