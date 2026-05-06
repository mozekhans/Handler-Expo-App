// // app/(app)/business/[id]/competitors/[competitorId].js
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Linking,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import BusinessApi from '../../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import FormInput from '../../../../../../components/business/ui/FormInput';
// import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
// import { formatDate, formatNumber } from '../../../../../../utils/formatters';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export default function CompetitorDetailScreen() {
//   const { id, competitorId } = useLocalSearchParams();
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editNote, setEditNote] = useState('');
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['competitor', id, competitorId],
//     queryFn: () => BusinessApi.getCompetitor(id, competitorId),
//   });

//   const updateMutation = useMutation({
//     mutationFn: (data) => BusinessApi.updateCompetitor(id, competitorId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['competitor', id, competitorId]);
//       queryClient.invalidateQueries(['competitors', id]);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: () => BusinessApi.removeCompetitor(id, competitorId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['competitors', id]);
//       router.back();
//     },
//   });

//   const addNoteMutation = useMutation({
//     mutationFn: (note) => BusinessApi.addCompetitorNote(id, competitorId, { note }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['competitor', id, competitorId]);
//       setEditNote('');
//       setIsEditing(false);
//     },
//   });

//   const handleAddNote = () => {
//     if (editNote.trim()) {
//       addNoteMutation.mutate(editNote);
//     }
//   };

//   const handleDelete = () => {
//     deleteMutation.mutate();
//   };

//   const handleOpenWebsite = () => {
//     if (data?.competitor?.website) {
//       let url = data.competitor.website;
//       if (!url.startsWith('http')) {
//         url = 'https://' + url;
//       }
//       Linking.openURL(url);
//     }
//   };

//   const handleOpenSocial = (url) => {
//     Linking.openURL(url);
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error.message} onRetry={refetch} />;
//   }

//   const competitor = data?.competitor;

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <Text style={styles.name}>{competitor.name}</Text>
//           {competitor.industry && (
//             <Text style={styles.industry}>
//               {competitor.industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//             </Text>
//           )}
//         </View>
//         <View style={styles.headerActions}>
//           {competitor.website && (
//             <TouchableOpacity style={styles.iconButton} onPress={handleOpenWebsite}>
//               <Ionicons name="globe-outline" size={24} color="#1976d2" />
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity 
//             style={styles.iconButton} 
//             onPress={() => router.push(`/business/${id}/competitors/${competitorId}/edit`)}
//           >
//             <Ionicons name="create-outline" size={24} color="#1976d2" />
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.iconButton, styles.deleteButton]} 
//             onPress={() => setShowDeleteDialog(true)}
//           >
//             <Ionicons name="trash-outline" size={24} color="#d32f2f" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Description */}
//       {competitor.description && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.description}>{competitor.description}</Text>
//         </View>
//       )}

//       {/* Social Media Accounts */}
//       {competitor.socialAccounts?.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Social Media Presence</Text>
//           {competitor.socialAccounts.map((account, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.socialCard}
//               onPress={() => handleOpenSocial(account.url)}
//             >
//               <View style={styles.socialHeader}>
//                 <Text style={styles.socialPlatform}>
//                   {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
//                 </Text>
//                 <Text style={styles.socialUsername}>@{account.username}</Text>
//               </View>
//               <View style={styles.socialStats}>
//                 <View style={styles.stat}>
//                   <Ionicons name="people" size={16} color="#666" />
//                   <Text style={styles.statValue}>{formatNumber(account.followers)}</Text>
//                   <Text style={styles.statLabel}>Followers</Text>
//                 </View>
//                 <View style={styles.stat}>
//                   <Ionicons name="person-add" size={16} color="#666" />
//                   <Text style={styles.statValue}>{formatNumber(account.following)}</Text>
//                   <Text style={styles.statLabel}>Following</Text>
//                 </View>
//                 <View style={styles.stat}>
//                   <Ionicons name="grid" size={16} color="#666" />
//                   <Text style={styles.statValue}>{formatNumber(account.posts)}</Text>
//                   <Text style={styles.statLabel}>Posts</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* SWOT Analysis */}
//       {(competitor.analysis?.strengths?.length > 0 ||
//         competitor.analysis?.weaknesses?.length > 0 ||
//         competitor.analysis?.opportunities?.length > 0 ||
//         competitor.analysis?.threats?.length > 0) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>SWOT Analysis</Text>
          
