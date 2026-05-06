// // app/(app)/business/[id]/competitors/add.js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useCompetitors } from '../../../../../../hooks/businessHooks/useCompetitors';
// import FormInput from '../../../../../../components/business/ui/FormInput';
// import FormSelect from '../../../../../../components/business/ui/FormSelect';
// import TagInput from '../../../../../../components/business/ui/TagInput';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import { INDUSTRIES } from '../../../../../../utils/constants';
// import { validateUrl } from '../../../../../../utils/validators';

// const SOCIAL_PLATFORMS = [
//   { label: 'Facebook', value: 'facebook' },
//   { label: 'Instagram', value: 'instagram' },
//   { label: 'Twitter', value: 'twitter' },
//   { label: 'LinkedIn', value: 'linkedin' },
//   { label: 'TikTok', value: 'tiktok' },
//   { label: 'YouTube', value: 'youtube' },
//   { label: 'Pinterest', value: 'pinterest' },
// ];

// export default function AddCompetitorScreen() {
//   const { id } = useLocalSearchParams();
//   const { addCompetitor } = useCompetitors(id);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     website: '',
//     description: '',
//     industry: '',
//     socialAccounts: [],
//     notes: '',
//     analysis: {
//       strengths: [],
//       weaknesses: [],
//       opportunities: [],
//       threats: [],
//       marketShare: 0,
//       shareOfVoice: 0,
//       uniqueSellingPoints: [],
//       targetAudience: [],
//       pricing: '',
//       positioning: '',
//     },
//   });
//   const [currentSocialPlatform, setCurrentSocialPlatform] = useState('');
//   const [currentSocialUsername, setCurrentSocialUsername] = useState('');
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Competitor name is required';
//     }
//     if (formData.website && !validateUrl(formData.website)) {
//       newErrors.website = 'Please enter a valid URL';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await addCompetitor({ competitor: formData });
//       Alert.alert('Success', 'Competitor added successfully!', [
//         { text: 'OK', onPress: () => router.back() }
//       ]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to add competitor');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addSocialAccount = () => {
//     if (currentSocialPlatform && currentSocialUsername) {
//       setFormData(prev => ({
//         ...prev,
//         socialAccounts: [
//           ...prev.socialAccounts,
//           {
//             platform: currentSocialPlatform,
//             username: currentSocialUsername,
//           }
//         ]
//       }));
//       setCurrentSocialPlatform('');
//       setCurrentSocialUsername('');
//     }
//   };

//   const removeSocialAccount = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       socialAccounts: prev.socialAccounts.filter((_, i) => i !== index)
//     }));
//   };

//   const updateAnalysis = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       analysis: { ...prev.analysis, [field]: value }
//     }));
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.content}>
//           {/* Basic Information */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Basic Information</Text>
            
//             <FormInput
//               label="Competitor Name *"
//               value={formData.name}
//               onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
//               placeholder="Enter competitor name"
//               error={errors.name}
//             />

//             <FormInput
//               label="Website"
//               value={formData.website}
//               onChangeText={(value) => setFormData(prev => ({ ...prev, website: value }))}
//               placeholder="https://competitor.com"
//               keyboardType="url"
//               autoCapitalize="none"
//               error={errors.website}
//             />

//             <FormSelect
//               label="Industry"
//               value={formData.industry}
//               onSelect={(value) => setFormData(prev => ({ ...prev, industry: value }))}
//               options={INDUSTRIES}
//               placeholder="Select industry"
//             />

//             <FormInput
//               label="Description"
//               value={formData.description}
//               onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
//               placeholder="Describe this competitor..."
//               multiline
//               numberOfLines={3}
//               maxLength={500}
//             />
//           </View>

//           {/* Social Media Accounts */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Social Media Accounts</Text>
            
