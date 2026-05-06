import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const categories = [
  'Technical Issue',
  'Billing Question',
  'Feature Request',
  'Bug Report',
  'Account Issue',
  'Other',
];

export default function ContactSupportScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'medium',
  });
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!formData.subject || !formData.category || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Ticket Submitted',
        'Your support request has been submitted. We\'ll get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return theme.colors.info;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.secondary;
      case 'urgent': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Contact Support" showBack={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="headset" size={48} color={theme.colors.primary} />
          <Text style={styles.infoTitle}>We're here to help</Text>
          <Text style={styles.infoText}>
            Our support team typically responds within 24 hours
          </Text>
        </View>

        <Input
          label="Subject"
          value={formData.subject}
          onChangeText={(text) => setFormData({ ...formData, subject: text })}
          placeholder="Brief description of your issue"
          required
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {['low', 'medium', 'high', 'urgent'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  formData.priority === priority && styles.priorityButtonActive,
                  { borderColor: getPriorityColor(priority) },
                ]}
                onPress={() => setFormData({ ...formData, priority })}
              >
                <Text
                  style={[
                    styles.priorityText,
                    formData.priority === priority && styles.priorityTextActive,
                    { color: getPriorityColor(priority) },
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Message"
          value={formData.message}
          onChangeText={(text) => setFormData({ ...formData, message: text })}
          placeholder="Describe your issue in detail..."
          multiline
          numberOfLines={6}
          required
        />

        <Button
          title="Submit Ticket"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />

        <View style={styles.alternativeContact}>
          <Text style={styles.alternativeTitle}>Other ways to reach us</Text>
          
          <View style={styles.contactMethod}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
            <View style={styles.contactMethodInfo}>
              <Text style={styles.contactMethodLabel}>Email</Text>
              <Text style={styles.contactMethodValue}>support@socialmediaai.com</Text>
            </View>
          </View>

          <View style={styles.contactMethod}>
            <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.primary} />
            <View style={styles.contactMethodInfo}>
              <Text style={styles.contactMethodLabel}>Live Chat</Text>
              <Text style={styles.contactMethodValue}>Available 24/7 for enterprise users</Text>
            </View>
          </View>

          <View style={styles.contactMethod}>
            <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
            <View style={styles.contactMethodInfo}>
              <Text style={styles.contactMethodLabel}>Phone</Text>
              <Text style={styles.contactMethodValue}>+1 (800) 123-4567</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {loading && <LoadingIndicator overlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityTextActive: {
    fontWeight: '600',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  alternativeContact: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  contactMethodInfo: {
    flex: 1,
  },
  contactMethodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  contactMethodValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});