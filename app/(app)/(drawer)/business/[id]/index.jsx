// // app/(app)/business/[id]/index.js
// import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useBusiness } from '../../../../../hooks/useBusiness';
// import { useBusinessStats } from '../../../../../hooks/businessHooks/useBusinessStats';
// import BusinessHeader from '../../../../../components/business/BusinessHeader';
// import BusinessStats from '../../../../../components/business/BusinessStats';
// import QuickActions from '../../../../../components/business/QuickActions';
// import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../components/business/ui/ErrorMessage';
// import { useBusinessStore } from '../../../../../stores/businessStore';

// export default function BusinessDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const { business, aiLearning, loading, error, refetch } = useBusiness(id);
//   const { stats, refetch: refetchStats } = useBusinessStats(id);
//   const { deleteBusiness } = useBusinessStore();

//   const handleEdit = () => {
//     router.push(`/business/${id}/edit`);
//   };

//   const handleDelete = async () => {
//     await deleteBusiness(id);
//     router.replace('/(business)');
//   };

//   const handleTeamPress = () => {
//     router.push(`/(business)/${id}/team`);
//   };

//   const handleBrandVoicePress = () => {
//     router.push(`/(business)/${id}/brand-voice`);
//   };

//   const handleTargetAudiencePress = () => {
//     router.push(`/(business)/${id}/target-audience`);
//   };

//   const handleCompetitorsPress = () => {
//     router.push(`/(business)/${id}/competitors`);
//   };

//   const handleSettingsPress = () => {
//     router.push(`/(business)/${id}/settings`);
//   };

//   const handleIntegrationsPress = () => {
//     router.push(`/(business)/${id}/integrations`);
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refetch} />;
//   }

//   return (
//     <ScrollView 
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={loading} onRefresh={() => {
//           refetch();
//           refetchStats();
//         }} />
//       }
//     >
//       <BusinessHeader 
//         business={business} 
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
      
//       <BusinessStats stats={stats} />
      
//       <QuickActions
//         onTeamPress={handleTeamPress}
//         onBrandVoicePress={handleBrandVoicePress}
//         onTargetAudiencePress={handleTargetAudiencePress}
//         onCompetitorsPress={handleCompetitorsPress}
//         onSettingsPress={handleSettingsPress}
//         onIntegrationsPress={handleIntegrationsPress}
//       />
      
//       {aiLearning && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>AI Insights</Text>
//           <AIInsightsCard aiLearning={aiLearning} />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   section: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
// });






















// app/(app)/business/[id]/index.js
import React from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
import { useBusinessStats } from '../../../../../hooks/businessHooks/useBusinessStats';
import BusinessHeader from '../../../../../components/business/BusinessHeader';
import BusinessStats from '../../../../../components/business/BusinessStats';
import QuickActions from '../../../../../components/business/QuickActions';
import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../components/business/ui/ErrorMessage';
import Header from '../../../../../components/common/Header';
import { useBusinessStore } from '../../../../../stores/businessStore';

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
            {/* <AIInsightsCard aiLearning={aiLearning} /> */}
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