// // frontend/app/(business)/select.js
// import { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { router, useFocusEffect } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useBusiness } from '../../hooks/useBusiness';
// import { theme } from '../../styles/theme';

// // Industry mapping for display
// const getIndustryLabel = (industryValue) => {
//   const industryMap = {
//     'technology': 'Technology',
//     'software': 'Software',
//     'ecommerce': 'E-commerce',
//     'retail': 'Retail',
//     'fashion': 'Fashion',
//     'beauty': 'Beauty',
//     'food_beverage': 'Food & Beverage',
//     'travel': 'Travel',
//     'hospitality': 'Hospitality',
//     'healthcare': 'Healthcare',
//     'fitness': 'Fitness',
//     'education': 'Education',
//     'finance': 'Finance',
//     'real_estate': 'Real Estate',
//     'automotive': 'Automotive',
//     'entertainment': 'Entertainment',
//     'media': 'Media',
//     'nonprofit': 'Nonprofit',
//     'professional_services': 'Professional Services',
//     'manufacturing': 'Manufacturing',
//     'construction': 'Construction',
//     'agriculture': 'Agriculture',
//     'energy': 'Energy',
//     'telecommunications': 'Telecommunications',
//     'transportation': 'Transportation',
//     'other': 'Other',
//   };
//   return industryMap[industryValue] || industryValue || 'Unknown';
// };

// export default function BusinessSelectScreen() {
//   const [refreshing, setRefreshing] = useState(false);
//   const { businesses, loading, loadBusinesses, switchBusiness, currentBusiness } = useBusiness();

