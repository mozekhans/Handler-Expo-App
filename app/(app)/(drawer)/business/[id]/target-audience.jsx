// // app/(app)/business/[id]/target-audience.js
// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
// import BusinessApi from '../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
// import FormInput from '../../../../../components/business/ui/FormInput';
// import FormSelect from '../../../../../components/business/ui/FormSelect';
// import FormSlider from '../../../../../components/business/ui/FormSlider';
// import TagInput from '../../../../../components/business/ui/TagInput';
// import MultiSelect from '../../../../../components/business/ui/MultiSelect';
// import { INDUSTRIES } from '../../../../../utils/constants';

// const GENDER_OPTIONS = [
//   { label: 'All', value: 'all' },
//   { label: 'Male', value: 'male' },
//   { label: 'Female', value: 'female' },
//   { label: 'Non-binary', value: 'non_binary' },
// ];

// const EDUCATION_OPTIONS = [
//   { label: 'No Formal Education', value: 'no_formal' },
//   { label: 'Primary School', value: 'primary' },
//   { label: 'Secondary School', value: 'secondary' },
//   { label: 'Vocational Training', value: 'vocational' },
//   { label: 'OND/NCE', value: 'ond' },
//   { label: 'Bachelor\'s Degree', value: 'bachelor' },
//   { label: 'Master\'s Degree', value: 'master' },
//   { label: 'Doctorate', value: 'doctorate' },
//   { label: 'Professional Degree', value: 'professional' },
// ];

// const INCOME_OPTIONS = [
//   { label: '$0 - $25,000', value: '0-25000' },
//   { label: '$25,001 - $50,000', value: '25001-50000' },
//   { label: '$50,001 - $75,000', value: '50001-75000' },
//   { label: '$75,001 - $100,000', value: '75001-100000' },
//   { label: '$100,000+', value: '100000+' },
// ];

// const LANGUAGE_OPTIONS = [
//   { label: 'English', value: 'en' },
//   { label: 'Hausa', value: 'ha' },
//   { label: 'Igbo', value: 'ig' },
//   { label: 'Yoruba', value: 'yo' },
//   { label: 'Pidgin English', value: 'pcm' },
// ];

// export default function TargetAudienceScreen() {
//   const { id } = useLocalSearchParams();
//   const { business, loading, refetch } = useBusiness(id);
//   const [saving, setSaving] = useState(false);
//   const [targetAudience, setTargetAudience] = useState(null);

//   useEffect(() => {
//     if (business?.branding?.targetAudience) {
//       setTargetAudience(business.branding.targetAudience);
//     } else {
//       setTargetAudience({
//         industry: '',
//         subIndustry: '',
//         ageRange: { min: 18, max: 65 },
//         gender: [],
//         locations: [],
//         languages: ['en'],
//         interests: [],
//         behaviors: [],
//         income: '',
//         education: [],
//         occupation: [],
//         psychographics: {},
//       });
//     }
//   }, [business]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await BusinessApi.updateTargetAudience(id, { targetAudience });
//       Alert.alert('Success', 'Target audience updated successfully');
//       await refetch();
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to update target audience');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateField = (field, value) => {
//     setTargetAudience(prev => ({ ...prev, [field]: value }));
//   };

//   const updateAgeRange = (key, value) => {
//     setTargetAudience(prev => ({
//       ...prev,
//       ageRange: { ...prev.ageRange, [key]: value }
//     }));
//   };

//   if (loading || !targetAudience) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Demographics */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Demographics</Text>
          
//           <FormSelect
//             label="Industry"
//             value={targetAudience.industry}
//             onSelect={(value) => updateField('industry', value)}
//             options={INDUSTRIES}
//             placeholder="Select industry"
//           />

//           <FormInput
//             label="Sub-Industry"
//             value={targetAudience.subIndustry}
//             onChangeText={(value) => updateField('subIndustry', value)}
//             placeholder="e.g., Luxury Fashion, Fast Food"
//           />

//           <Text style={styles.subsectionTitle}>Age Range</Text>
//           <View style={styles.ageRangeContainer}>
//             <View style={styles.ageInput}>
//               <FormInput
//                 label="Min Age"
//                 value={targetAudience.ageRange.min?.toString()}
//                 onChangeText={(value) => updateAgeRange('min', parseInt(value) || 18)}
//                 placeholder="18"
//                 keyboardType="numeric"
//               />
//             </View>
//             <Text style={styles.ageSeparator}>to</Text>
//             <View style={styles.ageInput}>
//               <FormInput
//                 label="Max Age"
//                 value={targetAudience.ageRange.max?.toString()}
//                 onChangeText={(value) => updateAgeRange('max', parseInt(value) || 65)}
//                 placeholder="65"
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>

