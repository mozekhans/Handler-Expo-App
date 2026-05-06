// import { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useBusiness } from '../../../../../hooks/useBusiness';
// import { useContent } from '../../../../../hooks/useContent';
// import { useAI } from '../../../../../hooks/useAI';
// import { theme } from '../../../../../styles/theme';
// import Header from '../../../../../components/common/Header';
// import Button from '../../../../../components/common/Button';
// import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
// import MediaPicker from '../../../../../components/MediaPicker';
// import HashtagInput from '../../../../../components/HashtagInput';
// import Chip from '../../../../../components/common/Chip';

// const PLATFORMS = [
//   { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
//   { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
//   { id: 'twitter', name: 'Twitter', icon: 'logo-twitter' },
//   { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin' },
//   { id: 'tiktok', name: 'TikTok', icon: 'musical-notes-outline' },
// ];

// export default function CreatePostScreen() {
//   const [loading, setLoading] = useState(false);
//   const [aiGenerating, setAiGenerating] = useState(false);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [selectedPlatforms, setSelectedPlatforms] = useState([]);
//   const [media, setMedia] = useState([]);
//   const [hashtags, setHashtags] = useState([]);
//   const [scheduledFor, setScheduledFor] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [error, setError] = useState('');

//   const { currentBusiness } = useBusiness();
//   const { createContent } = useContent();
//   const { generateContent, generateHashtags } = useAI();

//   const togglePlatform = (platformId) => {
//     setSelectedPlatforms(prev =>
//       prev.includes(platformId)
//         ? prev.filter(id => id !== platformId)
//         : [...prev, platformId]
//     );
//   };

//   const handleGenerateAI = async () => {
//     if (!title && !content) {
//       Alert.alert('Info', 'Enter a topic to generate content');
//       return;
//     }

//     try {
//       setAiGenerating(true);
//       const result = await generateContent(currentBusiness.id, {
//         topic: title || content,
//         platforms: selectedPlatforms,
//       });
      
//       setTitle(result.title || title);
//       setContent(result.content || content);
//       if (result.hashtags) {
//         setHashtags([...hashtags, ...result.hashtags]);
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to generate content');
//     } finally {
//       setAiGenerating(false);
//     }
//   };

//   const handleGenerateHashtags = async () => {
//     try {
//       const result = await generateHashtags(content, currentBusiness.id, 10);
//       setHashtags([...hashtags, ...result]);
//     } catch (err) {
//       Alert.alert('Error', 'Failed to generate hashtags');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title.trim()) {
//       Alert.alert('Error', 'Please enter a title');
//       return;
//     }

//     if (!content.trim()) {
//       Alert.alert('Error', 'Please enter content');
//       return;
//     }

//     if (selectedPlatforms.length === 0) {
//       Alert.alert('Error', 'Please select at least one platform');
//       return;
//     }

//     try {
//       setLoading(true);
//       await createContent(currentBusiness.id, {
//         title,
//         content: { text: content },
//         platforms: selectedPlatforms,
//         media: media.map(m => ({ uri: m.uri, type: m.type })),
//         hashtags,
//         scheduledFor: scheduledFor?.toISOString(),
//         status: scheduledFor ? 'scheduled' : 'published',
//       });
      
//       Alert.alert('Success', 'Post created successfully', [
//         { text: 'OK', onPress: () => router.back() }
//       ]);
//     } catch (err) {
//       setError(err.message || 'Failed to create post');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setScheduledFor(selectedDate);
//     }
//   };

//   const onTimeChange = (event, selectedDate) => {
//     setShowTimePicker(false);
//     if (selectedDate) {
//       const newDate = new Date(scheduledFor || new Date());
//       newDate.setHours(selectedDate.getHours());
//       newDate.setMinutes(selectedDate.getMinutes());
//       setScheduledFor(newDate);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         title="Create Post"
//         showBack={true}
//         rightComponent={
//           <Button
//             title="Post"
//             onPress={handleSubmit}
//             loading={loading}
//             disabled={loading}
//             size="sm"
//           />
//         }
//       />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//           <Button
//             title={aiGenerating ? 'Generating...' : 'Generate with AI'}
//             onPress={handleGenerateAI}
//             disabled={aiGenerating}
//             icon="bulb-outline"
//             variant="outline"
//             style={styles.aiButton}
//           />

//           <TextInput
//             style={styles.titleInput}
//             placeholder="Post Title"
//             placeholderTextColor={theme.colors.placeholder}
//             value={title}
//             onChangeText={setTitle}
//           />

//           <TextInput
//             style={styles.contentInput}
//             placeholder="What's on your mind?"
//             placeholderTextColor={theme.colors.placeholder}
//             value={content}
//             onChangeText={setContent}
//             multiline
//             numberOfLines={6}
//             textAlignVertical="top"
//           />