//   const loadData = async () => {
//     await loadBusinesses();
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadData();
//     }, [])
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const handleSelectBusiness = async (business) => {
//     try {
//       const result = await switchBusiness(business._id);
      
//       if (result.success) {
//         router.replace('/(app)');
//       } else {
//         Alert.alert('Error', result.error || 'Failed to switch business');
//       }
//     } catch (error) {
//       console.error('Switch business error:', error);
//       Alert.alert('Error', 'Failed to switch business');
//     }
//   };

//   const renderBusinessItem = ({ item }) => {
//     const isCurrent = currentBusiness?._id === item._id;
//     const industryLabel = getIndustryLabel(item.industry);
    
//     return (
//       <TouchableOpacity
//         style={[styles.businessCard, isCurrent && styles.currentBusinessCard]}
//         onPress={() => handleSelectBusiness(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.businessIcon}>
//           <Ionicons name="business-outline" size={32} color={theme.colors.primary} />
//         </View>
//         <View style={styles.businessInfo}>
//           <View style={styles.businessHeader}>
//             <Text style={styles.businessName}>{item.name}</Text>
//             {isCurrent && (
//               <View style={styles.currentBadge}>
//                 <Text style={styles.currentBadgeText}>Current</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.businessIndustry}>{industryLabel}</Text>
//           {item.description ? (
//             <Text style={styles.businessDescription} numberOfLines={1}>
//               {item.description}
//             </Text>
//           ) : null}
//         </View>
//         <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
//       </TouchableOpacity>
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Select Business</Text>
//         <Text style={styles.subtitle}>Choose a business to manage</Text>
//       </View>

//       {businesses.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyIconContainer}>
//             <Ionicons name="business-outline" size={80} color={theme.colors.textSecondary} />
//           </View>
//           <Text style={styles.emptyTitle}>No Businesses Yet</Text>
//           <Text style={styles.emptyText}>
//             Create your first business to start managing social media content, tracking analytics, and more.
//           </Text>
//           <TouchableOpacity
//             style={styles.createButton}
//             onPress={() => router.push('/(business)/create')}
//           >
//             <Ionicons name="add-circle-outline" size={20} color="#fff" />
//             <Text style={styles.createButtonText}>Create Business</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={businesses}
//             renderItem={renderBusinessItem}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={styles.listContainer}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
//             }
//             showsVerticalScrollIndicator={false}
//           />

//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => router.push('/(business)/create')}
//           >
//             <Ionicons name="add" size={24} color="#fff" />
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background,
//   },
//   header: {
//     padding: 20,
//     paddingTop: 60,
//     paddingBottom: 16,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: theme.colors.textSecondary,
//   },
//   listContainer: {
//     padding: 20,
//     paddingTop: 0,
//   },
//   businessCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.surface,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   currentBusinessCard: {
//     borderColor: theme.colors.primary,
//     borderWidth: 2,
//     backgroundColor: theme.colors.primary + '08',
//   },
//   businessIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: theme.colors.primary + '15',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   businessInfo: {
//     flex: 1,
//   },
//   businessHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   businessName: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginRight: 8,
//   },
//   currentBadge: {
//     backgroundColor: theme.colors.primary + '20',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//   },
//   currentBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: theme.colors.primary,
//   },
//   businessIndustry: {
//     fontSize: 13,
//     color: theme.colors.textSecondary,
//     marginBottom: 2,
//   },
//   businessDescription: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: theme.colors.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//     marginBottom: 12,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: theme.colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   createButton: {
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: theme.colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 5,
//   },
// });
































// app/(app)/business/select.js
// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useBusinessList } from '../../../../hooks/businessHooks/useBusinessList';
// import { useBusinessStore } from '../../../../stores/businessStore';
// import BusinessCard from '../../../../components/business/BusinessCard';
// import LoadingSpinner from '../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../components/business/ui/ErrorMessage';
// import EmptyState from '../../../../components/business/ui/EmptyState';
// import ConfirmDialog from '../../../../components/business/ui/ConfirmDialog';

// const BusinessSelectScreen = () => {
//   const { returnTo } = useLocalSearchParams();
//   const { 
//     businesses, 
//     loading, 
//     refreshing, 
//     error, 
//     searchQuery,
//     filterIndustry,
//     sortBy,
//     sortOrder,
//     setSearchQuery,
//     setFilterIndustry,
//     setSortBy,
//     setSortOrder,
//     refresh,
//     switchBusiness,
//     getBusinessStats,
//   } = useBusinessList();
  
//   const { currentBusiness } = useBusinessStore();
//   const [switchingBusinessId, setSwitchingBusinessId] = useState(null);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showSortModal, setShowSortModal] = useState(false);
//   const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);

//   const stats = getBusinessStats();

//   const industries = useMemo(() => {
//     const uniqueIndustries = [...new Set(businesses.map(b => b.industry).filter(Boolean))];
//     return uniqueIndustries.map(industry => ({
//       label: industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
//       value: industry,
//     }));
//   }, [businesses]);

//   const sortOptions = [
//     { label: 'Business Name', value: 'name' },
//     { label: 'Industry', value: 'industry' },
//     { label: 'Team Size', value: 'teamMembers' },
//     { label: 'Followers', value: 'stats.followers' },
//     { label: 'Created Date', value: 'createdAt' },
//   ];

//   const handleSwitchBusiness = async (business) => {
//     if (currentBusiness?._id === business._id) {
//       Alert.alert('Already Selected', `${business.name} is already your current business.`);
//       return;
//     }
    
//     setSelectedBusiness(business);
//     setShowSwitchConfirm(true);
//   };

//   const confirmSwitchBusiness = async () => {
//     if (!selectedBusiness) return;
    
//     try {
//       setSwitchingBusinessId(selectedBusiness._id);
//       const result = await switchBusiness(selectedBusiness._id);
      
//       if (result.success) {
//         Alert.alert(
//           'Business Switched',
//           `You are now managing ${selectedBusiness.name}`,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 if (returnTo) {
//                   router.back();
//                 } else {
//                   router.replace('/(app)');
//                 }
//               },
//             },
//           ]
//         );
//       } else {
//         Alert.alert('Switch Failed', result.error || 'Failed to switch business');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An unexpected error occurred');
//     } finally {
//       setSwitchingBusinessId(null);
//       setShowSwitchConfirm(false);
//       setSelectedBusiness(null);
//     }
//   };

//   const handleCreateBusiness = () => {
//     router.push('/business/create');
//   };

//   const handleBusinessPress = (business) => {
//     router.push(`/business/${business._id}`);
//   };

//   const clearFilters = () => {
//     setFilterIndustry(null);
//     setSearchQuery('');
//   };

//   const hasActiveFilters = filterIndustry || searchQuery;

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Switch Business</Text>
//         <TouchableOpacity onPress={handleCreateBusiness} style={styles.addButton}>
//           <Ionicons name="add-circle-outline" size={24} color="#1976d2" />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Summary */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{stats.total}</Text>
//           <Text style={styles.statLabel}>Total</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{stats.industries}</Text>
//           <Text style={styles.statLabel}>Industries</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{stats.totalTeamMembers}</Text>
//           <Text style={styles.statLabel}>Team</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>
//             {stats.totalFollowers >= 1000 
//               ? `${(stats.totalFollowers / 1000).toFixed(1)}K` 
//               : stats.totalFollowers}
//           </Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </View>
//       </View>

//       {/* Search and Filter Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputWrapper}>
//           <Ionicons name="search" size={18} color="#999" />
//           <TextInput
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholder="Search businesses..."
//             placeholderTextColor="#999"
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Ionicons name="close-circle" size={18} color="#999" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <View style={styles.filterActions}>
//           <TouchableOpacity
//             style={[styles.filterButton, filterIndustry && styles.filterButtonActive]}
//             onPress={() => setShowFilterModal(true)}
//           >
//             <Ionicons 
//               name="filter" 
//               size={18} 
//               color={filterIndustry ? '#fff' : '#666'} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.filterButton}
//             onPress={() => setShowSortModal(true)}
//           >
//             <Ionicons name="swap-vertical" size={18} color="#666" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Active Filters */}
//       {hasActiveFilters && (
//         <View style={styles.activeFilters}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {filterIndustry && (
//               <TouchableOpacity
//                 style={styles.filterChip}
//                 onPress={() => setFilterIndustry(null)}
//               >
//                 <Text style={styles.filterChipText}>
//                   {industries.find(i => i.value === filterIndustry)?.label}
//                 </Text>
//                 <Ionicons name="close-circle" size={16} color="#666" />
//               </TouchableOpacity>
//             )}
//             {searchQuery && (
//               <TouchableOpacity
//                 style={styles.filterChip}
//                 onPress={() => setSearchQuery('')}
//               >
//                 <Text style={styles.filterChipText}>Search: {searchQuery}</Text>
//                 <Ionicons name="close-circle" size={16} color="#666" />
//               </TouchableOpacity>
//             )}
//           </ScrollView>
//           <TouchableOpacity onPress={clearFilters}>
//             <Text style={styles.clearFiltersText}>Clear all</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Current Business Indicator */}
//       {currentBusiness && (
//         <View style={styles.currentBusinessBanner}>
//           <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
//           <Text style={styles.currentBusinessText}>
//             Current: <Text style={styles.currentBusinessName}>{currentBusiness.name}</Text>
//           </Text>
//         </View>
//       )}
//     </View>
//   );

//   const renderEmptyState = () => (
//     <EmptyState
//       icon="business-outline"
//       title="No Businesses Found"
//       message={
//         hasActiveFilters
//           ? "No businesses match your filters. Try adjusting your search or filters."
//           : "You don't have any businesses yet. Create your first business to get started!"
//       }
//       actionLabel={hasActiveFilters ? "Clear Filters" : "Create Business"}
//       onAction={hasActiveFilters ? clearFilters : handleCreateBusiness}
//     />
//   );

//   const renderBusinessItem = ({ item }) => (
//     <View style={styles.businessItemContainer}>
//       <BusinessCard
//         business={item}
//         onPress={() => handleBusinessPress(item)}
//         variant="detailed"
//         isActive={currentBusiness?._id === item._id}
//         showSwitch={currentBusiness?._id !== item._id}
//         onSwitch={() => handleSwitchBusiness(item)}
//       />
//       {switchingBusinessId === item._id && (
//         <View style={styles.switchingOverlay}>
//           <LoadingSpinner size="small" color="#fff" text="Switching..." />
//         </View>
//       )}
//     </View>
//   );

//   const renderFilterModal = () => (
//     <Modal
//       visible={showFilterModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilterModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filter by Industry</Text>
//             <TouchableOpacity onPress={() => setShowFilterModal(false)}>
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={industries}
//             keyExtractor={(item) => item.value}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.modalOption,
//                   filterIndustry === item.value && styles.modalOptionSelected
//                 ]}
//                 onPress={() => {
//                   setFilterIndustry(item.value);
//                   setShowFilterModal(false);
//                 }}
//               >
//                 <Text style={[
//                   styles.modalOptionText,
//                   filterIndustry === item.value && styles.modalOptionTextSelected
//                 ]}>
//                   {item.label}
//                 </Text>
//                 {filterIndustry === item.value && (
//                   <Ionicons name="checkmark" size={20} color="#1976d2" />
//                 )}
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
//           />

//           {filterIndustry && (
//             <TouchableOpacity
//               style={styles.clearFilterButton}
//               onPress={() => {
//                 setFilterIndustry(null);
//                 setShowFilterModal(false);
//               }}
//             >
//               <Text style={styles.clearFilterButtonText}>Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   const renderSortModal = () => (
//     <Modal
//       visible={showSortModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowSortModal(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Sort By</Text>
//             <TouchableOpacity onPress={() => setShowSortModal(false)}>
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={sortOptions}
//             keyExtractor={(item) => item.value}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.modalOption,
//                   sortBy === item.value && styles.modalOptionSelected
//                 ]}
//                 onPress={() => setSortBy(item.value)}
//               >
//                 <Text style={[
//                   styles.modalOptionText,
//                   sortBy === item.value && styles.modalOptionTextSelected
//                 ]}>
//                   {item.label}
//                 </Text>
//                 {sortBy === item.value && (
//                   <Ionicons name="checkmark" size={20} color="#1976d2" />
//                 )}
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
//           />

//           <View style={styles.sortOrderContainer}>
//             <Text style={styles.sortOrderLabel}>Order:</Text>
//             <TouchableOpacity
//               style={[
//                 styles.sortOrderButton,
//                 sortOrder === 'asc' && styles.sortOrderButtonActive
//               ]}
//               onPress={() => setSortOrder('asc')}
//             >
//               <Ionicons 
//                 name="arrow-up" 
//                 size={18} 
//                 color={sortOrder === 'asc' ? '#fff' : '#666'} 
//               />
//               <Text style={[
//                 styles.sortOrderText,
//                 sortOrder === 'asc' && styles.sortOrderTextActive
//               ]}>
//                 Ascending
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.sortOrderButton,
//                 sortOrder === 'desc' && styles.sortOrderButtonActive
//               ]}
//               onPress={() => setSortOrder('desc')}
//             >
//               <Ionicons 
//                 name="arrow-down" 
//                 size={18} 
//                 color={sortOrder === 'desc' ? '#fff' : '#666'} 
//               />
//               <Text style={[
//                 styles.sortOrderText,
//                 sortOrder === 'desc' && styles.sortOrderTextActive
//               ]}>
//                 Descending
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.applyButton}
//             onPress={() => setShowSortModal(false)}
//           >
//             <Text style={styles.applyButtonText}>Apply</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading && businesses.length === 0) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refresh} />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {renderHeader()}
      
