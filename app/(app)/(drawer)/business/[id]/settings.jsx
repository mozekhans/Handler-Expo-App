// // app/(app)/business/[id]/settings.js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Switch,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import BusinessApi from '../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../components/business/ui/ErrorMessage';
// import FormSelect from '../../../../../components/business/ui/FormSelect';
// import TagInput from '../../../../../components/business/ui/TagInput';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// const TIMEZONES = [
//   { label: 'UTC', value: 'UTC' },
//   { label: 'America/New_York', value: 'America/New_York' },
//   { label: 'America/Chicago', value: 'America/Chicago' },
//   { label: 'America/Denver', value: 'America/Denver' },
//   { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
//   { label: 'Europe/London', value: 'Europe/London' },
//   { label: 'Europe/Paris', value: 'Europe/Paris' },
//   { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
//   { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
//   { label: 'Australia/Sydney', value: 'Australia/Sydney' },
// ];

// const LANGUAGES = [
//   { label: 'English', value: 'en' },
//   { label: 'Spanish', value: 'es' },
//   { label: 'French', value: 'fr' },
//   { label: 'German', value: 'de' },
//   { label: 'Portuguese', value: 'pt' },
//   { label: 'Hausa', value: 'ha' },
//   { label: 'Igbo', value: 'ig' },
//   { label: 'Yoruba', value: 'yo' },
// ];

// const CURRENCIES = [
//   { label: 'USD - US Dollar', value: 'USD' },
//   { label: 'EUR - Euro', value: 'EUR' },
//   { label: 'GBP - British Pound', value: 'GBP' },
//   { label: 'NGN - Nigerian Naira', value: 'NGN' },
//   { label: 'CAD - Canadian Dollar', value: 'CAD' },
//   { label: 'AUD - Australian Dollar', value: 'AUD' },
// ];

// const POSTING_FREQUENCIES = [
//   { label: 'Low (1-2 posts/week)', value: 'low' },
//   { label: 'Medium (3-5 posts/week)', value: 'medium' },
//   { label: 'High (6-10 posts/week)', value: 'high' },
//   { label: 'Custom', value: 'custom' },
// ];

// export default function BusinessSettingsScreen() {
//   const { id } = useLocalSearchParams();
//   const queryClient = useQueryClient();
//   const [localSettings, setLocalSettings] = useState(null);
//   const [hasChanges, setHasChanges] = useState(false);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['settings', id],
//     queryFn: () => BusinessApi.getSettings(id),
//     onSuccess: (data) => {
//       if (!localSettings) {
//         setLocalSettings(data.settings);
//       }
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (settings) => BusinessApi.updateSettings(id, { settings }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['settings', id]);
//       setHasChanges(false);
//       Alert.alert('Success', 'Settings updated successfully');
//     },
//   });

//   const updateSetting = (key, value) => {
//     setLocalSettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//     setHasChanges(true);
//   };

//   const updateNestedSetting = (parent, key, value) => {
//     setLocalSettings(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [key]: value
//       }
//     }));
//     setHasChanges(true);
//   };

//   const handleSave = () => {
//     updateMutation.mutate(localSettings);
//   };

//   const handleCancel = () => {
//     setLocalSettings(data?.settings);
//     setHasChanges(false);
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error.message} />;
//   }

//   const settings = localSettings || data?.settings || {};

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         <View style={styles.content}>
//           {/* General Settings */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>General Settings</Text>
            
//             <FormSelect
//               label="Timezone"
//               value={settings.timezone}
//               onSelect={(value) => updateSetting('timezone', value)}
//               options={TIMEZONES}
//             />

//             <FormSelect
//               label="Language"
//               value={settings.language}
//               onSelect={(value) => updateSetting('language', value)}
//               options={LANGUAGES}
//             />

//             <FormSelect
//               label="Currency"
//               value={settings.currency}
//               onSelect={(value) => updateSetting('currency', value)}
//               options={CURRENCIES}
//             />
//           </View>

//           {/* Posting Settings */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Posting Settings</Text>
            
//             <FormSelect
//               label="Posting Frequency"
//               value={settings.postingFrequency}
//               onSelect={(value) => updateSetting('postingFrequency', value)}
//               options={POSTING_FREQUENCIES}
//             />

//             <View style={styles.switchRow}>
//               <View style={styles.switchInfo}>
//                 <Text style={styles.switchLabel}>Auto-approve Content</Text>
//                 <Text style={styles.switchDescription}>
//                   Automatically approve AI-generated content without review
//                 </Text>
//               </View>
//               <Switch
//                 value={settings.autoApproveContent || false}
//                 onValueChange={(value) => updateSetting('autoApproveContent', value)}
//                 trackColor={{ false: '#e0e0e0', true: '#1976d2' }}
//               />
//             </View>
//           </View>

//           {/* Default Hashtags */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Default Hashtags</Text>
//             <Text style={styles.sectionDescription}>
//               These hashtags will be suggested for all your posts
//             </Text>
            
//             <TagInput
//               tags={settings.defaultHashtags || []}
//               onTagsChange={(hashtags) => updateSetting('defaultHashtags', hashtags)}
//               placeholder="Add a hashtag"
//             />
//           </View>

//           {/* Excluded Hashtags */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Excluded Hashtags</Text>
//             <Text style={styles.sectionDescription}>
//               These hashtags will never be used in your posts
//             </Text>
            
