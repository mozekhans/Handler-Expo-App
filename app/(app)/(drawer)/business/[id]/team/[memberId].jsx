// // app/(app)/business/[id]/team/[memberId].js
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
// import { Ionicons } from '@expo/vector-icons';
// import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import FormSelect from '../../../../../../components/business/ui/FormSelect';
// import MultiSelect from '../../../../../../components/business/ui/MultiSelect';
// import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
// import { TEAM_ROLES, PERMISSIONS } from '../../../../../../utils/constants';

// export default function TeamMemberDetailScreen() {
//   const { id, memberId } = useLocalSearchParams();
//   const { teamMembers, loading, error, updateMember, removeMember, refetch } = useTeamMembers(id);
//   const [saving, setSaving] = useState(false);
//   const [showRemoveDialog, setShowRemoveDialog] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [formData, setFormData] = useState(null);

//   const member = teamMembers.find(m => m.user._id === memberId);

//   useState(() => {
//     if (member) {
//       setFormData({
//         role: member.role,
//         permissions: member.permissions || [],
//       });
//     }
//   }, [member]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await updateMember(memberId, formData);
//       setHasChanges(false);
//       Alert.alert('Success', 'Team member updated successfully');
//       refetch();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to update team member');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleRemove = async () => {
//     try {
//       await removeMember(memberId);
//       Alert.alert('Success', 'Team member removed successfully');
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to remove team member');
//     }
//   };

//   const updateRole = (role) => {
//     setFormData(prev => ({ ...prev, role }));
//     setHasChanges(true);
//   };

//   const updatePermissions = (permissions) => {
//     setFormData(prev => ({ ...prev, permissions }));
//     setHasChanges(true);
//   };

//   if (loading || !member || !formData) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refetch} />;
//   }

//   const getInitials = (firstName, lastName) => {
//     return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Member Header */}
//         <View style={styles.header}>
//           <View style={styles.avatar}>
//             {member.user?.avatar ? (
//               <Image source={{ uri: member.user.avatar }} style={styles.avatarImage} />
//             ) : (
//               <Text style={styles.avatarText}>
//                 {getInitials(member.user?.firstName, member.user?.lastName)}
//               </Text>
//             )}
//           </View>
//           <Text style={styles.name}>
//             {member.user?.firstName} {member.user?.lastName}
//           </Text>
//           <Text style={styles.email}>{member.user?.email}</Text>
          
//           <View style={styles.statusBadge}>
//             <View style={[
//               styles.statusDot,
//               member.status === 'active' && styles.statusActive,
//               member.status === 'pending' && styles.statusPending,
//               member.status === 'inactive' && styles.statusInactive,
//             ]} />
//             <Text style={styles.statusText}>
//               {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//             </Text>
//           </View>
//         </View>

//         {/* Role Selection */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Role</Text>
//           <FormSelect
//             label=""
//             value={formData.role}
//             onSelect={updateRole}
//             options={TEAM_ROLES}
//             placeholder="Select role"
//           />
          
//           <View style={styles.roleInfo}>
//             <Text style={styles.roleInfoTitle}>
//               {formData.role === 'admin' && 'Administrator'}
//               {formData.role === 'editor' && 'Editor'}
//               {formData.role === 'viewer' && 'Viewer'}
//             </Text>
//             <Text style={styles.roleInfoDescription}>
//               {formData.role === 'admin' && 'Full access to all features including team management, settings, and billing.'}
//               {formData.role === 'editor' && 'Can create, edit, and schedule content. Cannot manage team members or change settings.'}
//               {formData.role === 'viewer' && 'View-only access to content, analytics, and reports. Cannot make any changes.'}
//             </Text>
//           </View>
//         </View>

//         {/* Permissions */}
//         {formData.role !== 'admin' && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Custom Permissions</Text>
//             <Text style={styles.sectionDescription}>
//               Grant additional permissions beyond the default role capabilities
//             </Text>
            
//             <MultiSelect
//               label=""
//               value={formData.permissions}
//               onSelect={updatePermissions}
//               options={PERMISSIONS}
//               placeholder="Select permissions"
//             />
//           </View>
//         )}

//         {/* Member Info */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Member Information</Text>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Joined</Text>
//             <Text style={styles.infoValue}>
//               {new Date(member.joinedAt).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//               })}
//             </Text>
//           </View>
          
//           {member.invitedBy && (
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Invited By</Text>
//               <Text style={styles.infoValue}>Team Owner</Text>
//             </View>
//           )}
//         </View>

//         {/* Danger Zone */}
//         <View style={styles.dangerZone}>
//           <Text style={styles.dangerTitle}>Remove Team Member</Text>
//           <Text style={styles.dangerDescription}>
//             Removing this team member will revoke their access to this business.
//             They will no longer be able to view or manage any content.
//           </Text>
//           <TouchableOpacity 
//             style={styles.removeButton}
//             onPress={() => setShowRemoveDialog(true)}
//           >
//             <Text style={styles.removeButtonText}>Remove Team Member</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {hasChanges && (
//         <View style={styles.footer}>
//           <TouchableOpacity 
//             style={styles.cancelButton}
//             onPress={() => {
//               setFormData({
//                 role: member.role,
//                 permissions: member.permissions || [],
//               });
//               setHasChanges(false);
//             }}
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
//       )}