//           {competitor.analysis.strengths?.length > 0 && (
//             <View style={styles.swotSection}>
//               <Text style={styles.swotTitle}>Strengths</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.strengths.map((item, index) => (
//                   <View key={index} style={[styles.tag, styles.strengthTag]}>
//                     <Text style={styles.tagText}>{item}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {competitor.analysis.weaknesses?.length > 0 && (
//             <View style={styles.swotSection}>
//               <Text style={styles.swotTitle}>Weaknesses</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.weaknesses.map((item, index) => (
//                   <View key={index} style={[styles.tag, styles.weaknessTag]}>
//                     <Text style={styles.tagText}>{item}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {competitor.analysis.opportunities?.length > 0 && (
//             <View style={styles.swotSection}>
//               <Text style={styles.swotTitle}>Opportunities</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.opportunities.map((item, index) => (
//                   <View key={index} style={[styles.tag, styles.opportunityTag]}>
//                     <Text style={styles.tagText}>{item}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {competitor.analysis.threats?.length > 0 && (
//             <View style={styles.swotSection}>
//               <Text style={styles.swotTitle}>Threats</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.threats.map((item, index) => (
//                   <View key={index} style={[styles.tag, styles.threatTag]}>
//                     <Text style={styles.tagText}>{item}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Market Analysis */}
//       {(competitor.analysis?.marketShare > 0 ||
//         competitor.analysis?.shareOfVoice > 0 ||
//         competitor.analysis?.uniqueSellingPoints?.length > 0 ||
//         competitor.analysis?.targetAudience?.length > 0 ||
//         competitor.analysis?.pricing ||
//         competitor.analysis?.positioning) && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Market Analysis</Text>
          
//           <View style={styles.metricsRow}>
//             {competitor.analysis.marketShare > 0 && (
//               <View style={styles.metric}>
//                 <Text style={styles.metricValue}>{competitor.analysis.marketShare}%</Text>
//                 <Text style={styles.metricLabel}>Market Share</Text>
//               </View>
//             )}
//             {competitor.analysis.shareOfVoice > 0 && (
//               <View style={styles.metric}>
//                 <Text style={styles.metricValue}>{competitor.analysis.shareOfVoice}%</Text>
//                 <Text style={styles.metricLabel}>Share of Voice</Text>
//               </View>
//             )}
//           </View>

//           {competitor.analysis.uniqueSellingPoints?.length > 0 && (
//             <View style={styles.subsection}>
//               <Text style={styles.subsectionTitle}>Unique Selling Points</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.uniqueSellingPoints.map((usp, index) => (
//                   <View key={index} style={[styles.tag, styles.uspTag]}>
//                     <Text style={styles.tagText}>{usp}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {competitor.analysis.targetAudience?.length > 0 && (
//             <View style={styles.subsection}>
//               <Text style={styles.subsectionTitle}>Target Audience</Text>
//               <View style={styles.tagContainer}>
//                 {competitor.analysis.targetAudience.map((audience, index) => (
//                   <View key={index} style={[styles.tag, styles.audienceTag]}>
//                     <Text style={styles.tagText}>{audience}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {competitor.analysis.pricing && (
//             <View style={styles.subsection}>
//               <Text style={styles.subsectionTitle}>Pricing Strategy</Text>
//               <Text style={styles.text}>{competitor.analysis.pricing}</Text>
//             </View>
//           )}

//           {competitor.analysis.positioning && (
//             <View style={styles.subsection}>
//               <Text style={styles.subsectionTitle}>Market Positioning</Text>
//               <Text style={styles.text}>{competitor.analysis.positioning}</Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Notes */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Notes</Text>
        
