// // app/(app)/content/[id].jsx
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Share,
//   Alert,
//   Linking,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useContent } from '../../../../../hooks/useContent';
// import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
// import StatusBadge from '../../../../../components/content/StatusBadge';
// import Toast from '../../../../../components/content/Toast';
// import useToast from '../../../../../hooks/useToast';
// import { PLATFORM_ICONS } from '../../../../../utils/constants';

// export default function ContentDetail() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { 
//     selectedContent, 
//     fetchContentById, 
//     deleteContent, 
//     publishContent,
//     scheduleContent,
//     duplicateContent,
//     loading 
//   } = useContent();
//   const { toast, showToast } = useToast();
//   const [showActions, setShowActions] = useState(false);

//   useEffect(() => {
//     if (id) {
//       loadContent();
//     }
//   }, [id]);

//   const loadContent = async () => {
//     await fetchContentById(id);
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       'Delete Content',
//       'Are you sure you want to delete this content?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             await deleteContent(id);
//             showToast('Content deleted successfully', 'success');
//             router.back();
//           },
//         },
//       ]
//     );
//   };

//   const handlePublish = async () => {
//     Alert.alert(
//       'Publish Content',
//       'Are you sure you want to publish this content?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Publish',
//           onPress: async () => {
//             await publishContent(id);
//             await loadContent();
//             showToast('Content published successfully', 'success');
//           },
//         },
//       ]
//     );
//   };

//   const handleDuplicate = async () => {
//     const result = await duplicateContent(id);
//     showToast('Content duplicated successfully', 'success');
//     router.push(`/content/${result._id}`);
//   };

//   const handleShare = async () => {
//     try {
//       const shareText = selectedContent?.content?.text || selectedContent?.title || '';
//       await Share.share({
//         message: shareText,
//         title: selectedContent?.title,
//       });
//     } catch (error) {
//       console.error('Share error:', error);
//     }
//   };

//   const handleOpenUrl = (url) => {
//     Linking.openURL(url);
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleString();
//   };

//   const getPerformanceMetrics = () => {
//     if (!selectedContent?.platforms) return null;
    
//     let totalLikes = 0;
//     let totalComments = 0;
//     let totalShares = 0;
//     let totalReach = 0;
    
//     selectedContent.platforms.forEach(platform => {
//       if (platform.performance) {
//         totalLikes += platform.performance.likes || 0;
//         totalComments += platform.performance.comments || 0;
//         totalShares += platform.performance.shares || 0;
//         totalReach += platform.performance.reach || 0;
//       }
//     });
    
//     return { totalLikes, totalComments, totalShares, totalReach };
//   };

//   if (loading || !selectedContent) {
//     return <LoadingSpinner />;
//   }

//   const performance = getPerformanceMetrics();

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>{selectedContent.title || 'Untitled Content'}</Text>
//         <View style={styles.statusRow}>
//           <StatusBadge status={selectedContent.status} />
//           <Text style={styles.version}>v{selectedContent.version}</Text>
//         </View>
//       </View>

//       {/* Content Preview */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Content</Text>
//         {selectedContent.content?.text && (
//           <Text style={styles.contentText}>{selectedContent.content.text}</Text>
//         )}
        
//         {/* Media Gallery */}
//         {selectedContent.content?.media && selectedContent.content.media.length > 0 && (
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
//             {selectedContent.content.media.map((media, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleOpenUrl(media.url)}
//               >
//                 <Image source={{ uri: media.url }} style={styles.mediaImage} />
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}
        
//         {/* Hashtags */}
//         {selectedContent.content?.hashtags && selectedContent.content.hashtags.length > 0 && (
//           <View style={styles.tagsContainer}>
//             {selectedContent.content.hashtags.map((tag, index) => (
//               <View key={index} style={styles.tag}>
//                 <Text style={styles.tagText}>#{tag}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>

