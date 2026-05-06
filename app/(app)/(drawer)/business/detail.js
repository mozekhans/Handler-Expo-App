// // frontend/app/(business)/[id].js
// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { useBusiness } from '../../../../hooks/businessHooks/useBusiness';
// import { theme } from '../../../../styles/theme';
// import { INDUSTRIES, getIndustryValue, getIndustryLabel } from '../../../../utils/industriesConstants';

// export default function BusinessDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     industry: '',
//     website: '',
//     description: '',
//   });
//   const { getBusiness, updateBusiness, currentBusiness } = useBusiness();

//   useEffect(() => {
//     loadBusiness();
//   }, [id]);

//   const loadBusiness = async () => {
//     try {
//       setLoading(true);
//       const business = await getBusiness(id);
//       if (business) {
//         setFormData({
//           name: business.name || '',
//           industry: getIndustryLabel(business.industry) || '',
//           website: business.website || '',
//           description: business.description || '',
//         });
//       }
//     } catch (error) {
//       console.error('Load business error:', error);
//       Alert.alert('Error', 'Failed to load business details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!formData.name.trim()) {
//       Alert.alert('Error', 'Business name is required');
//       return;
//     }

//     try {
//       setSaving(true);
//       const updateData = {
//         name: formData.name.trim(),
//         industry: getIndustryValue(formData.industry),
//         website: formData.website.trim(),
//         description: formData.description.trim(),
//       };
      
//       const result = await updateBusiness(id, updateData);
      
//       if (result.success) {
//         Alert.alert('Success', 'Business updated successfully', [
//           { text: 'OK', onPress: () => router.back() }
//         ]);
//       } else {
//         Alert.alert('Error', result.error || 'Failed to update business');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while updating');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Edit Business</Text>
//       </View>

//       <View style={styles.form}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Business Name *</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.name}
//             onChangeText={(text) => setFormData({ ...formData, name: text })}
//             placeholder="Enter business name"
//             placeholderTextColor={theme.colors.textSecondary}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Industry *</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={formData.industry}
//               onValueChange={(value) => setFormData({ ...formData, industry: value })}
//             >
//               <Picker.Item label="Select Industry" value="" />
//               {INDUSTRIES.map((industry) => (
//                 <Picker.Item key={industry.value} label={industry.label} value={industry.label} />
//               ))}
//             </Picker>
//           </View>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Website</Text>
//           <TextInput
//             style={styles.input}
//             value={formData.website}
//             onChangeText={(text) => setFormData({ ...formData, website: text })}
//             placeholder="https://example.com"
//             placeholderTextColor={theme.colors.textSecondary}
//             keyboardType="url"
//             autoCapitalize="none"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             value={formData.description}
//             onChangeText={(text) => setFormData({ ...formData, description: text })}
//             placeholder="Tell us about your business"
//             placeholderTextColor={theme.colors.textSecondary}
//             multiline
//             numberOfLines={4}
//             textAlignVertical="top"
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.saveButton, saving && styles.saveButtonDisabled]}
//           onPress={handleUpdate}
//           disabled={saving}
//         >
//           {saving ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons name="save-outline" size={20} color="#fff" />
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 60,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//   },
//   form: {
//     padding: 20,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: theme.colors.surface,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//     color: theme.colors.text,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   pickerContainer: {
//     backgroundColor: theme.colors.surface,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   saveButton: {
//     backgroundColor: theme.colors.primary,
//     height: 54,
//     borderRadius: 12,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   saveButtonDisabled: {
//     opacity: 0.7,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });










// app/(app)/business/[id]/index.js
import React from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBusiness } from '../../../../hooks/businessHooks/useBusiness';
import { useBusinessStats } from '../../../../hooks/businessHooks/useBusinessStats';
import BusinessHeader from '../../../../components/business/BusinessHeader';
import BusinessStats from '../../../../components/business/BusinessStats';
import QuickActions from '../../../../components/business/QuickActions';
import LoadingSpinner from '../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../components/business/ui/ErrorMessage';
import Header from '../../../../components/common/Header';
import { useBusinessStore } from '../../../../stores/businessStore';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams();
  const { business, aiLearning, loading, error, refetch } = useBusiness(id);
  const { stats, refetch: refetchStats } = useBusinessStats(id);
  const { deleteBusiness } = useBusinessStore();

  const handleEdit = () => {
    router.push(`/business/${id}/edit`);
  };

  const handleDelete = async () => {
    await deleteBusiness(id);
    router.replace('/(business)');
  };

  const handleTeamPress = () => {
    router.push(`/business/${id}/team`);
  };

  const handleBrandVoicePress = () => {
    router.push(`/business/${id}/brand-voice`);
  };

  const handleTargetAudiencePress = () => {
    router.push(`/business/${id}/target-audience`);
  };

  const handleCompetitorsPress = () => {
    router.push(`/business/${id}/competitors`);
  };

  const handleSettingsPress = () => {
    router.push(`/business/${id}/settings`);
  };

  const handleIntegrationsPress = () => {
    router.push(`/business/${id}/integrations`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={business?.name || 'Business'}
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleEdit}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => {
            refetch();
            refetchStats();
          }} />
        }
      >
        <BusinessHeader 
          business={business} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <BusinessStats stats={stats} />
        
        <QuickActions
          onTeamPress={handleTeamPress}
          onBrandVoicePress={handleBrandVoicePress}
          onTargetAudiencePress={handleTargetAudiencePress}
          onCompetitorsPress={handleCompetitorsPress}
          onSettingsPress={handleSettingsPress}
          onIntegrationsPress={handleIntegrationsPress}
        />
        
        {aiLearning && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});