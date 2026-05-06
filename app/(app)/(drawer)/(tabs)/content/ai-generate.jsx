// // app/(app)/content/ai-generate.jsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useContent } from '../../../../../hooks/useContent';
// import Toast from '../../../../../components/content/Toast';
// import useToast from '../../../../../hooks/useToast';
// import { SOCIAL_PLATFORMS } from '../../../../../utils/constants';

// export default function AIGenerate() {
//   const router = useRouter();
//   const { generateAIContent, createContent } = useContent();
//   const { toast, showToast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [selectedPlatform, setSelectedPlatform] = useState('');
//   const [topic, setTopic] = useState('');
//   const [tone, setTone] = useState('professional');
//   const [generatedContent, setGeneratedContent] = useState(null);

//   const tones = [
//     { label: 'Professional', value: 'professional' },
//     { label: 'Casual', value: 'casual' },
//     { label: 'Humorous', value: 'humorous' },
//     { label: 'Inspirational', value: 'inspirational' },
//     { label: 'Educational', value: 'educational' },
//   ];

//   const handleGenerate = async () => {
//     if (!selectedPlatform) {
//       showToast('Please select a platform', 'error');
//       return;
//     }
//     if (!topic) {
//       showToast('Please enter a topic', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await generateAIContent(selectedPlatform, {
//         topic,
//         tone,
//         length: 'medium',
//       });
//       setGeneratedContent(result);
//       showToast('Content generated successfully!', 'success');
//     } catch (error) {
//       showToast(error.message || 'Failed to generate content', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!generatedContent) return;

//     try {
//       const contentData = {
//         title: topic,
//         content: {
//           text: generatedContent.text || generatedContent,
//           hashtags: generatedContent.hashtags || [],
//         },
//         platforms: [{ platform: selectedPlatform }],
//         aiGenerated: true,
//         aiPrompt: topic,
//         aiModel: 'GPT-4',
//         tags: [topic.toLowerCase().replace(/\s/g, '_')],
//       };

//       await createContent(contentData);
//       showToast('Content saved successfully!', 'success');
//       setTimeout(() => {
//         router.back();
//       }, 1500);
//     } catch (error) {
//       showToast(error.message || 'Failed to save content', 'error');
//     }
//   };

//   const handleRegenerate = () => {
//     setGeneratedContent(null);
//     handleGenerate();
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>🤖 AI Content Generator</Text>
//         <Text style={styles.subtitle}>
//           Generate engaging social media content using AI
//         </Text>
//       </View>

//       <View style={styles.form}>
//         <Text style={styles.label}>Platform</Text>
//         <View style={styles.platformGrid}>
//           {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => (
//             <TouchableOpacity
//               key={value}
//               style={[
//                 styles.platformButton,
//                 selectedPlatform === value && styles.platformButtonActive,
//               ]}
//               onPress={() => setSelectedPlatform(value)}
//             >
//               <Text
//                 style={[
//                   styles.platformButtonText,
//                   selectedPlatform === value && styles.platformButtonTextActive,
//                 ]}
//               >
//                 {key}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={styles.label}>Topic / Subject</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="What is your content about?"
//           value={topic}
//           onChangeText={setTopic}
//           multiline
//         />

//         <Text style={styles.label}>Tone of Voice</Text>
//         <View style={styles.toneContainer}>
//           {tones.map((t) => (
//             <TouchableOpacity
//               key={t.value}
//               style={[
//                 styles.toneButton,
//                 tone === t.value && styles.toneButtonActive,
//               ]}
//               onPress={() => setTone(t.value)}
//             >
//               <Text
//                 style={[
//                   styles.toneButtonText,
//                   tone === t.value && styles.toneButtonTextActive,
//                 ]}
//               >
//                 {t.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity
//           style={styles.generateButton}
//           onPress={handleGenerate}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.generateButtonText}>Generate Content</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {generatedContent && (
//         <View style={styles.result}>
//           <Text style={styles.resultTitle}>Generated Content</Text>
          
//           <View style={styles.previewCard}>
//             <Text style={styles.previewText}>
//               {typeof generatedContent === 'string' 
//                 ? generatedContent 
//                 : generatedContent.text || JSON.stringify(generatedContent, null, 2)}
//             </Text>
            
//             {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
//               <View style={styles.hashtags}>
//                 <Text style={styles.hashtagsTitle}>Suggested Hashtags:</Text>
//                 <View style={styles.hashtagList}>
//                   {generatedContent.hashtags.map((tag, index) => (
//                     <View key={index} style={styles.hashtag}>
//                       <Text style={styles.hashtagText}>#{tag}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}
//           </View>

