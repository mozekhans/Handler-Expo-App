import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const WebhookForm = ({ account, onSubmit, onCancel }) => {
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [events, setEvents] = useState({
    comments: true,
    mentions: true,
    messages: false,
    posts: false,
  });

  const eventOptions = [
    { key: 'comments', label: 'Comments', icon: 'chatbubble' },
    { key: 'mentions', label: 'Mentions', icon: 'at' },
    { key: 'messages', label: 'Messages', icon: 'mail' },
    { key: 'posts', label: 'Posts', icon: 'create' },
  ];

  const toggleEvent = (key) => {
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a webhook URL');
      return;
    }

    const selectedEvents = Object.keys(events).filter((key) => events[key]);
    if (selectedEvents.length === 0) {
      Alert.alert('Error', 'Please select at least one event');
      return;
    }

    onSubmit({
      url: url.trim(),
      events: selectedEvents,
      secret: secret.trim() || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Webhook</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Webhook URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://your-server.com/webhook"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Secret (optional)</Text>
        <TextInput
          style={styles.input}
          value={secret}
          onChangeText={setSecret}
          placeholder="Enter webhook secret for verification"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Events</Text>
        {eventOptions.map((option) => (
          <View key={option.key} style={styles.eventRow}>
            <View style={styles.eventInfo}>
              <Ionicons name={option.icon} size={20} color={theme.colors.text} />
              <Text style={styles.eventLabel}>{option.label}</Text>
            </View>
            <Switch
              value={events[option.key]}
              onValueChange={() => toggleEvent(option.key)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '80',
              }}
              thumbColor={events[option.key] ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.submitText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    marginLeft: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  submitText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default WebhookForm;