//         {isEditing ? (
//           <View>
//             <FormInput
//               value={editNote}
//               onChangeText={setEditNote}
//               placeholder="Add a note..."
//               multiline
//               numberOfLines={3}
//             />
//             <View style={styles.noteActions}>
//               <TouchableOpacity 
//                 style={styles.cancelNoteButton}
//                 onPress={() => {
//                   setIsEditing(false);
//                   setEditNote('');
//                 }}
//               >
//                 <Text style={styles.cancelNoteText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={styles.saveNoteButton}
//                 onPress={handleAddNote}
//               >
//                 <Text style={styles.saveNoteText}>Save Note</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <TouchableOpacity 
//             style={styles.addNoteButton}
//             onPress={() => setIsEditing(true)}
//           >
//             <Ionicons name="add-circle-outline" size={20} color="#1976d2" />
//             <Text style={styles.addNoteText}>Add Note</Text>
//           </TouchableOpacity>
//         )}

//         {competitor.notes?.map((note, index) => (
//           <View key={index} style={styles.noteCard}>
//             <Text style={styles.noteText}>{note.text}</Text>
//             <View style={styles.noteMeta}>
//               <Text style={styles.noteAuthor}>
//                 {note.user?.firstName} {note.user?.lastName}
//               </Text>
//               <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
//             </View>
//           </View>
//         ))}
//       </View>

