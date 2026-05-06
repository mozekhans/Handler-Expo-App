// // app/(app)/content/index.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   TextInput,
//   Modal,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useContent } from '../../../../../hooks/useContent';
// import { useBusiness } from '../../../../../hooks/useBusiness'; // Add this import
// import ContentCard from '../../../../../components/content/ContentCard';
// import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
// import Toast from '../../../../../components/content/Toast';
// import useToast from '../../../../../hooks/useToast';
// import { CONTENT_STATUS, SOCIAL_PLATFORMS } from '../../../../../utils/constants';

// export default function ContentList() {
//   const router = useRouter();
//   const { 
//     loading, 
//     content, 
//     pagination, 
//     getContent, 
//     deleteContent, 
//     publishContent 
//   } = useContent();
//   const { currentBusiness } = useBusiness(); // Add this to get business ID
//   const { toast, showToast } = useToast();
//   const [refreshing, setRefreshing] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 20,
//     status: '',
//     platform: '',
//     search: '',
//   });

//   useEffect(() => {
//     // Only load if we have a business
//     if (currentBusiness?._id) {
//       loadContent();
//     }
//   }, [filters, currentBusiness?._id]);

//   const loadContent = async () => {
//     // Pass business ID as first argument, params as second
//     if (!currentBusiness?._id) return;
    
//     await getContent(currentBusiness._id, {
//       page: filters.page,
//       limit: filters.limit,
//       ...(filters.status && { status: filters.status }),
//       ...(filters.platform && { platform: filters.platform }),
//       ...(filters.search && { search: filters.search }),
//     });
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     setFilters(prev => ({ ...prev, page: 1 }));
//     await loadContent();
//     setRefreshing(false);
//   };

//   const loadMore = async () => {
//     if (!pagination?.page || !pagination?.pages) return;
//     if (loading) return;
//     if (pagination.page < pagination.pages) {
//       setFilters(prev => ({
//         ...prev,
//         page: prev.page + 1
//       }));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!currentBusiness?._id) return;
    
//     try {
//       await deleteContent(currentBusiness._id, id);
//       showToast({ message: 'Content deleted successfully', type: 'success' });
//       await loadContent();
//     } catch (error) {
//       showToast({ message: 'Failed to delete content', type: 'error' });
//     }
//   };

//   const handlePublish = async (id) => {
//     if (!currentBusiness?._id) return;
    
//     try {
//       await publishContent(currentBusiness._id, id);
//       showToast({ message: 'Content published successfully', type: 'success' });
//       await loadContent();
//     } catch (error) {
//       showToast({ message: 'Failed to publish content', type: 'error' });
//     }
//   };

//   const handleSearch = (text) => {
//     setFilters(prev => ({ ...prev, search: text, page: 1 }));
//   };

//   const applyFilters = (newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       page: 1,
//       limit: 20,
//       status: '',
//       platform: '',
//       search: '',
//     });
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.searchBar}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search content..."
//           value={filters.search}
//           onChangeText={handleSearch}
//           returnKeyType="search"
//           onSubmitEditing={loadContent}
//         />
//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => setShowFilters(true)}
//         >
//           <Text style={styles.filterButtonText}>Filter</Text>
//         </TouchableOpacity>
//       </View>
      
//       {(filters.status || filters.platform) && (
//         <View style={styles.activeFilters}>
//           <Text style={styles.activeFilterText}>
//             Active filters: {filters.status && `${filters.status} `}
//             {filters.platform && `${filters.platform}`}
//           </Text>
//           <TouchableOpacity onPress={clearFilters}>
//             <Text style={styles.clearFilterText}>Clear</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   if (loading && !refreshing && content.length === 0) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <View style={styles.container}>
//       {renderHeader()}
      
//       <FlatList
//         data={content}
//         keyExtractor={(item) => item._id || item.id}
//         renderItem={({ item }) => (
//           <ContentCard
//             content={item}
//             onDelete={handleDelete}
//             onPublish={handlePublish}
//           />
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.5}
//         ListEmptyComponent={
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyText}>No content found</Text>
//             <TouchableOpacity
//               style={styles.createButton}
//               onPress={() => router.push('/content/create')}
//             >
//               <Text style={styles.createButtonText}>Create Content</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />

//       <Modal
//         visible={showFilters}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Filter Content</Text>
            