//       {/* Platforms */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Platforms</Text>
//         {selectedContent.platforms.map((platform, index) => (
//           <View key={index} style={styles.platformCard}>
//             <View style={styles.platformHeader}>
//               <Text style={styles.platformName}>{platform.platform}</Text>
//               <StatusBadge status={platform.status} />
//             </View>
//             {platform.scheduledFor && (
//               <Text style={styles.platformDate}>
//                 Scheduled: {formatDate(platform.scheduledFor)}
//               </Text>
//             )}
//             {platform.publishedAt && (
//               <Text style={styles.platformDate}>
//                 Published: {formatDate(platform.publishedAt)}
//               </Text>
//             )}
//             {platform.postUrl && (
//               <TouchableOpacity onPress={() => handleOpenUrl(platform.postUrl)}>
//                 <Text style={styles.linkText}>View Post</Text>
//               </TouchableOpacity>
//             )}
//             {platform.error && (
//               <Text style={styles.errorText}>Error: {platform.error}</Text>
//             )}
//           </View>
//         ))}
//       </View>

//       {/* Performance Metrics */}
//       {performance && (performance.totalLikes > 0 || performance.totalComments > 0) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Performance</Text>
//           <View style={styles.metricsGrid}>
//             <View style={styles.metricCard}>
//               <Text style={styles.metricValue}>{performance.totalLikes}</Text>
//               <Text style={styles.metricLabel}>Likes</Text>
//             </View>
//             <View style={styles.metricCard}>
//               <Text style={styles.metricValue}>{performance.totalComments}</Text>
//               <Text style={styles.metricLabel}>Comments</Text>
//             </View>
//             <View style={styles.metricCard}>
//               <Text style={styles.metricValue}>{performance.totalShares}</Text>
//               <Text style={styles.metricLabel}>Shares</Text>
//             </View>
//             <View style={styles.metricCard}>
//               <Text style={styles.metricValue}>{performance.totalReach.toLocaleString()}</Text>
//               <Text style={styles.metricLabel}>Reach</Text>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Metadata */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Details</Text>
//         <View style={styles.metadataRow}>
//           <Text style={styles.metadataLabel}>Created By:</Text>
//           <Text style={styles.metadataValue}>
//             {selectedContent.createdBy?.firstName} {selectedContent.createdBy?.lastName}
//           </Text>
//         </View>
//         <View style={styles.metadataRow}>
//           <Text style={styles.metadataLabel}>Created At:</Text>
//           <Text style={styles.metadataValue}>{formatDate(selectedContent.createdAt)}</Text>
//         </View>
//         {selectedContent.tags && selectedContent.tags.length > 0 && (
//           <View style={styles.metadataRow}>
//             <Text style={styles.metadataLabel}>Tags:</Text>
//             <Text style={styles.metadataValue}>{selectedContent.tags.join(', ')}</Text>
//           </View>
//         )}
//         {selectedContent.categories && selectedContent.categories.length > 0 && (
//           <View style={styles.metadataRow}>
//             <Text style={styles.metadataLabel}>Categories:</Text>
//             <Text style={styles.metadataValue}>{selectedContent.categories.join(', ')}</Text>
//           </View>
//         )}
//         {selectedContent.aiGenerated && (
//           <View style={styles.aiBadge}>
//             <Text style={styles.aiBadgeText}>🤖 AI Generated</Text>
//             {selectedContent.aiConfidence && (
//               <Text style={styles.aiConfidence}>
//                 Confidence: {(selectedContent.aiConfidence * 100).toFixed(0)}%
//               </Text>
//             )}
//           </View>
//         )}
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.actions}>
//         {selectedContent.status === 'draft' && (
//           <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
//             <Text style={styles.actionButtonText}>Publish Now</Text>
//           </TouchableOpacity>
//         )}
        
//         {selectedContent.status === 'draft' && (
//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => router.push(`/content/edit/${selectedContent._id}`)}
//           >
//             <Text style={styles.actionButtonText}>Edit</Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity style={styles.duplicateButton} onPress={handleDuplicate}>
//           <Text style={styles.actionButtonText}>Duplicate</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
//           <Text style={styles.actionButtonText}>Share</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
//           <Text style={styles.actionButtonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>

