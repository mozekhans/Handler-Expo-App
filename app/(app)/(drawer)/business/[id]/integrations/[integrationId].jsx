// // app/(app)/business/[id]/integrations/[integrationId].js
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
// import BusinessApi from '../../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import FormInput from '../../../../../../components/business/ui/FormInput';
// import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
// import { formatDateTime } from '../../../../../../utils/formatters';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export default function IntegrationDetailScreen() {
//   const { id, integrationId } = useLocalSearchParams();
//   const queryClient = useQueryClient();
//   const [hasChanges, setHasChanges] = useState(false);
//   const [configForm, setConfigForm] = useState({});
//   const [showRemoveDialog, setShowRemoveDialog] = useState(false);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['integrations', id],
//     queryFn: () => BusinessApi.getIntegrations(id),
//   });

//   const integration = data?.integrations?.find(i => i._id === integrationId);

//   const updateMutation = useMutation({
//     mutationFn: (data) => BusinessApi.updateIntegration(id, integrationId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       setHasChanges(false);
//       Alert.alert('Success', 'Integration updated successfully');
//     },
//   });

//   const syncMutation = useMutation({
//     mutationFn: () => BusinessApi.syncIntegration(id, integrationId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       Alert.alert('Success', 'Integration synced successfully');
//     },
//   });

//   const removeMutation = useMutation({
//     mutationFn: () => BusinessApi.removeIntegration(id, integrationId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       router.back();
//     },
//   });

//   const handleSave = async () => {
//     try {
//       await updateMutation.mutateAsync({ config: configForm });
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to update integration');
//     }
//   };

//   const handleSync = async () => {
//     try {
//       await syncMutation.mutateAsync();
//       refetch();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to sync integration');
//     }
//   };

//   const handleRemove = async () => {
//     try {
//       await removeMutation.mutateAsync();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to remove integration');
//     }
//   };

//   const updateConfig = (key, value) => {
//     setConfigForm(prev => ({ ...prev, [key]: value }));
//     setHasChanges(true);
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error || !integration) {
//     return <ErrorMessage message={error?.message || 'Integration not found'} onRetry={refetch} />;
//   }

//   const getIntegrationIcon = (type) => {
//     const icons = {
//       social: 'share-social',
//       crm: 'people',
//       ecommerce: 'cart',
//       analytics: 'bar-chart',
//       email: 'mail',
//       support: 'headset',
//     };
//     return icons[type] || 'apps';
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Integration Header */}
//         <View style={styles.header}>
//           <View style={styles.iconContainer}>
//             <Ionicons name={getIntegrationIcon(integration.type)} size={32} color="#1976d2" />
//           </View>
//           <Text style={styles.providerName}>
//             {integration.provider.split('_').map(word => 
//               word.charAt(0).toUpperCase() + word.slice(1)
//             ).join(' ')}
//           </Text>
//           <Text style={styles.typeLabel}>{integration.type.toUpperCase()}</Text>
          
//           <View style={styles.statusContainer}>
//             <View style={[
//               styles.statusBadge,
//               integration.status === 'active' && styles.statusActive,
//               integration.status === 'error' && styles.statusError,
//             ]}>
//               <Text style={styles.statusText}>
//                 {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Sync Status */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Sync Status</Text>
          
//           <View style={styles.syncCard}>
//             <View style={styles.syncInfo}>
//               <Text style={styles.syncLabel}>Last Synced</Text>
//               <Text style={styles.syncValue}>
//                 {integration.lastSync ? formatDateTime(integration.lastSync) : 'Never'}
//               </Text>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.syncButton}
//               onPress={handleSync}
//               disabled={syncMutation.isLoading}
//             >
//               {syncMutation.isLoading ? (
//                 <LoadingSpinner size="small" color="#fff" />
//               ) : (
//                 <>
//                   <Ionicons name="sync" size={18} color="#fff" />
//                   <Text style={styles.syncButtonText}>Sync Now</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>

//           {integration.error && (
//             <View style={styles.errorCard}>
//               <Ionicons name="warning" size={20} color="#d32f2f" />
//               <Text style={styles.errorText}>{integration.error}</Text>
//             </View>
//           )}
//         </View>

//         {/* Configuration */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Configuration</Text>
          
//           {integration.type === 'social' && (
//             <>
//               <FormInput
//                 label="Page ID"
//                 value={configForm.pageId || integration.config?.pageId || ''}
//                 onChangeText={(value) => updateConfig('pageId', value)}
//                 placeholder="Enter page ID"
//               />
//               <FormInput
//                 label="Access Token"
//                 value={configForm.accessToken || integration.config?.accessToken || ''}
//                 onChangeText={(value) => updateConfig('accessToken', value)}
//                 placeholder="Enter access token"
//                 secureTextEntry
//               />
//             </>
//           )}