//       <ConfirmDialog
//         visible={showRemoveDialog}
//         title="Remove Team Member"
//         message={`Are you sure you want to remove ${member.user?.firstName} ${member.user?.lastName} from the team?`}
//         confirmText="Remove"
//         cancelText="Cancel"
//         onConfirm={handleRemove}
//         onCancel={() => setShowRemoveDialog(false)}
//         destructive
//       />
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
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#1976d2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   avatarImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   avatarText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   email: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 10,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//     backgroundColor: '#999',
//   },
//   statusActive: {
//     backgroundColor: '#4caf50',
//   },
//   statusPending: {
//     backgroundColor: '#ff9800',
//   },
//   statusInactive: {
//     backgroundColor: '#f44336',
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#666',
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
//   roleInfo: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 15,
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
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   infoLabel: {
//     fontSize: 15,
//     color: '#666',
//   },
//   infoValue: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
//   dangerZone: {
//     marginTop: 10,
//     marginBottom: 20,
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
//     marginBottom: 8,
//   },
//   dangerDescription: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//     marginBottom: 15,
//   },
//   removeButton: {
//     backgroundColor: '#d32f2f',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   removeButtonText: {
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

























// app/(app)/business/[id]/team/[memberId].js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import FormSelect from '../../../../../../components/business/ui/FormSelect';
import MultiSelect from '../../../../../../components/business/ui/MultiSelect';
import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../../../components/common/Header';
import { TEAM_ROLES, PERMISSIONS } from '../../../../../../utils/constants';

export default function TeamMemberDetailScreen() {
  const { id, memberId } = useLocalSearchParams();
  const { teamMembers, loading, error, updateMember, removeMember, refetch } = useTeamMembers(id);
  const [saving, setSaving] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState(null);

  const member = teamMembers.find(m => m.user._id === memberId);

  useState(() => {
    if (member) {
      setFormData({
        role: member.role,
        permissions: member.permissions || [],
      });
    }
  }, [member]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMember(memberId, formData);
      setHasChanges(false);
      Alert.alert('Success', 'Team member updated successfully');
      refetch();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update team member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeMember(memberId);
      Alert.alert('Success', 'Team member removed successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove team member');
    }
  };

  const updateRole = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setHasChanges(true);
  };

  const updatePermissions = (permissions) => {
    setFormData(prev => ({ ...prev, permissions }));
    setHasChanges(true);
  };

  if (loading || !member || !formData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Header
        title={`${member.user?.firstName} ${member.user?.lastName}`}
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.content}>
          {/* Member Header */}
          <View style={styles.memberHeader}>
            <View style={styles.avatar}>
              {member.user?.avatar ? (
                <Image source={{ uri: member.user.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(member.user?.firstName, member.user?.lastName)}
                </Text>
              )}
            </View>
            <Text style={styles.name}>
              {member.user?.firstName} {member.user?.lastName}
            </Text>
            <Text style={styles.email}>{member.user?.email}</Text>
            
            <View style={styles.statusBadge}>
              <View style={[
                styles.statusDot,
                member.status === 'active' && styles.statusActive,
                member.status === 'pending' && styles.statusPending,
                member.status === 'inactive' && styles.statusInactive,
              ]} />
              <Text style={styles.statusText}>
                {member.status?.charAt(0).toUpperCase() + member.status?.slice(1)}
              </Text>
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role</Text>
            <FormSelect
              label=""
              value={formData.role}
              onSelect={updateRole}
              options={TEAM_ROLES}
              placeholder="Select role"
            />
            
            <View style={styles.roleInfo}>
              <Text style={styles.roleInfoTitle}>
                {formData.role === 'admin' && 'Administrator'}
                {formData.role === 'editor' && 'Editor'}
                {formData.role === 'viewer' && 'Viewer'}
              </Text>
              <Text style={styles.roleInfoDescription}>
                {formData.role === 'admin' && 'Full access to all features including team management, settings, and billing.'}
                {formData.role === 'editor' && 'Can create, edit, and schedule content. Cannot manage team members or change settings.'}
                {formData.role === 'viewer' && 'View-only access to content, analytics, and reports. Cannot make any changes.'}
              </Text>
            </View>
          </View>

          {/* Permissions */}
          {formData.role !== 'admin' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Custom Permissions</Text>
              <Text style={styles.sectionDescription}>
                Grant additional permissions beyond the default role capabilities
              </Text>
              
              <MultiSelect
                label=""
                value={formData.permissions}
                onSelect={updatePermissions}
                options={PERMISSIONS}
                placeholder="Select permissions"
              />
            </View>
          )}

          {/* Member Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Member Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined</Text>
              <Text style={styles.infoValue}>
                {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </Text>
            </View>
            
            {member.invitedBy && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Invited By</Text>
                <Text style={styles.infoValue}>Team Owner</Text>
              </View>
            )}
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Remove Team Member</Text>
            <Text style={styles.dangerDescription}>
              Removing this team member will revoke their access to this business.
              They will no longer be able to view or manage any content.
            </Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => setShowRemoveDialog(true)}
            >
              <Text style={styles.removeButtonText}>Remove Team Member</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setFormData({
                role: member.role,
                permissions: member.permissions || [],
              });
              setHasChanges(false);
            }}
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
      )}

      <ConfirmDialog
        visible={showRemoveDialog}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${member.user?.firstName} ${member.user?.lastName} from the team?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemove}
        onCancel={() => setShowRemoveDialog(false)}
        destructive
      />
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
  memberHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#999',
  },
  statusActive: {
    backgroundColor: '#4caf50',
  },
  statusPending: {
    backgroundColor: '#ff9800',
  },
  statusInactive: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
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
  roleInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  dangerZone: {
    marginTop: 10,
    marginBottom: 20,
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
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
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