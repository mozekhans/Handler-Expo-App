// src/components/business/QuickActions.jsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickActions = ({
  onTeamPress,
  onBrandVoicePress,
  onTargetAudiencePress,
  onCompetitorsPress,
  onSettingsPress,
  onIntegrationsPress,
}) => {
  const actions = [
    {
      label: 'Team',
      icon: 'people-outline',
      color: '#1976d2',
      onPress: onTeamPress,
    },
    {
      label: 'Brand Voice',
      icon: 'mic-outline',
      color: '#9c27b0',
      onPress: onBrandVoicePress,
    },
    {
      label: 'Target Audience',
      icon: 'compass-outline',
      color: '#f57c00',
      onPress: onTargetAudiencePress,
    },
    {
      label: 'Competitors',
      icon: 'pulse-outline',
      color: '#d32f2f',
      onPress: onCompetitorsPress,
    },
    {
      label: 'Integrations',
      icon: 'apps-outline',
      color: '#2e7d32',
      onPress: onIntegrationsPress,
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      color: '#757575',
      onPress: onSettingsPress,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={action.onPress}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actionsContainer: {
    paddingHorizontal: 15,
  },
  actionItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
});

export default QuickActions;