//             <TagInput
//               tags={settings.excludedHashtags || []}
//               onTagsChange={(hashtags) => updateSetting('excludedHashtags', hashtags)}
//               placeholder="Add a hashtag to exclude"
//               tagStyle="banned"
//             />
//           </View>

//           {/* Content Categories */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Content Categories</Text>
//             <Text style={styles.sectionDescription}>
//               Organize your content with custom categories
//             </Text>
            
//             <TagInput
//               tags={settings.contentCategories || []}
//               onTagsChange={(categories) => updateSetting('contentCategories', categories)}
//               placeholder="Add a category"
//               tagStyle="preferred"
//             />
//           </View>
//         </View>
//       </ScrollView>

//       {hasChanges && (
//         <View style={styles.footer}>
//           <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={styles.saveButton} 
//             onPress={handleSave}
//             disabled={updateMutation.isLoading}
//           >
//             {updateMutation.isLoading ? (
//               <LoadingSpinner size="small" color="#fff" />
//             ) : (
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
//   section: {
//     marginBottom: 25,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 5,
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//   },
//   switchRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   switchInfo: {
//     flex: 1,
//     paddingRight: 20,
//   },
//   switchLabel: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 4,
//   },
//   switchDescription: {
//     fontSize: 13,
//     color: '#999',
//   },
//   footer: {
//     flexDirection: 'row',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     backgroundColor: '#fff',
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: '#1976d2',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });































// app/(app)/business/[id]/settings.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import BusinessApi from '../../../../../services/businessApi';
import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../components/business/ui/ErrorMessage';
import FormSelect from '../../../../../components/business/ui/FormSelect';
import TagInput from '../../../../../components/business/ui/TagInput';
import Header from '../../../../../components/common/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Chicago', value: 'America/Chicago' },
  { label: 'America/Denver', value: 'America/Denver' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Paris', value: 'Europe/Paris' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { label: 'Australia/Sydney', value: 'Australia/Sydney' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Yoruba', value: 'yo' },
];

const CURRENCIES = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'NGN - Nigerian Naira', value: 'NGN' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
  { label: 'AUD - Australian Dollar', value: 'AUD' },
];

const POSTING_FREQUENCIES = [
  { label: 'Low (1-2 posts/week)', value: 'low' },
  { label: 'Medium (3-5 posts/week)', value: 'medium' },
  { label: 'High (6-10 posts/week)', value: 'high' },
  { label: 'Custom', value: 'custom' },
];

export default function BusinessSettingsScreen() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['settings', id],
    queryFn: () => BusinessApi.getSettings(id),
    onSuccess: (data) => {
      if (!localSettings) {
        setLocalSettings(data.settings);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (settings) => BusinessApi.updateSettings(id, { settings }),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings', id]);
      setHasChanges(false);
      Alert.alert('Success', 'Settings updated successfully');
    },
  });

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (parent, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings(data?.settings);
    setHasChanges(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const settings = localSettings || data?.settings || {};

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        showBack={true}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            
            <FormSelect
              label="Timezone"
              value={settings.timezone}
              onSelect={(value) => updateSetting('timezone', value)}
              options={TIMEZONES}
            />

            <FormSelect
              label="Language"
              value={settings.language}
              onSelect={(value) => updateSetting('language', value)}
              options={LANGUAGES}
            />

            <FormSelect
              label="Currency"
              value={settings.currency}
              onSelect={(value) => updateSetting('currency', value)}
              options={CURRENCIES}
            />
          </View>

          {/* Posting Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posting Settings</Text>
            
            <FormSelect
              label="Posting Frequency"
              value={settings.postingFrequency}
              onSelect={(value) => updateSetting('postingFrequency', value)}
              options={POSTING_FREQUENCIES}
            />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Auto-approve Content</Text>
                <Text style={styles.switchDescription}>
                  Automatically approve AI-generated content without review
                </Text>
              </View>
              <Switch
                value={settings.autoApproveContent || false}
                onValueChange={(value) => updateSetting('autoApproveContent', value)}
                trackColor={{ false: '#e0e0e0', true: '#1976d2' }}
              />
            </View>
          </View>

          {/* Default Hashtags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Hashtags</Text>
            <Text style={styles.sectionDescription}>
              These hashtags will be suggested for all your posts
            </Text>
            
            <TagInput
              tags={settings.defaultHashtags || []}
              onTagsChange={(hashtags) => updateSetting('defaultHashtags', hashtags)}
              placeholder="Add a hashtag"
            />
          </View>

          {/* Excluded Hashtags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Excluded Hashtags</Text>
            <Text style={styles.sectionDescription}>
              These hashtags will never be used in your posts
            </Text>
            
            <TagInput
              tags={settings.excludedHashtags || []}
              onTagsChange={(hashtags) => updateSetting('excludedHashtags', hashtags)}
              placeholder="Add a hashtag to exclude"
              tagStyle="banned"
            />
          </View>

          {/* Content Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content Categories</Text>
            <Text style={styles.sectionDescription}>
              Organize your content with custom categories
            </Text>
            
            <TagInput
              tags={settings.contentCategories || []}
              onTagsChange={(categories) => updateSetting('contentCategories', categories)}
              placeholder="Add a category"
              tagStyle="preferred"
            />
          </View>
        </View>
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? (
              <LoadingSpinner size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchInfo: {
    flex: 1,
    paddingRight: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});