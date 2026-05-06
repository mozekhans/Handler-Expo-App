// // app/(app)/business/[id]/integrations/index.js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import BusinessApi from '../../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import IntegrationCard from '../../../../../../components/business/IntegrationCard';
// import { INTEGRATION_TYPES, INTEGRATION_PROVIDERS } from '../../../../../../utils/constants';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export default function IntegrationsScreen() {
//   const { id } = useLocalSearchParams();
//   const queryClient = useQueryClient();
//   const [selectedType, setSelectedType] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['integrations', id],
//     queryFn: () => BusinessApi.getIntegrations(id),
//   });

//   const addIntegrationMutation = useMutation({
//     mutationFn: (integrationData) => BusinessApi.addIntegration(id, integrationData),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       setSelectedType(null);
//       Alert.alert('Success', 'Integration added successfully');
//     },
//   });

//   const syncMutation = useMutation({
//     mutationFn: (integrationId) => BusinessApi.syncIntegration(id, integrationId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       Alert.alert('Success', 'Integration synced successfully');
//     },
//   });

//   const removeMutation = useMutation({
//     mutationFn: (integrationId) => BusinessApi.removeIntegration(id, integrationId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['integrations', id]);
//       Alert.alert('Success', 'Integration removed successfully');
//     },
//   });

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     setRefreshing(false);
//   };

//   const handleAddIntegration = (type, provider) => {
//     addIntegrationMutation.mutate({
//       type,
//       provider,
//       config: {},
//     });
//   };

//   const handleSync = (integrationId) => {
//     syncMutation.mutate(integrationId);
//   };

//   const handleRemove = (integrationId) => {
//     Alert.alert(
//       'Remove Integration',
//       'Are you sure you want to remove this integration?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Remove', 
//           style: 'destructive',
//           onPress: () => removeMutation.mutate(integrationId)
//         },
//       ]
//     );
//   };

//   const handleConfigure = (integration) => {
//     router.push(`/business/${id}/integrations/${integration._id}`);
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error.message} onRetry={refetch} />;
//   }

//   const integrations = data?.integrations || [];

//   return (
//     <ScrollView 
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {/* Connected Integrations */}
//       {integrations.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Connected Integrations</Text>
//           {integrations.map((integration) => (
//             <IntegrationCard
//               key={integration._id}
//               integration={integration}
//               onSync={() => handleSync(integration._id)}
//               onConfigure={() => handleConfigure(integration)}
//               onRemove={() => handleRemove(integration._id)}
//             />
//           ))}
//         </View>
//       )}

//       {/* Available Integrations */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Available Integrations</Text>
//         <Text style={styles.sectionDescription}>
//           Connect your business with external services to enhance your social media management
//         </Text>

//         {INTEGRATION_TYPES.map((type) => (
//           <View key={type.value} style={styles.integrationType}>
//             <TouchableOpacity
//               style={styles.typeHeader}
//               onPress={() => setSelectedType(
//                 selectedType === type.value ? null : type.value
//               )}
//             >
//               <View style={styles.typeInfo}>
//                 <Ionicons 
//                   name={getTypeIcon(type.value)} 
//                   size={24} 
//                   color="#1976d2" 
//                 />
//                 <Text style={styles.typeLabel}>{type.label}</Text>
//               </View>
//               <Ionicons 
//                 name={selectedType === type.value ? 'chevron-up' : 'chevron-down'} 
//                 size={20} 
//                 color="#666" 
//               />
//             </TouchableOpacity>

//             {selectedType === type.value && (
//               <View style={styles.providersList}>
//                 {INTEGRATION_PROVIDERS[type.value]?.map((provider) => {
//                   const isConnected = integrations.some(
//                     i => i.type === type.value && i.provider === provider.value
//                   );
                  