//           <View style={styles.actionButtons}>
//             <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
//               <Text style={styles.regenerateButtonText}>Regenerate</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//               <Text style={styles.saveButtonText}>Save to Library</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

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
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   form: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 12,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     marginTop: 12,
//   },
//   platformGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 8,
//   },
//   platformButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//     minWidth: 80,
//     alignItems: 'center',
//   },
//   platformButtonActive: {
//     backgroundColor: '#007bff',
//   },
//   platformButtonText: {
//     fontSize: 14,
//     color: '#666',
//     textTransform: 'capitalize',
//   },
//   platformButtonTextActive: {
//     color: '#fff',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   toneContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   toneButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   toneButtonActive: {
//     backgroundColor: '#007bff',
//   },
//   toneButtonText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   toneButtonTextActive: {
//     color: '#fff',
//   },
//   generateButton: {
//     backgroundColor: '#007bff',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   generateButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   result: {
//     backgroundColor: '#fff',
//     marginTop: 12,
//     padding: 20,
//     marginBottom: 20,
//   },
//   resultTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   previewCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//   },
//   previewText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#333',
//   },
//   hashtags: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   hashtagsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#666',
//   },
//   hashtagList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   hashtag: {
//     backgroundColor: '#e7f3ff',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//   },
//   hashtagText: {
//     fontSize: 12,
//     color: '#007bff',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 16,
//   },
//   regenerateButton: {
//     flex: 1,
//     backgroundColor: '#6c757d',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   regenerateButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: '#28a745',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });























// app/(app)/content/ai-generate.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContent } from '../../../../../hooks/useContent';
import Toast from '../../../../../components/content/Toast';
import useToast from '../../../../../hooks/useToast';
import Header from '../../../../../components/common/Header';
import { SOCIAL_PLATFORMS } from '../../../../../utils/constants';

export default function AIGenerate() {
  const router = useRouter();
  const { generateAIContent, createContent } = useContent();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState(null);

  const tones = [
    { label: 'Professional', value: 'professional' },
    { label: 'Casual', value: 'casual' },
    { label: 'Humorous', value: 'humorous' },
    { label: 'Inspirational', value: 'inspirational' },
    { label: 'Educational', value: 'educational' },
  ];

  const handleGenerate = async () => {
    if (!selectedPlatform) {
      showToast('Please select a platform', 'error');
      return;
    }
    if (!topic) {
      showToast('Please enter a topic', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await generateAIContent(selectedPlatform, {
        topic,
        tone,
        length: 'medium',
      });
      setGeneratedContent(result);
      showToast('Content generated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to generate content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    try {
      const contentData = {
        title: topic,
        content: {
          text: generatedContent.text || generatedContent,
          hashtags: generatedContent.hashtags || [],
        },
        platforms: [{ platform: selectedPlatform }],
        aiGenerated: true,
        aiPrompt: topic,
        aiModel: 'GPT-4',
        tags: [topic.toLowerCase().replace(/\s/g, '_')],
      };

      await createContent(contentData);
      showToast('Content saved successfully!', 'success');
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to save content', 'error');
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    handleGenerate();
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Content Generator"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Generate engaging social media content using AI
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Platform</Text>
          <View style={styles.platformGrid}>
            {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.platformButton,
                  selectedPlatform === value && styles.platformButtonActive,
                ]}
                onPress={() => setSelectedPlatform(value)}
              >
                <Text
                  style={[
                    styles.platformButtonText,
                    selectedPlatform === value && styles.platformButtonTextActive,
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Topic / Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="What is your content about?"
            value={topic}
            onChangeText={setTopic}
            multiline
          />

          <Text style={styles.label}>Tone of Voice</Text>
          <View style={styles.toneContainer}>
            {tones.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.toneButton,
                  tone === t.value && styles.toneButtonActive,
                ]}
                onPress={() => setTone(t.value)}
              >
                <Text
                  style={[
                    styles.toneButtonText,
                    tone === t.value && styles.toneButtonTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Content</Text>
            )}
          </TouchableOpacity>
        </View>

        {generatedContent && (
          <View style={styles.result}>
            <Text style={styles.resultTitle}>Generated Content</Text>
            
            <View style={styles.previewCard}>
              <Text style={styles.previewText}>
                {typeof generatedContent === 'string' 
                  ? generatedContent 
                  : generatedContent.text || JSON.stringify(generatedContent, null, 2)}
              </Text>
              
              {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                <View style={styles.hashtags}>
                  <Text style={styles.hashtagsTitle}>Suggested Hashtags:</Text>
                  <View style={styles.hashtagList}>
                    {generatedContent.hashtags.map((tag, index) => (
                      <View key={index} style={styles.hashtag}>
                        <Text style={styles.hashtagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
                <Text style={styles.regenerateButtonText}>Regenerate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save to Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 12,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    alignItems: 'center',
  },
  platformButtonActive: {
    backgroundColor: '#007bff',
  },
  platformButtonText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  platformButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  toneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  toneButtonActive: {
    backgroundColor: '#007bff',
  },
  toneButtonText: {
    fontSize: 14,
    color: '#666',
  },
  toneButtonTextActive: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  hashtags: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  hashtagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  hashtagText: {
    fontSize: 12,
    color: '#007bff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});