//           {integration.type === 'crm' && (
//             <>
//               <FormInput
//                 label="API Key"
//                 value={configForm.apiKey || integration.config?.apiKey || ''}
//                 onChangeText={(value) => updateConfig('apiKey', value)}
//                 placeholder="Enter API key"
//                 secureTextEntry
//               />
//               <FormInput
//                 label="Instance URL"
//                 value={configForm.instanceUrl || integration.config?.instanceUrl || ''}
//                 onChangeText={(value) => updateConfig('instanceUrl', value)}
//                 placeholder="https://instance.salesforce.com"
//                 autoCapitalize="none"
//               />
//             </>
//           )}

//           {integration.type === 'ecommerce' && (
//             <>
//               <FormInput
//                 label="Store URL"
//                 value={configForm.storeUrl || integration.config?.storeUrl || ''}
//                 onChangeText={(value) => updateConfig('storeUrl', value)}
//                 placeholder="https://store.myshopify.com"
//                 autoCapitalize="none"
//               />
//               <FormInput
//                 label="Access Token"
//                 value={configForm.accessToken || integration.config?.accessToken || ''}
//                 onChangeText={(value) => updateConfig('accessToken', value)}
//                 placeholder="Enter access token"
//                 secureTextEntry
//               />
//             </>
//           )}

//           {integration.type === 'analytics' && (
//             <>
//               <FormInput
//                 label="Tracking ID"
//                 value={configForm.trackingId || integration.config?.trackingId || ''}
//                 onChangeText={(value) => updateConfig('trackingId', value)}
//                 placeholder="UA-XXXXXXXXX-X"
//               />
//               <FormInput
//                 label="View ID"
//                 value={configForm.viewId || integration.config?.viewId || ''}
//                 onChangeText={(value) => updateConfig('viewId', value)}
//                 placeholder="Enter view ID"
//               />
//             </>
//           )}

//           {integration.type === 'email' && (
//             <>
//               <FormInput
//                 label="API Key"
//                 value={configForm.apiKey || integration.config?.apiKey || ''}
//                 onChangeText={(value) => updateConfig('apiKey', value)}
//                 placeholder="Enter API key"
//                 secureTextEntry
//               />
//               <FormInput
//                 label="List ID"
//                 value={configForm.listId || integration.config?.listId || ''}
//                 onChangeText={(value) => updateConfig('listId', value)}
//                 placeholder="Enter list ID"
//               />
//             </>
//           )}
//         </View>

//         {/* Danger Zone */}
//         <View style={styles.dangerZone}>
//           <Text style={styles.dangerTitle}>Remove Integration</Text>
//           <Text style={styles.dangerDescription}>
//             Removing this integration will disconnect it from your business.
//             Any synced data will be preserved but no new data will be imported.
//           </Text>
//           <TouchableOpacity 
//             style={styles.removeButton}
//             onPress={() => setShowRemoveDialog(true)}
//           >
//             <Text style={styles.removeButtonText}>Remove Integration</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {hasChanges && (
//         <View style={styles.footer}>
//           <TouchableOpacity 
//             style={styles.cancelButton}
//             onPress={() => {
//               setConfigForm({});
//               setHasChanges(false);
//             }}
//           >
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

//       <ConfirmDialog
//         visible={showRemoveDialog}
//         title="Remove Integration"
//         message="Are you sure you want to remove this integration? This action cannot be undone."
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
//   iconContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#e3f2fd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   providerName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   typeLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   statusActive: {
//     backgroundColor: '#e8f5e9',
//   },
//   statusError: {
//     backgroundColor: '#ffebee',
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
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
//   syncCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   syncInfo: {
//     flex: 1,
//   },
//   syncLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   syncValue: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   syncButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1976d2',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   syncButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   errorCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffebee',
//     padding: 12,
//     borderRadius: 8,
//   },
//   errorText: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#d32f2f',
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


