//                   return (
//                     <TouchableOpacity
//                       key={provider.value}
//                       style={[
//                         styles.providerItem,
//                         isConnected && styles.providerItemConnected
//                       ]}
//                       onPress={() => !isConnected && handleAddIntegration(type.value, provider.value)}
//                       disabled={isConnected}
//                     >
//                       <Text style={styles.providerName}>{provider.label}</Text>
//                       {isConnected ? (
//                         <View style={styles.connectedBadge}>
//                           <Text style={styles.connectedText}>Connected</Text>
//                         </View>
//                       ) : (
//                         <Text style={styles.connectText}>Connect</Text>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             )}
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const getTypeIcon = (type) => {
//   const icons = {
//     social: 'share-social',
//     crm: 'people',
//     ecommerce: 'cart',
//     analytics: 'bar-chart',
//     email: 'mail',
//     support: 'headset',
//     payment: 'card',
//   };
//   return icons[type] || 'apps';
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   section: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginBottom: 10,
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
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   integrationType: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   typeHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#fafafa',
//   },
//   typeInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   typeLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginLeft: 12,
//   },
//   providersList: {
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   providerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#fff',
//   },
//   providerItemConnected: {
//     backgroundColor: '#f9f9f9',
//   },
//   providerName: {
//     fontSize: 15,
//     color: '#333',
//   },
//   connectText: {
//     color: '#1976d2',
//     fontWeight: '500',
//   },
//   connectedBadge: {
//     backgroundColor: '#e8f5e9',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   connectedText: {
//     fontSize: 12,
//     color: '#2e7d32',
//     fontWeight: '500',
//   },
// });
















// app/(app)/business/[id]/integrations/index.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BusinessApi from '../../../../../../services/businessApi';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import IntegrationCard from '../../../../../../components/business/IntegrationCard';
import Header from '../../../../../../components/common/Header';
import { INTEGRATION_TYPES, INTEGRATION_PROVIDERS } from '../../../../../../utils/constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function IntegrationsScreen() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['integrations', id],
    queryFn: () => BusinessApi.getIntegrations(id),
  });

  const addIntegrationMutation = useMutation({
    mutationFn: (integrationData) => BusinessApi.addIntegration(id, integrationData),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      setSelectedType(null);
      Alert.alert('Success', 'Integration added successfully');
    },
  });

  const syncMutation = useMutation({
    mutationFn: (integrationId) => BusinessApi.syncIntegration(id, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      Alert.alert('Success', 'Integration synced successfully');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (integrationId) => BusinessApi.removeIntegration(id, integrationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations', id]);
      Alert.alert('Success', 'Integration removed successfully');
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddIntegration = (type, provider) => {
    addIntegrationMutation.mutate({
      type,
      provider,
      config: {},
    });
  };

  const handleSync = (integrationId) => {
    syncMutation.mutate(integrationId);
  };

  const handleRemove = (integrationId) => {
    Alert.alert(
      'Remove Integration',
      'Are you sure you want to remove this integration?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeMutation.mutate(integrationId)
        },
      ]
    );
  };

  const handleConfigure = (integration) => {
    router.push(`/business/${id}/integrations/${integration._id}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  const integrations = data?.integrations || [];

  const getTypeIcon = (type) => {
    const icons = {
      social: 'share-social',
      crm: 'people',
      ecommerce: 'cart',
      analytics: 'bar-chart',
      email: 'mail',
      support: 'headset',
      payment: 'card',
    };
    return icons[type] || 'apps';
  };

  return (
    <View style={styles.container}>
      <Header
        title="Integrations"
        showBack={true}
      />
      
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Connected Integrations */}
        {integrations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Integrations</Text>
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration._id}
                integration={integration}
                onSync={() => handleSync(integration._id)}
                onConfigure={() => handleConfigure(integration)}
                onRemove={() => handleRemove(integration._id)}
              />
            ))}
          </View>
        )}

        {/* Available Integrations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Integrations</Text>
          <Text style={styles.sectionDescription}>
            Connect your business with external services to enhance your social media management
          </Text>

          {INTEGRATION_TYPES.map((type) => (
            <View key={type.value} style={styles.integrationType}>
              <TouchableOpacity
                style={styles.typeHeader}
                onPress={() => setSelectedType(
                  selectedType === type.value ? null : type.value
                )}
              >
                <View style={styles.typeInfo}>
                  <Ionicons 
                    name={getTypeIcon(type.value)} 
                    size={24} 
                    color="#1976d2" 
                  />
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </View>
                <Ionicons 
                  name={selectedType === type.value ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>

              {selectedType === type.value && (
                <View style={styles.providersList}>
                  {INTEGRATION_PROVIDERS[type.value]?.map((provider) => {
                    const isConnected = integrations.some(
                      i => i.type === type.value && i.provider === provider.value
                    );
                    
                    return (
                      <TouchableOpacity
                        key={provider.value}
                        style={[
                          styles.providerItem,
                          isConnected && styles.providerItemConnected
                        ]}
                        onPress={() => !isConnected && handleAddIntegration(type.value, provider.value)}
                        disabled={isConnected}
                      >
                        <Text style={styles.providerName}>{provider.label}</Text>
                        {isConnected ? (
                          <View style={styles.connectedBadge}>
                            <Text style={styles.connectedText}>Connected</Text>
                          </View>
                        ) : (
                          <Text style={styles.connectText}>Connect</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  integrationType: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fafafa',
  },
  typeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  providersList: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  providerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  providerItemConnected: {
    backgroundColor: '#f9f9f9',
  },
  providerName: {
    fontSize: 15,
    color: '#333',
  },
  connectText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  connectedBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
});