//       <ConfirmDialog
//         visible={showDeleteDialog}
//         title="Delete Competitor"
//         message={`Are you sure you want to delete ${competitor.name}? This action cannot be undone.`}
//         confirmText="Delete"
//         cancelText="Cancel"
//         onConfirm={handleDelete}
//         onCancel={() => setShowDeleteDialog(false)}
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
//   header: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   headerContent: {
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   industry: {
//     fontSize: 16,
//     color: '#666',
//   },
//   headerActions: {
//     flexDirection: 'row',
//   },
//   iconButton: {
//     padding: 8,
//     marginRight: 15,
//   },
//   deleteButton: {
//     marginRight: 0,
//   },
//   section: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 15,
//   },
//   description: {
//     fontSize: 15,
//     color: '#666',
//     lineHeight: 22,
//   },
//   socialCard: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//   },
//   socialHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   socialPlatform: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginRight: 10,
//   },
//   socialUsername: {
//     fontSize: 14,
//     color: '#666',
//   },
//   socialStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   stat: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginVertical: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#999',
//   },
//   swotSection: {
//     marginBottom: 15,
//   },
//   swotTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   tagContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   tag: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   strengthTag: {
//     backgroundColor: '#e8f5e9',
//   },
//   weaknessTag: {
//     backgroundColor: '#ffebee',
//   },
//   opportunityTag: {
//     backgroundColor: '#e3f2fd',
//   },
//   threatTag: {
//     backgroundColor: '#fff3e0',
//   },
//   uspTag: {
//     backgroundColor: '#f3e5f5',
//   },
//   audienceTag: {
//     backgroundColor: '#e0f2f1',
//   },
//   tagText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   metricsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   metric: {
//     alignItems: 'center',
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1976d2',
//   },
//   metricLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   subsection: {
//     marginBottom: 15,
//   },
//   subsectionTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginBottom: 8,
//   },
//   text: {
//     fontSize: 15,
//     color: '#666',
//     lineHeight: 22,
//   },
//   addNoteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   addNoteText: {
//     fontSize: 16,
//     color: '#1976d2',
//     marginLeft: 8,
//   },
//   noteActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 10,
//   },
//   cancelNoteButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 10,
//   },
//   cancelNoteText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   saveNoteButton: {
//     backgroundColor: '#1976d2',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   saveNoteText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   noteCard: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//   },
//   noteText: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 22,
//     marginBottom: 10,
//   },
//   noteMeta: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   noteAuthor: {
//     fontSize: 13,
//     color: '#1976d2',
//     fontWeight: '500',
//   },
//   noteDate: {
//     fontSize: 13,
//     color: '#999',
//   },
// });





















// app/(app)/business/[id]/competitors/[competitorId].js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BusinessApi from '../../../../../../services/businessApi';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import FormInput from '../../../../../../components/business/ui/FormInput';
import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../../../components/common/Header';
import { formatDate, formatNumber } from '../../../../../../utils/formatters';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CompetitorDetailScreen() {
  const { id, competitorId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['competitor', id, competitorId],
    queryFn: () => BusinessApi.getCompetitor(id, competitorId),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => BusinessApi.updateCompetitor(id, competitorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitor', id, competitorId]);
      queryClient.invalidateQueries(['competitors', id]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => BusinessApi.removeCompetitor(id, competitorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitors', id]);
      router.back();
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (note) => BusinessApi.addCompetitorNote(id, competitorId, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitor', id, competitorId]);
      setEditNote('');
      setIsEditing(false);
    },
  });

  const handleAddNote = () => {
    if (editNote.trim()) {
      addNoteMutation.mutate(editNote);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleOpenWebsite = () => {
    if (data?.competitor?.website) {
      let url = data.competitor.website;
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      Linking.openURL(url);
    }
  };

  const handleOpenSocial = (url) => {
    Linking.openURL(url);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.competitor) {
    return <ErrorMessage message={error?.message || 'Competitor not found'} onRetry={refetch} />;
  }

  const competitor = data.competitor;

  return (
    <View style={styles.container}>
      <Header
        title={competitor.name}
        showBack={true}
        rightComponent={
          <View style={styles.headerActions}>
            {competitor.website && (
              <TouchableOpacity style={styles.headerButton} onPress={handleOpenWebsite}>
                <Ionicons name="globe-outline" size={22} color="#333" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push(`/business/${id}/competitors/${competitorId}/edit`)}
            >
              <Ionicons name="create-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowDeleteDialog(true)}
            >
              <Ionicons name="trash-outline" size={22} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView>
        {/* Description */}
        {competitor.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{competitor.description}</Text>
          </View>
        )}

        {/* Social Media Accounts */}
        {competitor.socialAccounts?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media Presence</Text>
            {competitor.socialAccounts.map((account, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialCard}
                onPress={() => handleOpenSocial(account.url)}
              >
                <View style={styles.socialHeader}>
                  <Text style={styles.socialPlatformName}>
                    {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                  </Text>
                  <Text style={styles.socialUsername}>@{account.username}</Text>
                </View>
                <View style={styles.socialStats}>
                  <View style={styles.stat}>
                    <Ionicons name="people" size={16} color="#666" />
                    <Text style={styles.statValue}>{formatNumber(account.followers)}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="person-add" size={16} color="#666" />
                    <Text style={styles.statValue}>{formatNumber(account.following)}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="grid" size={16} color="#666" />
                    <Text style={styles.statValue}>{formatNumber(account.posts)}</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SWOT Analysis */}
        {(competitor.analysis?.strengths?.length > 0 ||
          competitor.analysis?.weaknesses?.length > 0 ||
          competitor.analysis?.opportunities?.length > 0 ||
          competitor.analysis?.threats?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SWOT Analysis</Text>
            
            {competitor.analysis.strengths?.length > 0 && (
              <View style={styles.swotSection}>
                <Text style={styles.swotTitle}>Strengths</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.strengths.map((item, index) => (
                    <View key={index} style={[styles.tag, styles.strengthTag]}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {competitor.analysis.weaknesses?.length > 0 && (
              <View style={styles.swotSection}>
                <Text style={styles.swotTitle}>Weaknesses</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.weaknesses.map((item, index) => (
                    <View key={index} style={[styles.tag, styles.weaknessTag]}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {competitor.analysis.opportunities?.length > 0 && (
              <View style={styles.swotSection}>
                <Text style={styles.swotTitle}>Opportunities</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.opportunities.map((item, index) => (
                    <View key={index} style={[styles.tag, styles.opportunityTag]}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {competitor.analysis.threats?.length > 0 && (
              <View style={styles.swotSection}>
                <Text style={styles.swotTitle}>Threats</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.threats.map((item, index) => (
                    <View key={index} style={[styles.tag, styles.threatTag]}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Market Analysis */}
        {(competitor.analysis?.marketShare > 0 ||
          competitor.analysis?.shareOfVoice > 0 ||
          competitor.analysis?.uniqueSellingPoints?.length > 0 ||
          competitor.analysis?.targetAudience?.length > 0 ||
          competitor.analysis?.pricing ||
          competitor.analysis?.positioning) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Market Analysis</Text>
            
            <View style={styles.metricsRow}>
              {competitor.analysis.marketShare > 0 && (
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{competitor.analysis.marketShare}%</Text>
                  <Text style={styles.metricLabel}>Market Share</Text>
                </View>
              )}
              {competitor.analysis.shareOfVoice > 0 && (
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{competitor.analysis.shareOfVoice}%</Text>
                  <Text style={styles.metricLabel}>Share of Voice</Text>
                </View>
              )}
            </View>

            {competitor.analysis.uniqueSellingPoints?.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Unique Selling Points</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.uniqueSellingPoints.map((usp, index) => (
                    <View key={index} style={[styles.tag, styles.uspTag]}>
                      <Text style={styles.tagText}>{usp}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {competitor.analysis.targetAudience?.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Target Audience</Text>
                <View style={styles.tagContainer}>
                  {competitor.analysis.targetAudience.map((audience, index) => (
                    <View key={index} style={[styles.tag, styles.audienceTag]}>
                      <Text style={styles.tagText}>{audience}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {competitor.analysis.pricing && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Pricing Strategy</Text>
                <Text style={styles.text}>{competitor.analysis.pricing}</Text>
              </View>
            )}

            {competitor.analysis.positioning && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Market Positioning</Text>
                <Text style={styles.text}>{competitor.analysis.positioning}</Text>
              </View>
            )}
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          
          {isEditing ? (
            <View>
              <FormInput
                value={editNote}
                onChangeText={setEditNote}
                placeholder="Add a note..."
                multiline
                numberOfLines={3}
              />
              <View style={styles.noteActions}>
                <TouchableOpacity 
                  style={styles.cancelNoteButton}
                  onPress={() => {
                    setIsEditing(false);
                    setEditNote('');
                  }}
                >
                  <Text style={styles.cancelNoteText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveNoteButton}
                  onPress={handleAddNote}
                >
                  <Text style={styles.saveNoteText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addNoteButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#1976d2" />
              <Text style={styles.addNoteText}>Add Note</Text>
            </TouchableOpacity>
          )}

          {competitor.notes?.map((note, index) => (
            <View key={index} style={styles.noteCard}>
              <Text style={styles.noteText}>{note.text}</Text>
              <View style={styles.noteMeta}>
                <Text style={styles.noteAuthor}>
                  {note.user?.firstName} {note.user?.lastName}
                </Text>
                <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Competitor"
        message={`Are you sure you want to delete ${competitor.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  socialCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialPlatformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  socialUsername: {
    fontSize: 14,
    color: '#666',
  },
  socialStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  swotSection: {
    marginBottom: 15,
  },
  swotTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  strengthTag: {
    backgroundColor: '#e8f5e9',
  },
  weaknessTag: {
    backgroundColor: '#ffebee',
  },
  opportunityTag: {
    backgroundColor: '#e3f2fd',
  },
  threatTag: {
    backgroundColor: '#fff3e0',
  },
  uspTag: {
    backgroundColor: '#f3e5f5',
  },
  audienceTag: {
    backgroundColor: '#e0f2f1',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  subsection: {
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
  },
  addNoteText: {
    fontSize: 16,
    color: '#1976d2',
    marginLeft: 8,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelNoteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  cancelNoteText: {
    color: '#666',
    fontSize: 14,
  },
  saveNoteButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveNoteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  noteCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteAuthor: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 13,
    color: '#999',
  },
});