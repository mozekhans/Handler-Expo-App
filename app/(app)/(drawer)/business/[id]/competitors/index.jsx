// // app/(app)/business/[id]/competitors/index.js
// import { useState } from 'react';
// import {
//   View,
//   FlatList,
//   StyleSheet,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useCompetitors } from '../../../../../../hooks/businessHooks/useCompetitors';
// import CompetitorCard from '../../../../../../components/business/CompetitorCard';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import EmptyState from '../../../../../../components/business/ui/EmptyState';
// import { FAB } from '../../../../../../components/business/ui/FAB';
// import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
// import SearchBar from '../../../../../../components/business/ui/SearchBar';

// export default function CompetitorsScreen() {
//   const { id } = useLocalSearchParams();
//   const { 
//     competitors, 
//     loading, 
//     error, 
//     removeCompetitor, 
//     refetch 
//   } = useCompetitors(id);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCompetitor, setSelectedCompetitor] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

//   const filteredCompetitors = competitors.filter(competitor =>
//     competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     competitor.industry?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAddCompetitor = () => {
//     router.push(`/business/${id}/competitors/add`);
//   };

//   const handleCompetitorPress = (competitor) => {
//     router.push(`/business/${id}/competitors/${competitor._id}`);
//   };

//   const handleRemoveCompetitor = (competitor) => {
//     setSelectedCompetitor(competitor);
//     setShowConfirmDialog(true);
//   };

//   const confirmRemoveCompetitor = async () => {
//     if (!selectedCompetitor) return;
    
//     try {
//       await removeCompetitor(selectedCompetitor._id);
//       setShowConfirmDialog(false);
//       setSelectedCompetitor(null);
//       Alert.alert('Success', 'Competitor removed successfully');
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to remove competitor');
//     }
//   };

//   if (loading && competitors.length === 0) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refetch} />;
//   }

//   return (
//     <View style={styles.container}>
//       <SearchBar
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholder="Search competitors..."
//       />
      
//       <FlatList
//         data={filteredCompetitors}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <CompetitorCard
//             competitor={item}
//             onPress={() => handleCompetitorPress(item)}
//             onRemove={() => handleRemoveCompetitor(item)}
//           />
//         )}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={refetch} />
//         }
//         ListEmptyComponent={
//           <EmptyState
//             icon="business-outline"
//             title="No Competitors"
//             message="Add competitors to track their social media performance and gain competitive insights"
//             actionLabel="Add Competitor"
//             onAction={handleAddCompetitor}
//           />
//         }
//       />
      
//       <FAB icon="add" onPress={handleAddCompetitor} />

//       <ConfirmDialog
//         visible={showConfirmDialog}
//         title="Remove Competitor"
//         message={`Are you sure you want to remove ${selectedCompetitor?.name}?`}
//         confirmText="Remove"
//         cancelText="Cancel"
//         onConfirm={confirmRemoveCompetitor}
//         onCancel={() => {
//           setShowConfirmDialog(false);
//           setSelectedCompetitor(null);
//         }}
//         destructive
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   listContent: {
//     padding: 16,
//     flexGrow: 1,
//   },
// });























// app/(app)/business/[id]/competitors/index.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCompetitors } from '../../../../../../hooks/businessHooks/useCompetitors';
import CompetitorCard from '../../../../../../components/business/CompetitorCard';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import EmptyState from '../../../../../../components/business/ui/EmptyState';
import { FAB } from '../../../../../../components/business/ui/FAB';
import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
import SearchBar from '../../../../../../components/business/ui/SearchBar';
import Header from '../../../../../../components/common/Header';

export default function CompetitorsScreen() {
  const { id } = useLocalSearchParams();
  const { 
    competitors, 
    loading, 
    error, 
    removeCompetitor, 
    refetch 
  } = useCompetitors(id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompetitor = () => {
    router.push(`/business/${id}/competitors/add`);
  };

  const handleCompetitorPress = (competitor) => {
    router.push(`/business/${id}/competitors/${competitor._id}`);
  };

  const handleRemoveCompetitor = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowConfirmDialog(true);
  };

  const confirmRemoveCompetitor = async () => {
    if (!selectedCompetitor) return;
    
    try {
      await removeCompetitor(selectedCompetitor._id);
      setShowConfirmDialog(false);
      setSelectedCompetitor(null);
      Alert.alert('Success', 'Competitor removed successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove competitor');
    }
  };

  if (loading && competitors.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Competitors"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleAddCompetitor}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search competitors..."
      />
      
      <FlatList
        data={filteredCompetitors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CompetitorCard
            competitor={item}
            onPress={() => handleCompetitorPress(item)}
            onRemove={() => handleRemoveCompetitor(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="business-outline"
            title="No Competitors"
            message="Add competitors to track their social media performance and gain competitive insights"
            actionLabel="Add Competitor"
            onAction={handleAddCompetitor}
          />
        }
      />
      
      <FAB icon="add" onPress={handleAddCompetitor} />

      <ConfirmDialog
        visible={showConfirmDialog}
        title="Remove Competitor"
        message={`Are you sure you want to remove ${selectedCompetitor?.name}?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveCompetitor}
        onCancel={() => {
          setShowConfirmDialog(false);
          setSelectedCompetitor(null);
        }}
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});