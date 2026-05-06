// // frontend/app/(business)/create.js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { useBusiness } from '../../hooks/useBusiness';
// import { theme } from '../../styles/theme';

// const INDUSTRIES = [
//   { label: 'Technology', value: 'technology' },
//   { label: 'Software', value: 'software' },
//   { label: 'E-commerce', value: 'ecommerce' },
//   { label: 'Retail', value: 'retail' },
//   { label: 'Fashion', value: 'fashion' },
//   { label: 'Beauty', value: 'beauty' },
//   { label: 'Food & Beverage', value: 'food_beverage' },
//   { label: 'Travel', value: 'travel' },
//   { label: 'Hospitality', value: 'hospitality' },
//   { label: 'Healthcare', value: 'healthcare' },
//   { label: 'Fitness', value: 'fitness' },
//   { label: 'Education', value: 'education' },
//   { label: 'Finance', value: 'finance' },
//   { label: 'Real Estate', value: 'real_estate' },
//   { label: 'Automotive', value: 'automotive' },
//   { label: 'Entertainment', value: 'entertainment' },
//   { label: 'Media', value: 'media' },
//   { label: 'Nonprofit', value: 'nonprofit' },
//   { label: 'Professional Services', value: 'professional_services' },
//   { label: 'Manufacturing', value: 'manufacturing' },
//   { label: 'Construction', value: 'construction' },
//   { label: 'Agriculture', value: 'agriculture' },
//   { label: 'Energy', value: 'energy' },
//   { label: 'Telecommunications', value: 'telecommunications' },
//   { label: 'Transportation', value: 'transportation' },
//   { label: 'Other', value: 'other' },
// ];

// export default function CreateBusinessScreen() {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     industry: '',
//     website: '',
//     description: '',
//   });
//   const { createBusiness } = useBusiness();

//   const handleCreate = async () => {
//     if (!formData.name.trim()) {
//       Alert.alert('Error', 'Please enter your business name');
//       return;
//     }
    
//     if (!formData.industry) {
//       Alert.alert('Error', 'Please select your industry');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const result = await createBusiness(formData);
      
//       if (result.success) {
//         Alert.alert(
//           'Success',
//           'Business created successfully!',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 router.replace('/(app)');
//               }
//             }
//           ]
//         );
//       } else {
//         Alert.alert('Error', result.error || 'Failed to create business');
//       }
//     } catch (error) {
//       console.error('Create business error:', error);
//       Alert.alert('Error', error.message || 'An error occurred while creating your business');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getIndustryLabel = (value) => {
//     const industry = INDUSTRIES.find(i => i.value === value);
//     return industry ? industry.label : '';
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
//       </TouchableOpacity>

//       <View style={styles.header}>
//         <View style={styles.iconContainer}>
//           <Ionicons name="business-outline" size={50} color={theme.colors.primary} />
//         </View>
//         <Text style={styles.title}>Create Business</Text>
//         <Text style={styles.subtitle}>Enter your business details to get started</Text>
//       </View>

//       <View style={styles.form}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Business Name <Text style={styles.required}>*</Text></Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., Acme Corporation"
//             placeholderTextColor={theme.colors.textSecondary}
//             value={formData.name}
//             onChangeText={(text) => setFormData({ ...formData, name: text })}
//             editable={!loading}
//             autoCapitalize="words"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Industry <Text style={styles.required}>*</Text></Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={formData.industry}
//               onValueChange={(value) => setFormData({ ...formData, industry: value })}
//               enabled={!loading}
//               style={styles.picker}
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
//             placeholder="https://example.com"
//             placeholderTextColor={theme.colors.textSecondary}
//             value={formData.website}
//             onChangeText={(text) => setFormData({ ...formData, website: text })}
//             keyboardType="url"
//             autoCapitalize="none"
//             editable={!loading}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Tell us about your business..."
//             placeholderTextColor={theme.colors.textSecondary}
//             value={formData.description}
//             onChangeText={(text) => setFormData({ ...formData, description: text })}
//             multiline
//             numberOfLines={4}
//             textAlignVertical="top"
//             editable={!loading}
//           />
//           <Text style={styles.helperText}>
//             {formData.description.length}/1000 characters
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.createButton, loading && styles.createButtonDisabled]}
//           onPress={handleCreate}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
//               <Text style={styles.createButtonText}>Create Business</Text>
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
//   backButton: {
//     padding: 20,
//     paddingTop: 60,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//     paddingHorizontal: 20,
//   },
//   iconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: theme.colors.primary + '15',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     textAlign: 'center',
//   },
//   form: {
//     padding: 20,
//     paddingTop: 0,
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
//   required: {
//     color: '#FF3B30',
//   },
//   helperText: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     marginTop: 4,
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
//   picker: {
//     height: 50,
//   },
//   createButton: {
//     backgroundColor: theme.colors.primary,
//     height: 54,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     flexDirection: 'row',
//   },
//   createButtonDisabled: {
//     opacity: 0.7,
//   },
//   buttonIcon: {
//     marginRight: 8,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
