//       <Toast {...toast} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   version: {
//     fontSize: 12,
//     color: '#999',
//   },
//   section: {
//     backgroundColor: '#fff',
//     marginTop: 12,
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   contentText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#333',
//   },
//   mediaScroll: {
//     marginTop: 12,
//   },
//   mediaImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 12,
//   },
//   tag: {
//     backgroundColor: '#e9ecef',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   tagText: {
//     fontSize: 12,
//     color: '#495057',
//   },
//   platformCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//   },
//   platformHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   platformName: {
//     fontSize: 16,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   platformDate: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   linkText: {
//     fontSize: 12,
//     color: '#007bff',
//     marginTop: 4,
//     textDecorationLine: 'underline',
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#dc3545',
//     marginTop: 4,
//   },
//   metricsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   metricCard: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   metricLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   metadataRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   metadataLabel: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   metadataValue: {
//     fontSize: 14,
//     color: '#333',
//   },
//   aiBadge: {
//     backgroundColor: '#e7f3ff',
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 12,
//     alignItems: 'center',
//   },
//   aiBadgeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#007bff',
//   },
//   aiConfidence: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   actions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 16,
//     gap: 12,
//     marginBottom: 32,
//   },
//   publishButton: {
//     flex: 1,
//     backgroundColor: '#28a745',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   editButton: {
//     flex: 1,
//     backgroundColor: '#17a2b8',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   duplicateButton: {
//     flex: 1,
//     backgroundColor: '#6c757d',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   shareButton: {
//     flex: 1,
//     backgroundColor: '#28a745',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   deleteButton: {
//     flex: 1,
//     backgroundColor: '#dc3545',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });



















// app/(app)/content/[contentId].jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContent } from '../../../../../hooks/useContent';
import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
import StatusBadge from '../../../../../components/content/StatusBadge';
import Toast from '../../../../../components/content/Toast';
import useToast from '../../../../../hooks/useToast';
import Header from '../../../../../components/common/Header';
import { PLATFORM_ICONS } from '../../../../../utils/constants';