// app/(app)/business/[id]/integrations/[integrationId].js
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
import { Ionicons } from '@expo/vector-icons';
import BusinessApi from '../../../../../../services/businessApi';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import FormInput from '../../../../../../components/business/ui/FormInput';
import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../../../components/common/Header';
import { formatDateTime } from '../../../../../../utils/formatters';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function IntegrationDetailScreen() {
  const { id, integrationId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [hasChanges, setHasChanges] = useState(false);
  const [configForm, setConfigForm] = useState({});
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['integrations', id],
    queryFn: () => BusinessApi.getIntegrations(id),
  });

  const integration = data?.integrations?.find(i => i._id === integrationId);

  const updateMutation = useMutation({
    mutationFn: (data) => BusinessApi.updateIntegration(id, integrationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      setHasChanges(false);
      Alert.alert('Success', 'Integration updated successfully');
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => BusinessApi.syncIntegration(id, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      Alert.alert('Success', 'Integration synced successfully');
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => BusinessApi.removeIntegration(id, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      router.back();
    },
  });

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ config: configForm });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update integration');
    }
  };

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      refetch();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sync integration');
    }
  };

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove integration');
    }
  };

  const updateConfig = (key, value) => {
    setConfigForm(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !integration) {
    return <ErrorMessage message={error?.message || 'Integration not found'} onRetry={refetch} />;
  }

  const getIntegrationIcon = (type) => {
    const icons = {
      social: 'share-social',
      crm: 'people',
      ecommerce: 'cart',
      analytics: 'bar-chart',
      email: 'mail',
      support: 'headset',
    };
    return icons[type] || 'apps';
  };

  return (
    <View style={styles.container}>
      <Header
        title="Integration Settings"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.content}>
          {/* Integration Header */}
          <View style={styles.integrationHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={getIntegrationIcon(integration.type)} size={32} color="#1976d2" />
            </View>
            <Text style={styles.providerName}>
              {integration.provider.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
            <Text style={styles.typeLabel}>{integration.type.toUpperCase()}</Text>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                integration.status === 'active' && styles.statusActive,
                integration.status === 'error' && styles.statusError,
              ]}>
                <Text style={styles.statusText}>
                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Sync Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sync Status</Text>
            
            <View style={styles.syncCard}>
              <View style={styles.syncInfo}>
                <Text style={styles.syncLabel}>Last Synced</Text>
                <Text style={styles.syncValue}>
                  {integration.lastSync ? formatDateTime(integration.lastSync) : 'Never'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.syncButton}
                onPress={handleSync}
                disabled={syncMutation.isLoading}
              >
                {syncMutation.isLoading ? (
                  <LoadingSpinner size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="sync" size={18} color="#fff" />
                    <Text style={styles.syncButtonText}>Sync Now</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {integration.error && (
              <View style={styles.errorCard}>
                <Ionicons name="warning" size={20} color="#d32f2f" />
                <Text style={styles.errorText}>{integration.error}</Text>
              </View>
            )}
          </View>

          {/* Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration</Text>
            
            {integration.type === 'social' && (
              <>
                <FormInput
                  label="Page ID"
                  value={configForm.pageId || integration.config?.pageId || ''}
                  onChangeText={(value) => updateConfig('pageId', value)}
                  placeholder="Enter page ID"
                />
                <FormInput
                  label="Access Token"
                  value={configForm.accessToken || integration.config?.accessToken || ''}
                  onChangeText={(value) => updateConfig('accessToken', value)}
                  placeholder="Enter access token"
                  secureTextEntry
                />
              </>
            )}

            {integration.type === 'crm' && (
              <>
                <FormInput
                  label="API Key"
                  value={configForm.apiKey || integration.config?.apiKey || ''}
                  onChangeText={(value) => updateConfig('apiKey', value)}
                  placeholder="Enter API key"
                  secureTextEntry
                />
                <FormInput
                  label="Instance URL"
                  value={configForm.instanceUrl || integration.config?.instanceUrl || ''}
                  onChangeText={(value) => updateConfig('instanceUrl', value)}
                  placeholder="https://instance.salesforce.com"
                  autoCapitalize="none"
                />
              </>
            )}

            {integration.type === 'ecommerce' && (
              <>
                <FormInput
                  label="Store URL"
                  value={configForm.storeUrl || integration.config?.storeUrl || ''}
                  onChangeText={(value) => updateConfig('storeUrl', value)}
                  placeholder="https://store.myshopify.com"
                  autoCapitalize="none"
                />
                <FormInput
                  label="Access Token"
                  value={configForm.accessToken || integration.config?.accessToken || ''}
                  onChangeText={(value) => updateConfig('accessToken', value)}
                  placeholder="Enter access token"
                  secureTextEntry
                />
              </>
            )}

            {integration.type === 'analytics' && (
              <>
                <FormInput
                  label="Tracking ID"
                  value={configForm.trackingId || integration.config?.trackingId || ''}
                  onChangeText={(value) => updateConfig('trackingId', value)}
                  placeholder="UA-XXXXXXXXX-X"
                />
                <FormInput
                  label="View ID"
                  value={configForm.viewId || integration.config?.viewId || ''}
                  onChangeText={(value) => updateConfig('viewId', value)}
                  placeholder="Enter view ID"
                />
              </>
            )}

            {integration.type === 'email' && (
              <>
                <FormInput
                  label="API Key"
                  value={configForm.apiKey || integration.config?.apiKey || ''}
                  onChangeText={(value) => updateConfig('apiKey', value)}
                  placeholder="Enter API key"
                  secureTextEntry
                />
                <FormInput
                  label="List ID"
                  value={configForm.listId || integration.config?.listId || ''}
                  onChangeText={(value) => updateConfig('listId', value)}
                  placeholder="Enter list ID"
                />
              </>
            )}
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Remove Integration</Text>
            <Text style={styles.dangerDescription}>
              Removing this integration will disconnect it from your business.
              Any synced data will be preserved but no new data will be imported.
            </Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => setShowRemoveDialog(true)}
            >
              <Text style={styles.removeButtonText}>Remove Integration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setConfigForm({});
              setHasChanges(false);
            }}
          >
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

      <ConfirmDialog
        visible={showRemoveDialog}
        title="Remove Integration"
        message="Are you sure you want to remove this integration? This action cannot be undone."
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
  integrationHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  providerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  statusActive: {
    backgroundColor: '#e8f5e9',
  },
  statusError: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
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
  syncCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  syncInfo: {
    flex: 1,
  },
  syncLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  syncValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#d32f2f',
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