// app/(app)/business/create.js
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
// import { router } from 'expo-router';
// import { useBusinessStore } from '../../../../stores/businessStore';
// import FormInput from '../../../../components/business/ui/FormInput';
// import FormSelect from '../../../../components/business/ui/FormSelect';
// import LoadingSpinner from '../../../../components/business/ui/LoadingSpinner';
// import { INDUSTRIES, BUSINESS_SIZES } from '../../../../utils/constants';
// import { validateBusinessName, validateUrl, validateEmail } from '../../../../utils/validators';

// export default function CreateBusinessScreen() {
//   const { createBusiness } = useBusinessStore();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     website: '',
//     industry: '',
//     subIndustry: '',
//     niche: '',
//     description: '',
//     size: '',
//     location: {
//       address: '',
//       city: '',
//       state: '',
//       country: '',
//       zipCode: '',
//     },
//     contact: {
//       email: '',
//       phone: '',
//       supportEmail: '',
//     },
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateBusinessName(formData.name)) {
//       newErrors.name = 'Business name is required (2-100 characters)';
//     }
//     if (!formData.industry) {
//       newErrors.industry = 'Industry is required';
//     }
//     if (formData.website && !validateUrl(formData.website)) {
//       newErrors.website = 'Please enter a valid URL';
//     }
//     if (formData.contact.email && !validateEmail(formData.contact.email)) {
//       newErrors.contactEmail = 'Please enter a valid email';
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
//       await createBusiness(formData);
//       Alert.alert('Success', 'Business created successfully!', [
//         { text: 'OK', onPress: () => router.back() }
//       ]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to create business');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateField = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const updateNestedField = (parent, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [parent]: { ...prev[parent], [field]: value }
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
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Basic Information</Text>
            
//             <FormInput
//               label="Business Name *"
//               value={formData.name}
//               onChangeText={(value) => updateField('name', value)}
//               placeholder="Enter business name"
//               error={errors.name}
//             />

//             <FormInput
//               label="Website"
//               value={formData.website}
//               onChangeText={(value) => updateField('website', value)}
//               placeholder="https://example.com"
//               keyboardType="url"
//               autoCapitalize="none"
//               error={errors.website}
//             />

//             <FormSelect
//               label="Industry *"
//               value={formData.industry}
//               onSelect={(value) => updateField('industry', value)}
//               options={INDUSTRIES}
//               placeholder="Select industry"
//               error={errors.industry}
//             />

//             <FormInput
//               label="Sub-Industry"
//               value={formData.subIndustry}
//               onChangeText={(value) => updateField('subIndustry', value)}
//               placeholder="e.g., SaaS, Mobile Apps"
//             />

//             <FormInput
//               label="Niche"
//               value={formData.niche}
//               onChangeText={(value) => updateField('niche', value)}
//               placeholder="Your specific market niche"
//             />

//             <FormInput
//               label="Description"
//               value={formData.description}
//               onChangeText={(value) => updateField('description', value)}
//               placeholder="Describe your business..."
//               multiline
//               numberOfLines={4}
//               maxLength={1000}
//             />

//             <FormSelect
//               label="Company Size"
//               value={formData.size}
//               onSelect={(value) => updateField('size', value)}
//               options={BUSINESS_SIZES}
//               placeholder="Select company size"
//             />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Contact Information</Text>

//             <FormInput
//               label="Business Email"
//               value={formData.contact.email}
//               onChangeText={(value) => updateNestedField('contact', 'email', value)}
//               placeholder="contact@business.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               error={errors.contactEmail}
//             />

//             <FormInput
//               label="Phone"
//               value={formData.contact.phone}
//               onChangeText={(value) => updateNestedField('contact', 'phone', value)}
//               placeholder="+1 (555) 123-4567"
//               keyboardType="phone-pad"
//             />

//             <FormInput
//               label="Support Email"
//               value={formData.contact.supportEmail}
//               onChangeText={(value) => updateNestedField('contact', 'supportEmail', value)}
//               placeholder="support@business.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Location</Text>

//             <FormInput
//               label="Address"
//               value={formData.location.address}
//               onChangeText={(value) => updateNestedField('location', 'address', value)}
//               placeholder="Street address"
//             />

//             <View style={styles.row}>
//               <View style={styles.halfField}>
//                 <FormInput
//                   label="City"
//                   value={formData.location.city}
//                   onChangeText={(value) => updateNestedField('location', 'city', value)}
//                   placeholder="City"
//                 />
//               </View>
//               <View style={styles.halfField}>
//                 <FormInput
//                   label="State"
//                   value={formData.location.state}
//                   onChangeText={(value) => updateNestedField('location', 'state', value)}
//                   placeholder="State"
//                 />
//               </View>
//             </View>

//             <View style={styles.row}>
//               <View style={styles.halfField}>
//                 <FormInput
//                   label="Country"
//                   value={formData.location.country}
//                   onChangeText={(value) => updateNestedField('location', 'country', value)}
//                   placeholder="Country"
//                 />
//               </View>
//               <View style={styles.halfField}>
//                 <FormInput
//                   label="ZIP Code"
//                   value={formData.location.zipCode}
//                   onChangeText={(value) => updateNestedField('location', 'zipCode', value)}
//                   placeholder="ZIP Code"
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//           </View>

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
//                 <Text style={styles.submitButtonText}>Create Business</Text>
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
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfField: {
//     flex: 0.48,
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



















// app/(app)/business/create.js
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
import { router } from 'expo-router';
import { useBusinessStore } from '../../../../stores/businessStore';
import FormInput from '../../../../components/business/ui/FormInput';
import FormSelect from '../../../../components/business/ui/FormSelect';
import LoadingSpinner from '../../../../components/business/ui/LoadingSpinner';
import Header from '../../../../components/common/Header';
import { INDUSTRIES, BUSINESS_SIZES } from '../../../../utils/constants';
import { validateBusinessName, validateUrl, validateEmail } from '../../../../utils/validators';

export default function CreateBusinessScreen() {
  const { createBusiness } = useBusinessStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    subIndustry: '',
    niche: '',
    description: '',
    size: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    contact: {
      email: '',
      phone: '',
      supportEmail: '',
    },
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!validateBusinessName(formData.name)) {
      newErrors.name = 'Business name is required (2-100 characters)';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    if (formData.contact.email && !validateEmail(formData.contact.email)) {
      newErrors.contactEmail = 'Please enter a valid email';
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
      await createBusiness(formData);
      Alert.alert('Success', 'Business created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header
        title="Create Business"
        showBack={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <FormInput
              label="Business Name *"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter business name"
              error={errors.name}
            />

            <FormInput
              label="Website"
              value={formData.website}
              onChangeText={(value) => updateField('website', value)}
              placeholder="https://example.com"
              keyboardType="url"
              autoCapitalize="none"
              error={errors.website}
            />

            <FormSelect
              label="Industry *"
              value={formData.industry}
              onSelect={(value) => updateField('industry', value)}
              options={INDUSTRIES}
              placeholder="Select industry"
              error={errors.industry}
            />

            <FormInput
              label="Sub-Industry"
              value={formData.subIndustry}
              onChangeText={(value) => updateField('subIndustry', value)}
              placeholder="e.g., SaaS, Mobile Apps"
            />

            <FormInput
              label="Niche"
              value={formData.niche}
              onChangeText={(value) => updateField('niche', value)}
              placeholder="Your specific market niche"
            />

            <FormInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Describe your business..."
              multiline
              numberOfLines={4}
              maxLength={1000}
            />

            <FormSelect
              label="Company Size"
              value={formData.size}
              onSelect={(value) => updateField('size', value)}
              options={BUSINESS_SIZES}
              placeholder="Select company size"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <FormInput
              label="Business Email"
              value={formData.contact.email}
              onChangeText={(value) => updateNestedField('contact', 'email', value)}
              placeholder="contact@business.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.contactEmail}
            />

            <FormInput
              label="Phone"
              value={formData.contact.phone}
              onChangeText={(value) => updateNestedField('contact', 'phone', value)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Support Email"
              value={formData.contact.supportEmail}
              onChangeText={(value) => updateNestedField('contact', 'supportEmail', value)}
              placeholder="support@business.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <FormInput
              label="Address"
              value={formData.location.address}
              onChangeText={(value) => updateNestedField('location', 'address', value)}
              placeholder="Street address"
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <FormInput
                  label="City"
                  value={formData.location.city}
                  onChangeText={(value) => updateNestedField('location', 'city', value)}
                  placeholder="City"
                />
              </View>
              <View style={styles.halfField}>
                <FormInput
                  label="State"
                  value={formData.location.state}
                  onChangeText={(value) => updateNestedField('location', 'state', value)}
                  placeholder="State"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <FormInput
                  label="Country"
                  value={formData.location.country}
                  onChangeText={(value) => updateNestedField('location', 'country', value)}
                  placeholder="Country"
                />
              </View>
              <View style={styles.halfField}>
                <FormInput
                  label="ZIP Code"
                  value={formData.location.zipCode}
                  onChangeText={(value) => updateNestedField('location', 'zipCode', value)}
                  placeholder="ZIP Code"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

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
                <Text style={styles.submitButtonText}>Create Business</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    flex: 0.48,
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