//             <View style={styles.socialInputRow}>
//               <View style={styles.platformSelect}>
//                 <FormSelect
//                   label=""
//                   value={currentSocialPlatform}
//                   onSelect={setCurrentSocialPlatform}
//                   options={SOCIAL_PLATFORMS}
//                   placeholder="Platform"
//                 />
//               </View>
//               <View style={styles.usernameInput}>
//                 <FormInput
//                   label=""
//                   value={currentSocialUsername}
//                   onChangeText={setCurrentSocialUsername}
//                   placeholder="Username"
//                 />
//               </View>
//               <TouchableOpacity 
//                 style={styles.addSocialButton}
//                 onPress={addSocialAccount}
//               >
//                 <Text style={styles.addSocialButtonText}>Add</Text>
//               </TouchableOpacity>
//             </View>

//             {formData.socialAccounts.map((account, index) => (
//               <View key={index} style={styles.socialAccountItem}>
//                 <View style={styles.socialAccountInfo}>
//                   <Text style={styles.socialPlatform}>{account.platform}</Text>
//                   <Text style={styles.socialUsername}>@{account.username}</Text>
//                 </View>
//                 <TouchableOpacity onPress={() => removeSocialAccount(index)}>
//                   <Text style={styles.removeText}>Remove</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           {/* SWOT Analysis */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>SWOT Analysis</Text>
            
//             <Text style={styles.subsectionTitle}>Strengths</Text>
//             <TagInput
//               tags={formData.analysis.strengths}
//               onTagsChange={(strengths) => updateAnalysis('strengths', strengths)}
//               placeholder="Add a strength"
//             />

//             <Text style={styles.subsectionTitle}>Weaknesses</Text>
//             <TagInput
//               tags={formData.analysis.weaknesses}
//               onTagsChange={(weaknesses) => updateAnalysis('weaknesses', weaknesses)}
//               placeholder="Add a weakness"
//               tagStyle="banned"
//             />

//             <Text style={styles.subsectionTitle}>Opportunities</Text>
//             <TagInput
//               tags={formData.analysis.opportunities}
//               onTagsChange={(opportunities) => updateAnalysis('opportunities', opportunities)}
//               placeholder="Add an opportunity"
//               tagStyle="preferred"
//             />

//             <Text style={styles.subsectionTitle}>Threats</Text>
//             <TagInput
//               tags={formData.analysis.threats}
//               onTagsChange={(threats) => updateAnalysis('threats', threats)}
//               placeholder="Add a threat"
//               tagStyle="banned"
//             />
//           </View>

//           {/* Market Analysis */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Market Analysis</Text>
            
//             <FormInput
//               label="Market Share (%)"
//               value={formData.analysis.marketShare?.toString()}
//               onChangeText={(value) => updateAnalysis('marketShare', parseFloat(value) || 0)}
//               placeholder="0"
//               keyboardType="numeric"
//             />

//             <FormInput
//               label="Share of Voice (%)"
//               value={formData.analysis.shareOfVoice?.toString()}
//               onChangeText={(value) => updateAnalysis('shareOfVoice', parseFloat(value) || 0)}
//               placeholder="0"
//               keyboardType="numeric"
//             />

//             <TagInput
//               tags={formData.analysis.uniqueSellingPoints}
//               onTagsChange={(usps) => updateAnalysis('uniqueSellingPoints', usps)}
//               placeholder="Add a unique selling point"
//             />

//             <TagInput
//               tags={formData.analysis.targetAudience}
//               onTagsChange={(audience) => updateAnalysis('targetAudience', audience)}
//               placeholder="Add target audience segment"
//             />

//             <FormInput
//               label="Pricing Strategy"
//               value={formData.analysis.pricing}
//               onChangeText={(value) => updateAnalysis('pricing', value)}
//               placeholder="e.g., Premium, Freemium, Value-based"
//             />

//             <FormInput
//               label="Market Positioning"
//               value={formData.analysis.positioning}
//               onChangeText={(value) => updateAnalysis('positioning', value)}
//               placeholder="Describe their market position"
//               multiline
//               numberOfLines={2}
//             />
//           </View>

//           {/* Notes */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Additional Notes</Text>
            