//       <FlatList
//         data={businesses}
//         keyExtractor={(item) => item._id}
//         renderItem={renderBusinessItem}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={refresh} />
//         }
//         ListEmptyComponent={renderEmptyState}
//         showsVerticalScrollIndicator={false}
//       />

//       {renderFilterModal()}
//       {renderSortModal()}

//       <ConfirmDialog
//         visible={showSwitchConfirm}
//         title="Switch Business"
//         message={`Are you sure you want to switch to ${selectedBusiness?.name}? Your current session will be updated to manage this business.`}
//         confirmText="Switch"
//         cancelText="Cancel"
//         onConfirm={confirmSwitchBusiness}
//         onCancel={() => {
//           setShowSwitchConfirm(false);
//           setSelectedBusiness(null);
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// // Import ScrollView for the filters
// import { ScrollView } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   addButton: {
//     padding: 4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 12,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1976d2',
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statDivider: {
//     width: 1,
//     height: '80%',
//     backgroundColor: '#e0e0e0',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 8,
//   },
//   searchInputWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     marginRight: 8,
//     height: 44,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 8,
//   },
//   filterActions: {
//     flexDirection: 'row',
//   },
//   filterButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 6,
//   },
//   filterButtonActive: {
//     backgroundColor: '#1976d2',
//   },
//   activeFilters: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginTop: 8,
//   },
//   filterChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e3f2fd',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   filterChipText: {
//     fontSize: 13,
//     color: '#1976d2',
//     marginRight: 4,
//   },
//   clearFiltersText: {
//     fontSize: 13,
//     color: '#d32f2f',
//     fontWeight: '500',
//   },
//   currentBusinessBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#e8f5e9',
//     paddingVertical: 8,
//     marginTop: 12,
//     marginHorizontal: 16,
//     borderRadius: 8,
//   },
//   currentBusinessText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 6,
//   },
//   currentBusinessName: {
//     fontWeight: '600',
//     color: '#2e7d32',
//   },
//   listContent: {
//     padding: 16,
//     flexGrow: 1,
//   },
//   businessItemContainer: {
//     position: 'relative',
//     marginBottom: 12,
//   },
//   switchingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '70%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   modalOptionSelected: {
//     backgroundColor: '#e3f2fd',
//   },
//   modalOptionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   modalOptionTextSelected: {
//     color: '#1976d2',
//     fontWeight: '500',
//   },
//   modalSeparator: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginHorizontal: 20,
//   },
//   clearFilterButton: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     alignItems: 'center',
//   },
//   clearFilterButtonText: {
//     fontSize: 16,
//     color: '#d32f2f',
//     fontWeight: '500',
//   },
//   sortOrderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   sortOrderLabel: {
//     fontSize: 15,
//     color: '#666',
//     marginRight: 12,
//   },
//   sortOrderButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f5f5f5',
//     marginRight: 8,
//   },
//   sortOrderButtonActive: {
//     backgroundColor: '#1976d2',
//   },
//   sortOrderText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 4,
//   },
//   sortOrderTextActive: {
//     color: '#fff',
//   },
//   applyButton: {
//     backgroundColor: '#1976d2',
//     margin: 20,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   applyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default BusinessSelectScreen;

























// app/(app)/business/select.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBusinessList } from '../../../../hooks/businessHooks/useBusinessList';
import { useBusinessStore } from '../../../../stores/businessStore';
import BusinessCard from '../../../../components/business/BusinessCard';
import LoadingSpinner from '../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../components/business/ui/ErrorMessage';
import EmptyState from '../../../../components/business/ui/EmptyState';
import ConfirmDialog from '../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../components/common/Header';

const BusinessSelectScreen = () => {
  const { returnTo } = useLocalSearchParams();
  const { 
    businesses, 
    loading, 
    refreshing, 
    error, 
    searchQuery,
    filterIndustry,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilterIndustry,
    setSortBy,
    setSortOrder,
    refresh,
    switchBusiness,
    getBusinessStats,
  } = useBusinessList();
  
  const { currentBusiness } = useBusinessStore();
  const [switchingBusinessId, setSwitchingBusinessId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const stats = getBusinessStats();

  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(businesses.map(b => b.industry).filter(Boolean))];
    return uniqueIndustries.map(industry => ({
      label: industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: industry,
    }));
  }, [businesses]);

  const sortOptions = [
    { label: 'Business Name', value: 'name' },
    { label: 'Industry', value: 'industry' },
    { label: 'Team Size', value: 'teamMembers' },
    { label: 'Followers', value: 'stats.followers' },
    { label: 'Created Date', value: 'createdAt' },
  ];

  const handleSwitchBusiness = async (business) => {
    if (currentBusiness?._id === business._id) {
      Alert.alert('Already Selected', `${business.name} is already your current business.`);
      return;
    }
    
    setSelectedBusiness(business);
    setShowSwitchConfirm(true);
  };

  const confirmSwitchBusiness = async () => {
    if (!selectedBusiness) return;
    
    try {
      setSwitchingBusinessId(selectedBusiness._id);
      const result = await switchBusiness(selectedBusiness._id);
      
      if (result.success) {
        Alert.alert(
          'Business Switched',
          `You are now managing ${selectedBusiness.name}`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (returnTo) {
                  router.back();
                } else {
                  router.replace('/(app)');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Switch Failed', result.error || 'Failed to switch business');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSwitchingBusinessId(null);
      setShowSwitchConfirm(false);
      setSelectedBusiness(null);
    }
  };

  const handleCreateBusiness = () => {
    router.push('/business/create');
  };

  const handleBusinessPress = (business) => {
    router.push(`/business/${business._id}`);
  };

  const clearFilters = () => {
    setFilterIndustry(null);
    setSearchQuery('');
  };

  const hasActiveFilters = filterIndustry || searchQuery;

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Industry</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={industries}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  filterIndustry === item.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFilterIndustry(item.value);
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  filterIndustry === item.value && styles.modalOptionTextSelected
                ]}>
                  {item.label}
                </Text>
                {filterIndustry === item.value && (
                  <Ionicons name="checkmark" size={20} color="#1976d2" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
          />

          {filterIndustry && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => {
                setFilterIndustry(null);
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.clearFilterButtonText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={sortOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  sortBy === item.value && styles.modalOptionSelected
                ]}
                onPress={() => setSortBy(item.value)}
              >
                <Text style={[
                  styles.modalOptionText,
                  sortBy === item.value && styles.modalOptionTextSelected
                ]}>
                  {item.label}
                </Text>
                {sortBy === item.value && (
                  <Ionicons name="checkmark" size={20} color="#1976d2" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
          />

          <View style={styles.sortOrderContainer}>
            <Text style={styles.sortOrderLabel}>Order:</Text>
            <TouchableOpacity
              style={[
                styles.sortOrderButton,
                sortOrder === 'asc' && styles.sortOrderButtonActive
              ]}
              onPress={() => setSortOrder('asc')}
            >
              <Ionicons 
                name="arrow-up" 
                size={18} 
                color={sortOrder === 'asc' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.sortOrderText,
                sortOrder === 'asc' && styles.sortOrderTextActive
              ]}>
                Ascending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOrderButton,
                sortOrder === 'desc' && styles.sortOrderButtonActive
              ]}
              onPress={() => setSortOrder('desc')}
            >
              <Ionicons 
                name="arrow-down" 
                size={18} 
                color={sortOrder === 'desc' ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.sortOrderText,
                sortOrder === 'desc' && styles.sortOrderTextActive
              ]}>
                Descending
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowSortModal(false)}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading && businesses.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Select Business"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleCreateBusiness}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.industries}</Text>
          <Text style={styles.statLabel}>Industries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalTeamMembers}</Text>
          <Text style={styles.statLabel}>Team</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats.totalFollowers >= 1000 
              ? `${(stats.totalFollowers / 1000).toFixed(1)}K` 
              : stats.totalFollowers}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search businesses..."
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity
            style={[styles.filterButton, filterIndustry && styles.filterButtonActive]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons 
              name="filter" 
              size={18} 
              color={filterIndustry ? '#fff' : '#666'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="swap-vertical" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterIndustry && (
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => setFilterIndustry(null)}
              >
                <Text style={styles.filterChipText}>
                  {industries.find(i => i.value === filterIndustry)?.label}
                </Text>
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
            {searchQuery && (
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.filterChipText}>Search: {searchQuery}</Text>
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </ScrollView>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Business Indicator */}
      {currentBusiness && (
        <View style={styles.currentBusinessBanner}>
          <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
          <Text style={styles.currentBusinessText}>
            Current: <Text style={styles.currentBusinessName}>{currentBusiness.name}</Text>
          </Text>
        </View>
      )}
      
      <FlatList
        data={businesses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.businessItemContainer}>
            <BusinessCard
              business={item}
              onPress={() => handleBusinessPress(item)}
              variant="detailed"
              isActive={currentBusiness?._id === item._id}
              showSwitch={currentBusiness?._id !== item._id}
              onSwitch={() => handleSwitchBusiness(item)}
            />
            {switchingBusinessId === item._id && (
              <View style={styles.switchingOverlay}>
                <LoadingSpinner size="small" color="#fff" text="Switching..." />
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="business-outline"
            title="No Businesses Found"
            message={
              hasActiveFilters
                ? "No businesses match your filters. Try adjusting your search or filters."
                : "You don't have any businesses yet. Create your first business to get started!"
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : "Create Business"}
            onAction={hasActiveFilters ? clearFilters : handleCreateBusiness}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {renderFilterModal()}
      {renderSortModal()}

      <ConfirmDialog
        visible={showSwitchConfirm}
        title="Switch Business"
        message={`Are you sure you want to switch to ${selectedBusiness?.name}? Your current session will be updated to manage this business.`}
        confirmText="Switch"
        cancelText="Cancel"
        onConfirm={confirmSwitchBusiness}
        onCancel={() => {
          setShowSwitchConfirm(false);
          setSelectedBusiness(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  filterActions: {
    flexDirection: 'row',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterButtonActive: {
    backgroundColor: '#1976d2',
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
    color: '#1976d2',
    marginRight: 4,
  },
  clearFiltersText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '500',
  },
  currentBusinessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
  },
  currentBusinessText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  currentBusinessName: {
    fontWeight: '600',
    color: '#2e7d32',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  businessItemContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  switchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalOptionSelected: {
    backgroundColor: '#e3f2fd',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#1976d2',
    fontWeight: '500',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  clearFilterButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  clearFilterButtonText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '500',
  },
  sortOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sortOrderLabel: {
    fontSize: 15,
    color: '#666',
    marginRight: 12,
  },
  sortOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  sortOrderButtonActive: {
    backgroundColor: '#1976d2',
  },
  sortOrderText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sortOrderTextActive: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#1976d2',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessSelectScreen;