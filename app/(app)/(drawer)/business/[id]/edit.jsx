// // app/(app)/business/[id]/edit.js
// import { useState, useEffect } from 'react';
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
// import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
// import { useBusinessStore } from '../../../../../stores/businessStore';
// import FormInput from '../../../../../components/business/ui/FormInput';
// import FormSelect from '../../../../../components/business/ui/FormSelect';
// import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
// import ConfirmDialog from '../../../../../components/business/ui/ConfirmDialog';
// import { INDUSTRIES, BUSINESS_SIZES } from '../../../../../utils/constants';
// import { validateBusinessName, validateUrl, validateEmail } from '../../../../../utils/validators';

// export default function EditBusinessScreen() {
//   const { id } = useLocalSearchParams();
//   const { business, loading, refetch } = useBusiness(id);
//   const { updateBusiness } = useBusinessStore();
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [hasChanges, setHasChanges] = useState(false);
//   const [showDiscardDialog, setShowDiscardDialog] = useState(false);

//   useEffect(() => {
//     if (business) {
//       setFormData({
//         name: business.name || '',
//         website: business.website || '',
//         industry: business.industry || '',
//         subIndustry: business.subIndustry || '',
//         niche: business.niche || '',
//         description: business.description || '',
//         size: business.size || '',
//         founded: business.founded ? new Date(business.founded).toISOString().split('T')[0] : '',
//         location: {
//           address: business.location?.address || '',
//           city: business.location?.city || '',
//           state: business.location?.state || '',
//           country: business.location?.country || '',
//           zipCode: business.location?.zipCode || '',
//         },
//         contact: {
//           email: business.contact?.email || '',
//           phone: business.contact?.phone || '',
//           supportEmail: business.contact?.supportEmail || '',
//         },
//       });
//     }
//   }, [business]);

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

//   const handleSave = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setSaving(true);
      
//       // Only send changed fields
//       const changedData = {};
//       Object.keys(formData).forEach(key => {
//         if (key === 'location' || key === 'contact') {
//           const nestedChanges = {};
//           Object.keys(formData[key]).forEach(nestedKey => {
//             if (formData[key][nestedKey] !== business[key]?.[nestedKey]) {
//               nestedChanges[nestedKey] = formData[key][nestedKey];
//             }
//           });
//           if (Object.keys(nestedChanges).length > 0) {
//             changedData[key] = nestedChanges;
//           }
//         } else if (formData[key] !== business[key]) {
//           changedData[key] = formData[key];
//         }
//       });

//       await updateBusiness(id, changedData);
//       await refetch();
//       setHasChanges(false);
//       Alert.alert('Success', 'Business updated successfully');
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to update business');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (hasChanges) {
//       setShowDiscardDialog(true);
//     } else {
//       router.back();
//     }
//   };

//   const updateField = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     setHasChanges(true);
//   };

//   const updateNestedField = (parent, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [parent]: { ...prev[parent], [field]: value }
//     }));
//     setHasChanges(true);
//   };

//   if (loading || !formData) {
//     return <LoadingSpinner />;
//   }

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

//             <FormInput
//               label="Founded Date"
//               value={formData.founded}
//               onChangeText={(value) => updateField('founded', value)}
//               placeholder="YYYY-MM-DD"
//             />
//           </View>

//           {/* Contact Information */}
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

//           {/* Location */}
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