export default function ContentDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    selectedContent, 
    fetchContentById, 
    deleteContent, 
    publishContent,
    scheduleContent,
    duplicateContent,
    loading 
  } = useContent();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    await fetchContentById(id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Content',
      'Are you sure you want to delete this content?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteContent(id);
            showToast('Content deleted successfully', 'success');
            router.back();
          },
        },
      ]
    );
  };

  const handlePublish = async () => {
    Alert.alert(
      'Publish Content',
      'Are you sure you want to publish this content?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            await publishContent(id);
            await loadContent();
            showToast('Content published successfully', 'success');
          },
        },
      ]
    );
  };

  const handleDuplicate = async () => {
    const result = await duplicateContent(id);
    showToast('Content duplicated successfully', 'success');
    router.push(`/content/${result._id}`);
  };

  const handleShare = async () => {
    try {
      const shareText = selectedContent?.content?.text || selectedContent?.title || '';
      await Share.share({
        message: shareText,
        title: selectedContent?.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleOpenUrl = (url) => {
    Linking.openURL(url);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const getPerformanceMetrics = () => {
    if (!selectedContent?.platforms) return null;
    
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;
    
    selectedContent.platforms.forEach(platform => {
      if (platform.performance) {
        totalLikes += platform.performance.likes || 0;
        totalComments += platform.performance.comments || 0;
        totalShares += platform.performance.shares || 0;
        totalReach += platform.performance.reach || 0;
      }
    });
    
    return { totalLikes, totalComments, totalShares, totalReach };
  };

  if (loading || !selectedContent) {
    return <LoadingSpinner />;
  }

  const performance = getPerformanceMetrics();

  return (
    <View style={styles.container}>
      <Header
        title="Content Detail"
        showBack={true}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/content/edit/${selectedContent._id}`)}
              style={styles.headerButton}
            >
              <Ionicons name="create-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.headerButton}
            >
              <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>{selectedContent.title || 'Untitled Content'}</Text>
          <View style={styles.statusRow}>
            <StatusBadge status={selectedContent.status} />
            <Text style={styles.version}>v{selectedContent.version}</Text>
          </View>
        </View>

        {/* Content Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          {selectedContent.content?.text && (
            <Text style={styles.contentText}>{selectedContent.content.text}</Text>
          )}
          
          {/* Media Gallery */}
          {selectedContent.content?.media && selectedContent.content.media.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
              {selectedContent.content.media.map((media, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOpenUrl(media.url)}
                >
                  <Image source={{ uri: media.url }} style={styles.mediaImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          
          {/* Hashtags */}
          {selectedContent.content?.hashtags && selectedContent.content.hashtags.length > 0 && (
            <View style={styles.tagsContainer}>
              {selectedContent.content.hashtags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platforms</Text>
          {selectedContent.platforms.map((platform, index) => (
            <View key={index} style={styles.platformCard}>
              <View style={styles.platformHeader}>
                <Text style={styles.platformName}>{platform.platform}</Text>
                <StatusBadge status={platform.status} />
              </View>
              {platform.scheduledFor && (
                <Text style={styles.platformDate}>
                  Scheduled: {formatDate(platform.scheduledFor)}
                </Text>
              )}
              {platform.publishedAt && (
                <Text style={styles.platformDate}>
                  Published: {formatDate(platform.publishedAt)}
                </Text>
              )}
              {platform.postUrl && (
                <TouchableOpacity onPress={() => handleOpenUrl(platform.postUrl)}>
                  <Text style={styles.linkText}>View Post</Text>
                </TouchableOpacity>
              )}
              {platform.error && (
                <Text style={styles.errorText}>Error: {platform.error}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Performance Metrics */}
        {performance && (performance.totalLikes > 0 || performance.totalComments > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{performance.totalLikes}</Text>
                <Text style={styles.metricLabel}>Likes</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{performance.totalComments}</Text>
                <Text style={styles.metricLabel}>Comments</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{performance.totalShares}</Text>
                <Text style={styles.metricLabel}>Shares</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{performance.totalReach.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Reach</Text>
              </View>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created By:</Text>
            <Text style={styles.metadataValue}>
              {selectedContent.createdBy?.firstName} {selectedContent.createdBy?.lastName}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created At:</Text>
            <Text style={styles.metadataValue}>{formatDate(selectedContent.createdAt)}</Text>
          </View>
          {selectedContent.tags && selectedContent.tags.length > 0 && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Tags:</Text>
              <Text style={styles.metadataValue}>{selectedContent.tags.join(', ')}</Text>
            </View>
          )}
          {selectedContent.categories && selectedContent.categories.length > 0 && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Categories:</Text>
              <Text style={styles.metadataValue}>{selectedContent.categories.join(', ')}</Text>
            </View>
          )}
          {selectedContent.aiGenerated && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>🤖 AI Generated</Text>
              {selectedContent.aiConfidence && (
                <Text style={styles.aiConfidence}>
                  Confidence: {(selectedContent.aiConfidence * 100).toFixed(0)}%
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {selectedContent.status === 'draft' && (
            <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
              <Text style={styles.actionButtonText}>Publish Now</Text>
            </TouchableOpacity>
          )}
          
          {selectedContent.status === 'draft' && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/content/edit/${selectedContent._id}`)}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.duplicateButton} onPress={handleDuplicate}>
            <Text style={styles.actionButtonText}>Duplicate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast {...toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  mediaScroll: {
    marginTop: 12,
  },
  mediaImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
  },
  platformCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  platformDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metadataLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 14,
    color: '#333',
  },
  aiBadge: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  aiBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  aiConfidence: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#17a2b8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  duplicateButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});