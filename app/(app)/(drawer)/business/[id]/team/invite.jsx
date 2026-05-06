// // app/(app)/business/[id]/team/invite.js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
// import FormInput from '../../../../../../components/business/ui/FormInput';
// import FormSelect from '../../../../../../components/business/ui/FormSelect';
// import MultiSelect from '../../../../../../components/business/ui/MultiSelect';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import { TEAM_ROLES, PERMISSIONS } from '../../../../../../utils/constants';
// import { validateEmail } from '../../../../../../utils/validators';

// export default function InviteTeamMemberScreen() {
//   const { id } = useLocalSearchParams();
//   const { inviteMember } = useTeamMembers(id);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     role: 'viewer',
//     permissions: [],
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!formData.role) {
//       newErrors.role = 'Please select a role';
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
//       await inviteMember(formData);
//       Alert.alert('Success', 'Team member invited successfully!', [
//         { text: 'OK', onPress: () => router.back() }
//       ]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to invite team member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.description}>
//           Invite team members to collaborate on managing your social media presence.
//           They'll receive an email invitation to join your business.
//         </Text>

//         <FormInput
//           label="Email Address *"
//           value={formData.email}
//           onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
//           placeholder="colleague@example.com"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           error={errors.email}
//         />

//         <FormSelect
//           label="Role *"
//           value={formData.role}
//           onSelect={(value) => setFormData(prev => ({ ...prev, role: value }))}
//           options={TEAM_ROLES}
//           placeholder="Select a role"
//           error={errors.role}
//         />

//         <View style={styles.roleInfo}>
//           <Text style={styles.roleInfoTitle}>
//             {formData.role === 'admin' && 'Admin'}
//             {formData.role === 'editor' && 'Editor'}
//             {formData.role === 'viewer' && 'Viewer'}
//           </Text>
//           <Text style={styles.roleInfoDescription}>
//             {formData.role === 'admin' && 'Full access to all features including team management and settings'}
//             {formData.role === 'editor' && 'Can create and edit content, but cannot manage team or settings'}
//             {formData.role === 'viewer' && 'View-only access to content and analytics'}
//           </Text>
//         </View>

//         {formData.role !== 'admin' && (
//           <MultiSelect
//             label="Custom Permissions"
//             value={formData.permissions}
//             onSelect={(permissions) => setFormData(prev => ({ ...prev, permissions }))}
//             options={PERMISSIONS}
//             placeholder="Select additional permissions"
//           />
//         )}

//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.inviteButton}
//             onPress={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <LoadingSpinner size="small" color="#fff" />
//             ) : (
//               <Text style={styles.inviteButtonText}>Send Invitation</Text>
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
//   description: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   roleInfo: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   roleInfoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 5,
//   },
//   roleInfoDescription: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
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
//   inviteButton: {
//     flex: 1,
//     backgroundColor: '#1976d2',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   inviteButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });























// app/(app)/business/[id]/team/invite.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
import FormInput from '../../../../../../components/business/ui/FormInput';
import FormSelect from '../../../../../../components/business/ui/FormSelect';
import MultiSelect from '../../../../../../components/business/ui/MultiSelect';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import Header from '../../../../../../components/common/Header';
import { TEAM_ROLES, PERMISSIONS } from '../../../../../../utils/constants';
import { validateEmail } from '../../../../../../utils/validators';

export default function InviteTeamMemberScreen() {
  const { id } = useLocalSearchParams();
  const { inviteMember } = useTeamMembers(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer',
    permissions: [],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.role) {
      newErrors.role = 'Please select a role';
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
      await inviteMember(formData);
      Alert.alert('Success', 'Team member invited successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to invite team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Invite Team Member"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.description}>
            Invite team members to collaborate on managing your social media presence.
            They'll receive an email invitation to join your business.
          </Text>

          <FormInput
            label="Email Address *"
            value={formData.email}
            onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="colleague@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <FormSelect
            label="Role *"
            value={formData.role}
            onSelect={(value) => setFormData(prev => ({ ...prev, role: value }))}
            options={TEAM_ROLES}
            placeholder="Select a role"
            error={errors.role}
          />

          <View style={styles.roleInfo}>
            <Text style={styles.roleInfoTitle}>
              {formData.role === 'admin' && 'Admin'}
              {formData.role === 'editor' && 'Editor'}
              {formData.role === 'viewer' && 'Viewer'}
            </Text>
            <Text style={styles.roleInfoDescription}>
              {formData.role === 'admin' && 'Full access to all features including team management and settings'}
              {formData.role === 'editor' && 'Can create and edit content, but cannot manage team or settings'}
              {formData.role === 'viewer' && 'View-only access to content and analytics'}
            </Text>
          </View>

          {formData.role !== 'admin' && (
            <MultiSelect
              label="Custom Permissions"
              value={formData.permissions}
              onSelect={(permissions) => setFormData(prev => ({ ...prev, permissions }))}
              options={PERMISSIONS}
              placeholder="Select additional permissions"
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" color="#fff" />
              ) : (
                <Text style={styles.inviteButtonText}>Send Invitation</Text>
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
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  roleInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  roleInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  roleInfoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
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
  inviteButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});