//             <FormInput
//               label=""
//               value={formData.notes}
//               onChangeText={(value) => setFormData(prev => ({ ...prev, notes: value }))}
//               placeholder="Any additional notes about this competitor..."
//               multiline
//               numberOfLines={4}
//             />
//           </View>

//           {/* Actions */}
//           <View style={styles.actions}>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => router.back()}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <LoadingSpinner size="small" color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Add Competitor</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
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
//     marginBottom: 15,
//   },
//   subsectionTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#666',
//     marginTop: 10,
//     marginBottom: 8,
//   },
//   socialInputRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 10,
//   },
//   platformSelect: {
//     flex: 2,
//     marginRight: 8,
//   },
//   usernameInput: {
//     flex: 3,
//     marginRight: 8,
//   },
//   addSocialButton: {
//     backgroundColor: '#1976d2',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     justifyContent: 'center',
//   },
//   addSocialButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   socialAccountItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   socialAccountInfo: {
//     flex: 1,
//   },
//   socialPlatform: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//   },
//   socialUsername: {
//     fontSize: 13,
//     color: '#666',
//     marginTop: 2,
//   },
//   removeText: {
//     color: '#d32f2f',
//     fontWeight: '500',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 30,
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
//   submitButton: {
//     flex: 1,
//     backgroundColor: '#1976d2',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });



















// app/(app)/business/[id]/competitors/add.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCompetitors } from '../../../../../../hooks/businessHooks/useCompetitors';
import FormInput from '../../../../../../components/business/ui/FormInput';
import FormSelect from '../../../../../../components/business/ui/FormSelect';
import TagInput from '../../../../../../components/business/ui/TagInput';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import Header from '../../../../../../components/common/Header';
import { INDUSTRIES } from '../../../../../../utils/constants';
import { validateUrl } from '../../../../../../utils/validators';

const SOCIAL_PLATFORMS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Pinterest', value: 'pinterest' },
];