//           <Text style={styles.sectionLabel}>Platforms</Text>
//           <View style={styles.platformsContainer}>
//             {PLATFORMS.map(platform => (
//               <Chip
//                 key={platform.id}
//                 label={platform.name}
//                 icon={platform.icon}
//                 selected={selectedPlatforms.includes(platform.id)}
//                 onPress={() => togglePlatform(platform.id)}
//                 style={styles.platformChip}
//               />
//             ))}
//           </View>

//           <Text style={styles.sectionLabel}>Media</Text>
//           <MediaPicker
//             media={media}
//             onMediaChange={setMedia}
//             maxCount={10}
//           />

//           <Text style={styles.sectionLabel}>Hashtags</Text>
//           <HashtagInput
//             hashtags={hashtags}
//             onHashtagsChange={setHashtags}
//             maxHashtags={30}
//           />
//           <Button
//             title="Generate Hashtags"
//             onPress={handleGenerateHashtags}
//             variant="text"
//             size="sm"
//             style={styles.generateHashtagButton}
//           />

//           <Text style={styles.sectionLabel}>Schedule (Optional)</Text>
//           <View style={styles.scheduleContainer}>
//             <TouchableOpacity
//               style={styles.scheduleButton}
//               onPress={() => setShowDatePicker(true)}
//             >
//               <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
//               <Text style={styles.scheduleButtonText}>
//                 {scheduledFor
//                   ? scheduledFor.toLocaleDateString()
//                   : 'Select Date'}
//               </Text>
//             </TouchableOpacity>

//             {scheduledFor && (
//               <TouchableOpacity
//                 style={styles.scheduleButton}
//                 onPress={() => setShowTimePicker(true)}
//               >
//                 <Ionicons name="time-outline" size={20} color={theme.colors.textSecondary} />
//                 <Text style={styles.scheduleButtonText}>
//                   {scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {error && (
//             <Text style={styles.errorText}>{error}</Text>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {showDatePicker && (
//         <DateTimePicker
//           value={scheduledFor || new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={onDateChange}
//         />
//       )}

//       {showTimePicker && (
//         <DateTimePicker
//           value={scheduledFor || new Date()}
//           mode="time"
//           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//           onChange={onTimeChange}
//         />
//       )}

//       {loading && <LoadingIndicator overlay />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     padding: theme.spacing.md,
//   },
//   aiButton: {
//     marginBottom: theme.spacing.md,
//   },
//   titleInput: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.colors.text,
//     paddingVertical: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   contentInput: {
//     fontSize: 16,
//     color: theme.colors.text,
//     padding: theme.spacing.sm,
//     minHeight: 150,
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.sm,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     marginBottom: theme.spacing.md,
//   },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.sm,
//   },
//   platformsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//   },
//   platformChip: {
//     marginRight: theme.spacing.xs,
//     marginBottom: theme.spacing.xs,
//   },
//   scheduleContainer: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//   },
//   scheduleButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.surface,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.borderRadius.sm,
//     padding: theme.spacing.sm,
//     gap: theme.spacing.sm,
//   },
//   scheduleButtonText: {
//     fontSize: 14,
//     color: theme.colors.text,
//   },
//   generateHashtagButton: {
//     marginTop: theme.spacing.xs,
//     alignSelf: 'flex-start',
//   },
//   errorText: {
//     fontSize: 12,
//     color: theme.colors.error,
//     marginTop: theme.spacing.sm,
//     textAlign: 'center',
//   },
// });































// // app/(app)/content/create.jsx
// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useContent } from '../../../../../hooks/useContent';
// import ContentForm from '../../../../../components/content/ContentForm';
// import Toast from '../../../../../components/content/Toast';
// import useToast from '../../../../../hooks/useToast';

// export default function CreateContent() {
//   const router = useRouter();
//   const { createContent, loading } = useContent();
//   const { toast, showToast } = useToast();
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (formData) => {
//     if (submitting) return;
    
//     setSubmitting(true);
//     try {
//       const result = await createContent(formData);
//       showToast('Content created successfully!', 'success');
      
//       // Navigate back to content list after a short delay
//       setTimeout(() => {
//         router.back();
//       }, 1500);
//     } catch (error) {
//       showToast(error.message || 'Failed to create content', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <ContentForm
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












// app/(app)/content/create.jsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContent } from '../../../../../hooks/useContent';
import ContentForm from '../../../../../components/content/ContentForm';
import Toast from '../../../../../components/content/Toast';
import useToast from '../../../../../hooks/useToast';
import Header from '../../../../../components/common/Header';

export default function CreateContent() {
  const router = useRouter();
  const { createContent, loading } = useContent();
  const { toast, showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const result = await createContent(formData);
      showToast('Content created successfully!', 'success');
      
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to create content', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Create Content"
        showBack={true}
      />
      
      <ScrollView>
        <ContentForm
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