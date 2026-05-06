// // import { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TextInput,
// //   TouchableOpacity,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// // } from 'react-native';
// // import { router, useLocalSearchParams } from 'expo-router';
// // import { Ionicons } from '@expo/vector-icons';
// // import DateTimePicker from '@react-native-community/datetimepicker';
// // import { useBusiness } from '../../../../../../hooks/useBusiness';
// // import { useContent } from '../../../../../../hooks/useContent';
// // import { useAI } from '../../../../../../hooks/useAI';
// // import { theme } from '../../../../../../styles/theme';
// // import Header from '../../../../../../components/common/Header';
// // import Button from '../../../../../../components/common/Button';
// // import LoadingIndicator from '../../../../../../components/common/LoadingIndicator';
// // import MediaPicker from '../../../../../../components/MediaPicker';
// // import HashtagInput from '../../../../../../components/HashtagInput';
// // import Chip from '../../../../../../components/common/Chip';

// // const PLATFORMS = [
// //   { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
// //   { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
// //   { id: 'twitter', name: 'Twitter', icon: 'logo-twitter' },
// //   { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin' },
// //   { id: 'tiktok', name: 'TikTok', icon: 'musical-notes-outline' },
// // ];

// // export default function EditPostScreen() {
// //   const { id } = useLocalSearchParams();
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [aiGenerating, setAiGenerating] = useState(false);
// //   const [title, setTitle] = useState('');
// //   const [content, setContent] = useState('');
// //   const [selectedPlatforms, setSelectedPlatforms] = useState([]);
// //   const [media, setMedia] = useState([]);
// //   const [hashtags, setHashtags] = useState([]);
// //   const [scheduledFor, setScheduledFor] = useState(null);
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);
// //   const [originalPost, setOriginalPost] = useState(null);
// //   const [error, setError] = useState('');

// //   const { currentBusiness } = useBusiness();
// //   const { getContentById, updateContent } = useContent();
// //   const { generateContent } = useAI();

// //   useEffect(() => {
// //     loadPost();
// //   }, []);

// //   const loadPost = async () => {
// //     try {
// //       setLoading(true);
// //       const post = await getContentById(id);
// //       setOriginalPost(post);
// //       setTitle(post.title);
// //       setContent(post.content?.text || '');
// //       setSelectedPlatforms(post.platforms || []);
// //       setMedia(post.media || []);
// //       setHashtags(post.hashtags || []);
// //       setScheduledFor(post.scheduledFor ? new Date(post.scheduledFor) : null);
// //     } catch (err) {
// //       Alert.alert('Error', 'Failed to load post');
// //       router.back();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const togglePlatform = (platformId) => {
// //     setSelectedPlatforms(prev =>
// //       prev.includes(platformId)
// //         ? prev.filter(id => id !== platformId)
// //         : [...prev, platformId]
// //     );
// //   };

// //   const handleGenerateAI = async () => {
// //     if (!title && !content) {
// //       Alert.alert('Info', 'Enter a topic to generate content');
// //       return;
// //     }

// //     try {
// //       setAiGenerating(true);
// //       const result = await generateContent(currentBusiness.id, {
// //         topic: title || content,
// //         platforms: selectedPlatforms,
// //       });
      
// //       setTitle(result.title || title);
// //       setContent(result.content || content);
// //       if (result.hashtags) {
// //         setHashtags([...hashtags, ...result.hashtags]);
// //       }
// //     } catch (err) {
// //       Alert.alert('Error', 'Failed to generate content');
// //     } finally {
// //       setAiGenerating(false);
// //     }
// //   };

// //   const handleSave = async () => {
// //     if (!title.trim()) {
// //       Alert.alert('Error', 'Please enter a title');
// //       return;
// //     }

// //     if (!content.trim()) {
// //       Alert.alert('Error', 'Please enter content');
// //       return;
// //     }

// //     if (selectedPlatforms.length === 0) {
// //       Alert.alert('Error', 'Please select at least one platform');
// //       return;
// //     }

// //     try {
// //       setSaving(true);
// //       await updateContent(id, {
// //         title,
// //         content: { text: content },
// //         platforms: selectedPlatforms,
// //         media: media.map(m => ({ uri: m.uri, type: m.type })),
// //         hashtags,
// //         scheduledFor: scheduledFor?.toISOString(),
// //       });
      
// //       Alert.alert('Success', 'Post updated successfully', [
// //         { text: 'OK', onPress: () => router.back() }
// //       ]);
// //     } catch (err) {
// //       setError(err.message || 'Failed to update post');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const onDateChange = (event, selectedDate) => {
// //     setShowDatePicker(false);
// //     if (selectedDate) {
// //       setScheduledFor(selectedDate);
// //     }
// //   };