//           <MultiSelect
//             label="Gender"
//             value={targetAudience.gender}
//             onSelect={(value) => updateField('gender', value)}
//             options={GENDER_OPTIONS}
//             placeholder="Select gender"
//           />

//           <FormSelect
//             label="Income Level"
//             value={targetAudience.income}
//             onSelect={(value) => updateField('income', value)}
//             options={INCOME_OPTIONS}
//             placeholder="Select income level"
//           />

//           <MultiSelect
//             label="Education Level"
//             value={targetAudience.education}
//             onSelect={(value) => updateField('education', value)}
//             options={EDUCATION_OPTIONS}
//             placeholder="Select education levels"
//           />
//         </View>

//         {/* Location & Language */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Location & Language</Text>
          
//           <TagInput
//             tags={targetAudience.locations}
//             onTagsChange={(locations) => updateField('locations', locations)}
//             placeholder="Add a location (city, state, country)"
//           />

//           <MultiSelect
//             label="Languages"
//             value={targetAudience.languages}
//             onSelect={(value) => updateField('languages', value)}
//             options={LANGUAGE_OPTIONS}
//             placeholder="Select languages"
//           />
//         </View>

//         {/* Interests & Behaviors */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Interests & Behaviors</Text>
          
//           <TagInput
//             tags={targetAudience.interests}
//             onTagsChange={(interests) => updateField('interests', interests)}
//             placeholder="Add an interest"
//           />

//           <TagInput
//             tags={targetAudience.behaviors}
//             onTagsChange={(behaviors) => updateField('behaviors', behaviors)}
//             placeholder="Add a behavior"
//           />

//           <TagInput
//             tags={targetAudience.occupation}
//             onTagsChange={(occupation) => updateField('occupation', occupation)}
//             placeholder="Add an occupation"
//           />
//         </View>

//         {/* Psychographics */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Psychographics</Text>
          
//           <TagInput
//             tags={targetAudience.psychographics?.values || []}
//             onTagsChange={(values) => updateField('psychographics', { 
//               ...targetAudience.psychographics, 
//               values 
//             })}
//             placeholder="Add values"
//           />

//           <TagInput
//             tags={targetAudience.psychographics?.lifestyles || []}
//             onTagsChange={(lifestyles) => updateField('psychographics', { 
//               ...targetAudience.psychographics, 
//               lifestyles 
//             })}
//             placeholder="Add lifestyles"
//           />