//             <Text style={styles.filterLabel}>Status</Text>
//             <View style={styles.filterOptions}>
//               {Object.entries(CONTENT_STATUS).map(([key, value]) => (
//                 <TouchableOpacity
//                   key={value}
//                   style={[
//                     styles.filterChip,
//                     filters.status === value && styles.filterChipActive,
//                   ]}
//                   onPress={() => applyFilters({ status: value })}
//                 >
//                   <Text style={[
//                     styles.filterChipText,
//                     filters.status === value && styles.filterChipTextActive,
//                   ]}>
//                     {key}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <Text style={styles.filterLabel}>Platform</Text>
//             <View style={styles.filterOptions}>
//               {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => (
//                 <TouchableOpacity
//                   key={value}
//                   style={[
//                     styles.filterChip,
//                     filters.platform === value && styles.filterChipActive,
//                   ]}
//                   onPress={() => applyFilters({ platform: value })}
//                 >
//                   <Text style={[
//                     styles.filterChipText,
//                     filters.platform === value && styles.filterChipTextActive,
//                   ]}>
//                     {key}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.clearAllButton]}
//                 onPress={clearFilters}
//               >
//                 <Text style={styles.clearAllButtonText}>Clear All</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.closeButton]}
//                 onPress={() => setShowFilters(false)}
//               >
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Toast {...toast} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   searchInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 16,
//   },
//   filterButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     justifyContent: 'center',
//   },
//   filterButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   activeFilters: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   activeFilterText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   clearFilterText: {
//     fontSize: 12,
//     color: '#007bff',
//     fontWeight: '600',
//   },
//   emptyState: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//     marginBottom: 16,
//   },
//   createButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   filterLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   filterOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   filterChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   filterChipActive: {
//     backgroundColor: '#007bff',
//   },
//   filterChipText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   filterChipTextActive: {
//     color: '#fff',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   clearAllButton: {
//     backgroundColor: '#dc3545',
//   },
//   clearAllButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   closeButton: {
//     backgroundColor: '#6c757d',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });




// app/(app)/content/index.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContent } from '../../../../../hooks/useContent';
import { useBusiness } from '../../../../../hooks/useBusiness';
import ContentCard from '../../../../../components/content/ContentCard';
import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
import Toast from '../../../../../components/content/Toast';
import useToast from '../../../../../hooks/useToast';
import Header from '../../../../../components/common/Header';
import { CONTENT_STATUS, SOCIAL_PLATFORMS } from '../../../../../utils/constants';

export default function ContentList() {
  const router = useRouter();
  const { 
    loading, 
    content, 
    pagination, 
    getContent, 
    deleteContent, 
    publishContent 
  } = useContent();
  const { currentBusiness } = useBusiness();
  const { toast, showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    platform: '',
    search: '',
  });

  useEffect(() => {
    if (currentBusiness?._id) {
      loadContent();
    }
  }, [filters, currentBusiness?._id]);

  const loadContent = async () => {
    if (!currentBusiness?._id) return;
    
    await getContent(currentBusiness._id, {
      page: filters.page,
      limit: filters.limit,
      ...(filters.status && { status: filters.status }),
      ...(filters.platform && { platform: filters.platform }),
      ...(filters.search && { search: filters.search }),
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setFilters(prev => ({ ...prev, page: 1 }));
    await loadContent();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!pagination?.page || !pagination?.pages) return;
    if (loading) return;
    if (pagination.page < pagination.pages) {
      setFilters(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };

  const handleDelete = async (id) => {
    if (!currentBusiness?._id) return;
    
    try {
      await deleteContent(currentBusiness._id, id);
      showToast({ message: 'Content deleted successfully', type: 'success' });
      await loadContent();
    } catch (error) {
      showToast({ message: 'Failed to delete content', type: 'error' });
    }
  };

  const handlePublish = async (id) => {
    if (!currentBusiness?._id) return;
    
    try {
      await publishContent(currentBusiness._id, id);
      showToast({ message: 'Content published successfully', type: 'success' });
      await loadContent();
    } catch (error) {
      showToast({ message: 'Failed to publish content', type: 'error' });
    }
  };

  const handleSearch = (text) => {
    setFilters(prev => ({ ...prev, search: text, page: 1 }));
  };

  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: '',
      platform: '',
      search: '',
    });
  };

  const renderHeader = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search content..."
          value={filters.search}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={loadContent}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {(filters.status || filters.platform) && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFilterText}>
            Active filters: {filters.status && `${filters.status} `}
            {filters.platform && `${filters.platform}`}
          </Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading && !refreshing && content.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Content"
        showMenu={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/content/create')}>
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      {renderHeader()}
      
      <FlatList
        data={content}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <ContentCard
            content={item}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content found</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/content/create')}
            >
              <Text style={styles.createButtonText}>Create Content</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Content</Text>
            
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {Object.entries(CONTENT_STATUS).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.filterChip,
                    filters.status === value && styles.filterChipActive,
                  ]}
                  onPress={() => applyFilters({ status: value })}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.status === value && styles.filterChipTextActive,
                  ]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Platform</Text>
            <View style={styles.filterOptions}>
              {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.filterChip,
                    filters.platform === value && styles.filterChipActive,
                  ]}
                  onPress={() => applyFilters({ platform: value })}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.platform === value && styles.filterChipTextActive,
                  ]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.clearAllButton]}
                onPress={clearFilters}
              >
                <Text style={styles.clearAllButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast {...toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  activeFilterText: {
    fontSize: 12,
    color: '#666',
  },
  clearFilterText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterChipActive: {
    backgroundColor: '#007bff',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
  },
  clearAllButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});