// //   const onTimeChange = (event, selectedDate) => {
// //     setShowTimePicker(false);
// //     if (selectedDate) {
// //       const newDate = new Date(scheduledFor || new Date());
// //       newDate.setHours(selectedDate.getHours());
// //       newDate.setMinutes(selectedDate.getMinutes());
// //       setScheduledFor(newDate);
// //     }
// //   };

// //   if (loading) {
// //     return <LoadingIndicator fullScreen text="Loading post..." />;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <Header
// //         title="Edit Post"
// //         showBack={true}
// //         rightComponent={
// //           <Button
// //             title="Save"
// //             onPress={handleSave}
// //             loading={saving}
// //             disabled={saving}
// //             size="sm"
// //           />
// //         }
// //       />

// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         style={styles.keyboardView}
// //       >
// //         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
// //           <Button
// //             title={aiGenerating ? 'Generating...' : 'Regenerate with AI'}
// //             onPress={handleGenerateAI}
// //             disabled={aiGenerating}
// //             icon="bulb-outline"
// //             variant="outline"
// //             style={styles.aiButton}
// //           />

// //           <TextInput
// //             style={styles.titleInput}
// //             placeholder="Post Title"
// //             placeholderTextColor={theme.colors.placeholder}
// //             value={title}
// //             onChangeText={setTitle}
// //           />

// //           <TextInput
// //             style={styles.contentInput}
// //             placeholder="What's on your mind?"
// //             placeholderTextColor={theme.colors.placeholder}
// //             value={content}
// //             onChangeText={setContent}
// //             multiline
// //             numberOfLines={6}
// //             textAlignVertical="top"
// //           />

// //           <Text style={styles.sectionLabel}>Platforms</Text>
// //           <View style={styles.platformsContainer}>
// //             {PLATFORMS.map(platform => (
// //               <Chip
// //                 key={platform.id}
// //                 label={platform.name}
// //                 icon={platform.icon}
// //                 selected={selectedPlatforms.includes(platform.id)}
// //                 onPress={() => togglePlatform(platform.id)}
// //                 style={styles.platformChip}
// //               />
// //             ))}
// //           </View>

// //           <Text style={styles.sectionLabel}>Media</Text>
// //           <MediaPicker
// //             media={media}
// //             onMediaChange={setMedia}
// //             maxCount={10}
// //           />

// //           <Text style={styles.sectionLabel}>Hashtags</Text>
// //           <HashtagInput
// //             hashtags={hashtags}
// //             onHashtagsChange={setHashtags}
// //             maxHashtags={30}
// //           />

// //           <Text style={styles.sectionLabel}>Schedule (Optional)</Text>
// //           <View style={styles.scheduleContainer}>
// //             <TouchableOpacity
// //               style={styles.scheduleButton}
// //               onPress={() => setShowDatePicker(true)}
// //             >
// //               <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
// //               <Text style={styles.scheduleButtonText}>
// //                 {scheduledFor
// //                   ? scheduledFor.toLocaleDateString()
// //                   : 'Select Date'}
// //               </Text>
// //             </TouchableOpacity>

// //             {scheduledFor && (
// //               <TouchableOpacity
// //                 style={styles.scheduleButton}
// //                 onPress={() => setShowTimePicker(true)}
// //               >
// //                 <Ionicons name="time-outline" size={20} color={theme.colors.textSecondary} />
// //                 <Text style={styles.scheduleButtonText}>
// //                   {scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                 </Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           {error && (
// //             <Text style={styles.errorText}>{error}</Text>
// //           )}
// //         </ScrollView>
// //       </KeyboardAvoidingView>

// //       {showDatePicker && (
// //         <DateTimePicker
// //           value={scheduledFor || new Date()}
// //           mode="date"
// //           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //           onChange={onDateChange}
// //         />
// //       )}