//           <TagInput
//             tags={targetAudience.psychographics?.personality || []}
//             onTagsChange={(personality) => updateField('psychographics', { 
//               ...targetAudience.psychographics, 
//               personality 
//             })}
//             placeholder="Add personality traits"
//           />
//         </View>

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             {saving ? (
//               <LoadingSpinner size="small" color="#fff" />
//             ) : (
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     padding: 20,
//   },
//   section: {
//     marginBottom: 30,
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
//     marginBottom: 10,
//   },
//   ageRangeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   ageInput: {
//     flex: 1,
//   },
//   ageSeparator: {
//     marginHorizontal: 15,
//     fontSize: 16,
//     color: '#666',
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




























// app/(app)/business/[id]/target-audience.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
import BusinessApi from '../../../../../services/businessApi';
import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
import FormInput from '../../../../../components/business/ui/FormInput';
import FormSelect from '../../../../../components/business/ui/FormSelect';
import FormSlider from '../../../../../components/business/ui/FormSlider';
import TagInput from '../../../../../components/business/ui/TagInput';
import MultiSelect from '../../../../../components/business/ui/MultiSelect';
import Header from '../../../../../components/common/Header';
import { INDUSTRIES } from '../../../../../utils/constants';

const GENDER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non_binary' },
];

const EDUCATION_OPTIONS = [
  { label: 'No Formal Education', value: 'no_formal' },
  { label: 'Primary School', value: 'primary' },
  { label: 'Secondary School', value: 'secondary' },
  { label: 'Vocational Training', value: 'vocational' },
  { label: "OND/NCE", value: 'ond' },
  { label: "Bachelor's Degree", value: 'bachelor' },
  { label: "Master's Degree", value: 'master' },
  { label: 'Doctorate', value: 'doctorate' },
  { label: 'Professional Degree', value: 'professional' },
];

const INCOME_OPTIONS = [
  { label: '$0 - $25,000', value: '0-25000' },
  { label: '$25,001 - $50,000', value: '25001-50000' },
  { label: '$50,001 - $75,000', value: '50001-75000' },
  { label: '$75,001 - $100,000', value: '75001-100000' },
  { label: '$100,000+', value: '100000+' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Pidgin English', value: 'pcm' },
];

export default function TargetAudienceScreen() {
  const { id } = useLocalSearchParams();
  const { business, loading, refetch } = useBusiness(id);
  const [saving, setSaving] = useState(false);
  const [targetAudience, setTargetAudience] = useState(null);

  useEffect(() => {
    if (business?.branding?.targetAudience) {
      setTargetAudience(business.branding.targetAudience);
    } else {
      setTargetAudience({
        industry: '',
        subIndustry: '',
        ageRange: { min: 18, max: 65 },
        gender: [],
        locations: [],
        languages: ['en'],
        interests: [],
        behaviors: [],
        income: '',
        education: [],
        occupation: [],
        psychographics: {},
      });
    }
  }, [business]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await BusinessApi.updateTargetAudience(id, { targetAudience });
      Alert.alert('Success', 'Target audience updated successfully');
      await refetch();
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update target audience');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setTargetAudience(prev => ({ ...prev, [field]: value }));
  };

  const updateAgeRange = (key, value) => {
    setTargetAudience(prev => ({
      ...prev,
      ageRange: { ...prev.ageRange, [key]: value }
    }));
  };

  if (loading || !targetAudience) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Target Audience"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.content}>
          {/* Demographics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographics</Text>
            
            <FormSelect
              label="Industry"
              value={targetAudience.industry}
              onSelect={(value) => updateField('industry', value)}
              options={INDUSTRIES}
              placeholder="Select industry"
            />

            <FormInput
              label="Sub-Industry"
              value={targetAudience.subIndustry}
              onChangeText={(value) => updateField('subIndustry', value)}
              placeholder="e.g., Luxury Fashion, Fast Food"
            />

            <Text style={styles.subsectionTitle}>Age Range</Text>
            <View style={styles.ageRangeContainer}>
              <View style={styles.ageInput}>
                <FormInput
                  label="Min Age"
                  value={targetAudience.ageRange.min?.toString()}
                  onChangeText={(value) => updateAgeRange('min', parseInt(value) || 18)}
                  placeholder="18"
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.ageSeparator}>to</Text>
              <View style={styles.ageInput}>
                <FormInput
                  label="Max Age"
                  value={targetAudience.ageRange.max?.toString()}
                  onChangeText={(value) => updateAgeRange('max', parseInt(value) || 65)}
                  placeholder="65"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <MultiSelect
              label="Gender"
              value={targetAudience.gender}
              onSelect={(value) => updateField('gender', value)}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
            />

            <FormSelect
              label="Income Level"
              value={targetAudience.income}
              onSelect={(value) => updateField('income', value)}
              options={INCOME_OPTIONS}
              placeholder="Select income level"
            />

            <MultiSelect
              label="Education Level"
              value={targetAudience.education}
              onSelect={(value) => updateField('education', value)}
              options={EDUCATION_OPTIONS}
              placeholder="Select education levels"
            />
          </View>

          {/* Location & Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Language</Text>
            
            <TagInput
              tags={targetAudience.locations}
              onTagsChange={(locations) => updateField('locations', locations)}
              placeholder="Add a location (city, state, country)"
            />

            <MultiSelect
              label="Languages"
              value={targetAudience.languages}
              onSelect={(value) => updateField('languages', value)}
              options={LANGUAGE_OPTIONS}
              placeholder="Select languages"
            />
          </View>

          {/* Interests & Behaviors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests & Behaviors</Text>
            
            <TagInput
              tags={targetAudience.interests}
              onTagsChange={(interests) => updateField('interests', interests)}
              placeholder="Add an interest"
            />

            <TagInput
              tags={targetAudience.behaviors}
              onTagsChange={(behaviors) => updateField('behaviors', behaviors)}
              placeholder="Add a behavior"
            />

            <TagInput
              tags={targetAudience.occupation}
              onTagsChange={(occupation) => updateField('occupation', occupation)}
              placeholder="Add an occupation"
            />
          </View>

          {/* Psychographics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Psychographics</Text>
            
            <TagInput
              tags={targetAudience.psychographics?.values || []}
              onTagsChange={(values) => updateField('psychographics', { 
                ...targetAudience.psychographics, 
                values 
              })}
              placeholder="Add values"
            />

            <TagInput
              tags={targetAudience.psychographics?.lifestyles || []}
              onTagsChange={(lifestyles) => updateField('psychographics', { 
                ...targetAudience.psychographics, 
                lifestyles 
              })}
              placeholder="Add lifestyles"
            />

            <TagInput
              tags={targetAudience.psychographics?.personality || []}
              onTagsChange={(personality) => updateField('psychographics', { 
                ...targetAudience.psychographics, 
                personality 
              })}
              placeholder="Add personality traits"
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
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
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
    marginBottom: 10,
  },
  ageRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ageInput: {
    flex: 1,
  },
  ageSeparator: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#666',
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