//           {/* Danger Zone */}
//           <View style={styles.dangerZone}>
//             <Text style={styles.dangerTitle}>Danger Zone</Text>
//             <TouchableOpacity 
//               style={styles.deleteButton}
//               onPress={() => {
//                 Alert.alert(
//                   'Delete Business',
//                   'Are you sure you want to delete this business? This action cannot be undone.',
//                   [
//                     { text: 'Cancel', style: 'cancel' },
//                     { 
//                       text: 'Delete', 
//                       style: 'destructive',
//                       onPress: async () => {
//                         try {
//                           await useBusinessStore.getState().deleteBusiness(id);
//                           router.replace('/business');
//                         } catch (error) {
//                           Alert.alert('Error', 'Failed to delete business');
//                         }
//                       }
//                     },
//                   ]
//                 );
//               }}
//             >
//               <Text style={styles.deleteButtonText}>Delete Business</Text>
//             </TouchableOpacity>
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
//             disabled={saving}
//           >
//             {saving ? (
//               <LoadingSpinner size="small" color="#fff" />
//             ) : (
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       <ConfirmDialog
//         visible={showDiscardDialog}
//         title="Discard Changes"
//         message="You have unsaved changes. Are you sure you want to discard them?"
//         confirmText="Discard"
//         cancelText="Keep Editing"
//         onConfirm={() => router.back()}
//         onCancel={() => setShowDiscardDialog(false)}
//         destructive
//       />
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
//   dangerZone: {
//     marginTop: 20,
//     marginBottom: 30,
//     padding: 20,
//     backgroundColor: '#fff5f5',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ffcdd2',
//   },
//   dangerTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#d32f2f',
//     marginBottom: 15,
//   },
//   deleteButton: {
//     backgroundColor: '#d32f2f',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
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





















// app/(app)/business/[id]/edit.js
import React, { useState, useEffect } from 'react';
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
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
import { useBusinessStore } from '../../../../../stores/businessStore';
import FormInput from '../../../../../components/business/ui/FormInput';
import FormSelect from '../../../../../components/business/ui/FormSelect';
import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
import ConfirmDialog from '../../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../../components/common/Header';
import { INDUSTRIES, BUSINESS_SIZES } from '../../../../../utils/constants';
import { validateBusinessName, validateUrl, validateEmail } from '../../../../../utils/validators';

export default function EditBusinessScreen() {
  const { id } = useLocalSearchParams();
  const { business, loading, refetch } = useBusiness(id);
  const { updateBusiness } = useBusinessStore();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        website: business.website || '',
        industry: business.industry || '',
        subIndustry: business.subIndustry || '',
        niche: business.niche || '',
        description: business.description || '',
        size: business.size || '',
        founded: business.founded ? new Date(business.founded).toISOString().split('T')[0] : '',
        location: {
          address: business.location?.address || '',
          city: business.location?.city || '',
          state: business.location?.state || '',
          country: business.location?.country || '',
          zipCode: business.location?.zipCode || '',
        },
        contact: {
          email: business.contact?.email || '',
          phone: business.contact?.phone || '',
          supportEmail: business.contact?.supportEmail || '',
        },
      });
    }
  }, [business]);

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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (key === 'location' || key === 'contact') {
          const nestedChanges = {};
          Object.keys(formData[key]).forEach(nestedKey => {
            if (formData[key][nestedKey] !== business[key]?.[nestedKey]) {
              nestedChanges[nestedKey] = formData[key][nestedKey];
            }
          });
          if (Object.keys(nestedChanges).length > 0) {
            changedData[key] = nestedChanges;
          }
        } else if (formData[key] !== business[key]) {
          changedData[key] = formData[key];
        }
      });

      await updateBusiness(id, changedData);
      await refetch();
      setHasChanges(false);
      Alert.alert('Success', 'Business updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      router.back();
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
    setHasChanges(true);
  };

  if (loading || !formData) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header
        title="Edit Business"
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

            <FormInput
              label="Founded Date"
              value={formData.founded}
              onChangeText={(value) => updateField('founded', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Contact Information */}
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

          {/* Location */}
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

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  'Delete Business',
                  'Are you sure you want to delete this business? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await useBusinessStore.getState().deleteBusiness(id);
                          router.replace('/business');
                        } catch (error) {
                          Alert.alert('Error', 'Failed to delete business');
                        }
                      }
                    },
                  ]
                );
              }}
            >
              <Text style={styles.deleteButtonText}>Delete Business</Text>
            </TouchableOpacity>
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
            disabled={saving}
          >
            {saving ? (
              <LoadingSpinner size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ConfirmDialog
        visible={showDiscardDialog}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep Editing"
        onConfirm={() => router.back()}
        onCancel={() => setShowDiscardDialog(false)}
        destructive
      />
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
  dangerZone: {
    marginTop: 20,
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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