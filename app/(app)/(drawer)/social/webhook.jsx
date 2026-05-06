import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';
import { useSocial } from '../../../../hooks/useSocial';
import { useBusiness } from '../../../../hooks/businessHooks/useBusiness';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import Button from '../../../../components/common/Button';

const EVENT_TYPES = [
  { id: 'comments', label: 'New Comments', icon: 'chatbubble-outline', description: 'Trigger when someone comments on your posts' },
  { id: 'messages', label: 'New Messages', icon: 'mail-outline', description: 'Trigger when you receive direct messages' },
  { id: 'mentions', label: 'Mentions', icon: 'at-outline', description: 'Trigger when your account is mentioned' },
  { id: 'likes', label: 'Likes', icon: 'heart-outline', description: 'Trigger when someone likes your content' },
  { id: 'shares', label: 'Shares', icon: 'repeat-outline', description: 'Trigger when your content is shared' },
  { id: 'follows', label: 'New Followers', icon: 'person-add-outline', description: 'Trigger when you gain new followers' },
  { id: 'posts', label: 'New Posts', icon: 'document-text-outline', description: 'Trigger when new content is posted' },
];

export default function WebhookScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    secret: '',
    events: [],
    isActive: true,
  });
  const [webhook, setWebhook] = useState(null);
  
  const { colors } = useTheme();
  const { currentBusiness } = useBusiness();
  const { currentAccount, getAccount, createWebhook, deleteWebhook, testWebhook } = useSocial();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    await getAccount(id);
    
    // Check if webhook exists
    if (currentAccount?.webhooks?.length > 0) {
      const existingWebhook = currentAccount.webhooks[0];
      setWebhook(existingWebhook);
      setFormData({
        url: existingWebhook.url || '',
        secret: existingWebhook.secret || '',
        events: existingWebhook.events || [],
        isActive: existingWebhook.isActive !== false,
      });
    }
    
    setLoading(false);
  };

  const toggleEvent = (eventId) => {
    setFormData(prev => {
      if (prev.events.includes(eventId)) {
        return { ...prev, events: prev.events.filter(e => e !== eventId) };
      } else {
        return { ...prev, events: [...prev.events, eventId] };
      }
    });
  };

  const generateSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    setFormData(prev => ({ ...prev, secret }));
  };

  const validateForm = () => {
    if (!formData.url.trim()) {
      Alert.alert('Error', 'Webhook URL is required');
      return false;
    }
    if (!formData.url.startsWith('https://')) {
      Alert.alert('Error', 'Webhook URL must use HTTPS');
      return false;
    }
    if (formData.events.length === 0) {
      Alert.alert('Error', 'Please select at least one event');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      let result;
      if (webhook) {
        // Update existing webhook
        result = await updateWebhook(currentBusiness.id, id, webhook._id, {
          url: formData.url,
          events: formData.events,
          isActive: formData.isActive,
        });
      } else {
        // Create new webhook
        result = await createWebhook(currentBusiness.id, id, formData.url, formData.events);
      }
      
      if (result) {
        Alert.alert('Success', 'Webhook saved successfully');
        loadData();
      } else {
        Alert.alert('Error', 'Failed to save webhook');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save webhook');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!webhook) return;
    
    Alert.alert(
      'Delete Webhook',
      'Are you sure you want to delete this webhook? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await deleteWebhook(currentBusiness.id, id, webhook._id);
              Alert.alert('Success', 'Webhook deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete webhook');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleTest = async () => {
    if (!webhook) {
      Alert.alert('Error', 'Please save the webhook first');
      return;
    }
    
    setTesting(true);
    try {
      const result = await testWebhook(currentBusiness.id, id, webhook._id);
      if (result) {
        Alert.alert('Success', 'Test webhook sent successfully');
      } else {
        Alert.alert('Error', 'Failed to send test webhook');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to test webhook');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Webhook Configuration" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Account Info */}
        {currentAccount && (
          <Card style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <PlatformIcon platform={currentAccount.platform} size={32} />
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: colors.text }]}>
                  {currentAccount.accountName}
                </Text>
                <Text style={[styles.accountPlatform, { color: colors.textSecondary }]}>
                  {currentAccount.platform}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Webhook URL */}
        <Card style={styles.card}>
          <Text style={[styles.label, { color: colors.text }]}>Webhook URL</Text>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            The endpoint URL where webhook events will be sent
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="https://your-server.com/webhook"
            placeholderTextColor={colors.textSecondary}
            value={formData.url}
            onChangeText={(text) => setFormData({ ...formData, url: text })}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Card>

        {/* Webhook Secret */}
        <Card style={styles.card}>
          <Text style={[styles.label, { color: colors.text }]}>Webhook Secret</Text>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Used to verify webhook authenticity (optional but recommended)
          </Text>
          <View style={styles.secretContainer}>
            <TextInput
              style={[styles.secretInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Generate a secret key"
              placeholderTextColor={colors.textSecondary}
              value={formData.secret}
              onChangeText={(text) => setFormData({ ...formData, secret: text })}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: colors.primary + '10' }]}
              onPress={generateSecret}
            >
              <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Events */}
        <Card style={styles.card}>
          <Text style={[styles.label, { color: colors.text }]}>Events</Text>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Select which events should trigger this webhook
          </Text>
          
          {EVENT_TYPES.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventItem, { borderBottomColor: colors.border }]}
              onPress={() => toggleEvent(event.id)}
            >
              <View style={styles.eventInfo}>
                <View style={[styles.eventIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name={event.icon} size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.eventLabel, { color: colors.text }]}>{event.label}</Text>
                  <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                    {event.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.events.includes(event.id)}
                onValueChange={() => toggleEvent(event.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Status */}
        <Card style={styles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Webhook Status</Text>
              <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                Enable or disable this webhook
              </Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(value) => setFormData({ ...formData, isActive: value })}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Save Webhook"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            icon={<Ionicons name="save-outline" size={20} color="#fff" />}
            style={styles.saveButton}
          />
          
          {webhook && (
            <>
              <Button
                title="Test Webhook"
                onPress={handleTest}
                loading={testing}
                disabled={testing}
                variant="outline"
                icon={<Ionicons name="play-outline" size={20} color={colors.primary} />}
                style={styles.testButton}
              />
              
              <Button
                title="Delete Webhook"
                onPress={handleDelete}
                variant="danger"
                icon={<Ionicons name="trash-outline" size={20} color="#fff" />}
                style={styles.deleteButton}
              />
            </>
          )}
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.info + '10' }]}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Webhooks allow you to receive real-time notifications when events occur on your social media accounts.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  accountCard: {
    padding: 16,
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountDetails: {
    marginLeft: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountPlatform: {
    fontSize: 13,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  secretContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  secretInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  generateButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 11,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    marginBottom: 0,
  },
  testButton: {
    marginBottom: 0,
  },
  deleteButton: {
    marginBottom: 0,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});