export default function AddCompetitorScreen() {
  const { id } = useLocalSearchParams();
  const { addCompetitor } = useCompetitors(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    industry: '',
    socialAccounts: [],
    notes: '',
    analysis: {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      marketShare: 0,
      shareOfVoice: 0,
      uniqueSellingPoints: [],
      targetAudience: [],
      pricing: '',
      positioning: '',
    },
  });
  const [currentSocialPlatform, setCurrentSocialPlatform] = useState('');
  const [currentSocialUsername, setCurrentSocialUsername] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Competitor name is required';
    }
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await addCompetitor({ competitor: formData });
      Alert.alert('Success', 'Competitor added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add competitor');
    } finally {
      setLoading(false);
    }
  };

  const addSocialAccount = () => {
    if (currentSocialPlatform && currentSocialUsername) {
      setFormData(prev => ({
        ...prev,
        socialAccounts: [
          ...prev.socialAccounts,
          {
            platform: currentSocialPlatform,
            username: currentSocialUsername,
          }
        ]
      }));
      setCurrentSocialPlatform('');
      setCurrentSocialUsername('');
    }
  };

  const removeSocialAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: prev.socialAccounts.filter((_, i) => i !== index)
    }));
  };

  const updateAnalysis = (field, value) => {
    setFormData(prev => ({
      ...prev,
      analysis: { ...prev.analysis, [field]: value }
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header
        title="Add Competitor"
        showBack={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <FormInput
              label="Competitor Name *"
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="Enter competitor name"
              error={errors.name}
            />

            <FormInput
              label="Website"
              value={formData.website}
              onChangeText={(value) => setFormData(prev => ({ ...prev, website: value }))}
              placeholder="https://competitor.com"
              keyboardType="url"
              autoCapitalize="none"
              error={errors.website}
            />

            <FormSelect
              label="Industry"
              value={formData.industry}
              onSelect={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              options={INDUSTRIES}
              placeholder="Select industry"
            />

            <FormInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Describe this competitor..."
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Social Media Accounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media Accounts</Text>
            
            <View style={styles.socialInputRow}>
              <View style={styles.platformSelect}>
                <FormSelect
                  label=""
                  value={currentSocialPlatform}
                  onSelect={setCurrentSocialPlatform}
                  options={SOCIAL_PLATFORMS}
                  placeholder="Platform"
                />
              </View>
              <View style={styles.usernameInput}>
                <FormInput
                  label=""
                  value={currentSocialUsername}
                  onChangeText={setCurrentSocialUsername}
                  placeholder="Username"
                />
              </View>
              <TouchableOpacity 
                style={styles.addSocialButton}
                onPress={addSocialAccount}
              >
                <Text style={styles.addSocialButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {formData.socialAccounts.map((account, index) => (
              <View key={index} style={styles.socialAccountItem}>
                <View style={styles.socialAccountInfo}>
                  <Text style={styles.socialPlatform}>{account.platform}</Text>
                  <Text style={styles.socialUsername}>@{account.username}</Text>
                </View>
                <TouchableOpacity onPress={() => removeSocialAccount(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* SWOT Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SWOT Analysis</Text>
            
            <Text style={styles.subsectionTitle}>Strengths</Text>
            <TagInput
              tags={formData.analysis.strengths}
              onTagsChange={(strengths) => updateAnalysis('strengths', strengths)}
              placeholder="Add a strength"
            />

            <Text style={styles.subsectionTitle}>Weaknesses</Text>
            <TagInput
              tags={formData.analysis.weaknesses}
              onTagsChange={(weaknesses) => updateAnalysis('weaknesses', weaknesses)}
              placeholder="Add a weakness"
              tagStyle="banned"
            />

            <Text style={styles.subsectionTitle}>Opportunities</Text>
            <TagInput
              tags={formData.analysis.opportunities}
              onTagsChange={(opportunities) => updateAnalysis('opportunities', opportunities)}
              placeholder="Add an opportunity"
              tagStyle="preferred"
            />

            <Text style={styles.subsectionTitle}>Threats</Text>
            <TagInput
              tags={formData.analysis.threats}
              onTagsChange={(threats) => updateAnalysis('threats', threats)}
              placeholder="Add a threat"
              tagStyle="banned"
            />
          </View>

          {/* Market Analysis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            
            <FormInput
              label="Market Share (%)"
              value={formData.analysis.marketShare?.toString()}
              onChangeText={(value) => updateAnalysis('marketShare', parseFloat(value) || 0)}
              placeholder="0"
              keyboardType="numeric"
            />

            <FormInput
              label="Share of Voice (%)"
              value={formData.analysis.shareOfVoice?.toString()}
              onChangeText={(value) => updateAnalysis('shareOfVoice', parseFloat(value) || 0)}
              placeholder="0"
              keyboardType="numeric"
            />

            <TagInput
              tags={formData.analysis.uniqueSellingPoints}
              onTagsChange={(usps) => updateAnalysis('uniqueSellingPoints', usps)}
              placeholder="Add a unique selling point"
            />

            <TagInput
              tags={formData.analysis.targetAudience}
              onTagsChange={(audience) => updateAnalysis('targetAudience', audience)}
              placeholder="Add target audience segment"
            />

            <FormInput
              label="Pricing Strategy"
              value={formData.analysis.pricing}
              onChangeText={(value) => updateAnalysis('pricing', value)}
              placeholder="e.g., Premium, Freemium, Value-based"
            />

            <FormInput
              label="Market Positioning"
              value={formData.analysis.positioning}
              onChangeText={(value) => updateAnalysis('positioning', value)}
              placeholder="Describe their market position"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            
            <FormInput
              label=""
              value={formData.notes}
              onChangeText={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              placeholder="Any additional notes about this competitor..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Add Competitor</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 10,
    marginBottom: 8,
  },
  socialInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  platformSelect: {
    flex: 2,
    marginRight: 8,
  },
  usernameInput: {
    flex: 3,
    marginRight: 8,
  },
  addSocialButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addSocialButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  socialAccountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  socialAccountInfo: {
    flex: 1,
  },
  socialPlatform: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  socialUsername: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  removeText: {
    color: '#d32f2f',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
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
  submitButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});