// //       {showTimePicker && (
// //         <DateTimePicker
// //           value={scheduledFor || new Date()}
// //           mode="time"
// //           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //           onChange={onTimeChange}
// //         />
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: theme.colors.background,
// //   },
// //   keyboardView: {
// //     flex: 1,
// //   },
// //   content: {
// //     flex: 1,
// //     padding: theme.spacing.md,
// //   },
// //   aiButton: {
// //     marginBottom: theme.spacing.md,
// //   },
// //   titleInput: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: theme.colors.text,
// //     paddingVertical: theme.spacing.sm,
// //     marginBottom: theme.spacing.md,
// //     borderBottomWidth: 1,
// //     borderBottomColor: theme.colors.border,
// //   },
// //   contentInput: {
// //     fontSize: 16,
// //     color: theme.colors.text,
// //     padding: theme.spacing.sm,
// //     minHeight: 150,
// //     backgroundColor: theme.colors.surface,
// //     borderRadius: theme.borderRadius.sm,
// //     borderWidth: 1,
// //     borderColor: theme.colors.border,
// //     marginBottom: theme.spacing.md,
// //   },
// //   sectionLabel: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: theme.colors.text,
// //     marginBottom: theme.spacing.sm,
// //   },
// //   platformsContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     gap: theme.spacing.sm,
// //     marginBottom: theme.spacing.md,
// //   },
// //   platformChip: {
// //     marginRight: theme.spacing.xs,
// //     marginBottom: theme.spacing.xs,
// //   },
// //   scheduleContainer: {
// //     flexDirection: 'row',
// //     gap: theme.spacing.sm,
// //     marginBottom: theme.spacing.md,
// //   },
// //   scheduleButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: theme.colors.surface,
// //     borderWidth: 1,
// //     borderColor: theme.colors.border,
// //     borderRadius: theme.borderRadius.sm,
// //     padding: theme.spacing.sm,
// //     gap: theme.spacing.sm,
// //   },
// //   scheduleButtonText: {
// //     fontSize: 14,
// //     color: theme.colors.text,
// //   },
// //   errorText: {
// //     fontSize: 12,
// //     color: theme.colors.error,
// //     marginTop: theme.spacing.sm,
// //     textAlign: 'center',
// //   },
// // });



























// // app/(app)/content/edit/[id].jsx
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useContent } from '../../../../../../hooks/useContent';
// import ContentForm from '../../../../../../components/content/ContentForm';
// import Toast from '../../../../../../components/content/Toast';
// import useToast from '../../../../../../hooks/useToast';
// import LoadingSpinner from '../../../../../../components/content/LoadingSpinner';

// export default function EditContent() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { selectedContent, fetchContentById, updateContent, loading } = useContent();
//   const { toast, showToast } = useToast();
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (id) {
//       loadContent();
//     }
//   }, [id]);

//   const loadContent = async () => {
//     await fetchContentById(id);
//   };

//   const handleSubmit = async (formData) => {
//     if (submitting) return;
    
//     setSubmitting(true);
//     try {
//       await updateContent(id, formData);
//       showToast('Content updated successfully!', 'success');
      
//       setTimeout(() => {
//         router.back();
//       }, 1500);
//     } catch (error) {
//       showToast(error.message || 'Failed to update content', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatInitialData = () => {
//     if (!selectedContent) return null;
    
//     return {
//       title: selectedContent.title || '',
//       content: selectedContent.content || { text: '', media: [], hashtags: [], mentions: [] },
//       platforms: selectedContent.platforms || [],
//       scheduledFor: selectedContent.scheduledFor ? new Date(selectedContent.scheduledFor) : null,
//       tags: selectedContent.tags || [],
//       categories: selectedContent.categories || [],
//     };
//   };

//   if (loading || !selectedContent) {
//     return <LoadingSpinner />;
//   }

//   const initialData = formatInitialData();

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <ContentForm
//           initialData={initialData}
//           onSubmit={handleSubmit}
//           loading={loading || submitting}
//         />
//       </ScrollView>
//       <Toast {...toast} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
// });















// app/(app)/content/edit/[id].jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContent } from '../../../../../../hooks/useContent';
import ContentForm from '../../../../../../components/content/ContentForm';
import Toast from '../../../../../../components/content/Toast';
import useToast from '../../../../../../hooks/useToast';
import LoadingSpinner from '../../../../../../components/content/LoadingSpinner';
import Header from '../../../../../../components/common/Header';

export default function EditContent() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { selectedContent, fetchContentById, updateContent, loading } = useContent();
  const { toast, showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    await fetchContentById(id);
  };

  const handleSubmit = async (formData) => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      await updateContent(id, formData);
      showToast('Content updated successfully!', 'success');
      
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to update content', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatInitialData = () => {
    if (!selectedContent) return null;
    
    return {
      title: selectedContent.title || '',
      content: selectedContent.content || { text: '', media: [], hashtags: [], mentions: [] },
      platforms: selectedContent.platforms || [],
      scheduledFor: selectedContent.scheduledFor ? new Date(selectedContent.scheduledFor) : null,
      tags: selectedContent.tags || [],
      categories: selectedContent.categories || [],
    };
  };

  if (loading || !selectedContent) {
    return <LoadingSpinner />;
  }

  const initialData = formatInitialData();

  return (
    <View style={styles.container}>
      <Header
        title="Edit Content"
        showBack={true}
      />
      
      <ScrollView>
        <ContentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading || submitting}
        />
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
});