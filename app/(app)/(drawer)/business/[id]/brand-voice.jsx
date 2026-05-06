// // app/(app)/business/[id]/brand-voice.js
// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
// import BusinessApi from '../../../../../services/businessApi';
// import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
// import FormSlider from '../../../../../components/business/ui/FormSlider';
// import TagInput from '../../../../../components/business/ui/TagInput';
// import BrandVoicePreview from '../../../../../components/business/BrandVoicePreview';
// import { TONE_OPTIONS } from '../../../../../utils/constants';

// export default function BrandVoiceScreen() {
//   const { id } = useLocalSearchParams();
//   const { business, loading, refetch } = useBusiness(id);
//   const [saving, setSaving] = useState(false);
//   const [brandVoice, setBrandVoice] = useState(null);

//   useEffect(() => {
//     if (business?.branding?.brandVoice) {
//       setBrandVoice(business.branding.brandVoice);
//     } else {
//       // Initialize with defaults
//       setBrandVoice({
//         tone: 'professional',
//         style: {
//           useEmojis: false,
//           useHashtags: true,
//           useMentions: true,
//           sentenceLength: 'medium',
//           formality: 7,
//           enthusiasm: 5,
//           humor: 3,
//         },
//         keywords: [],
//         bannedWords: [],
//         preferredWords: [],
//         samplePosts: [],
//       });
//     }
//   }, [business]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await BusinessApi.updateBrandVoice(id, { brandVoice });
//       Alert.alert('Success', 'Brand voice updated successfully');
//       await refetch();
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to update brand voice');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateStyle = (key, value) => {
//     setBrandVoice(prev => ({
//       ...prev,
//       style: { ...prev.style, [key]: value }
//     }));
//   };

//   if (loading || !brandVoice) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* Tone Selection */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Brand Tone</Text>
//           <Text style={styles.sectionDescription}>
//             Choose the primary tone that best represents your brand's voice
//           </Text>
          
//           <View style={styles.toneGrid}>
//             {(TONE_OPTIONS || []).map((tone) => (
//               <TouchableOpacity
//                 key={tone.value}
//                 style={[
//                   styles.toneOption,
//                   brandVoice.tone === tone.value && styles.toneOptionSelected
//                 ]}
//                 onPress={() => setBrandVoice(prev => ({ ...prev, tone: tone.value }))}
//               >
//                 <Text style={styles.toneIcon}>{tone.icon}</Text>
//                 <Text
//                   style={[
//                     styles.toneLabel,
//                     brandVoice.tone === tone.value && styles.toneLabelSelected
//                   ]}
//                 >
//                   {tone.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Style Preferences */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Style Preferences</Text>
          
//           <View style={styles.switchRow}>
//             <Text style={styles.switchLabel}>Use Emojis</Text>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 brandVoice.style.useEmojis && styles.toggleButtonActive
//               ]}
//               onPress={() => updateStyle('useEmojis', !brandVoice.style.useEmojis)}
//             >
//               <Text style={[
//                 styles.toggleButtonText,
//                 brandVoice.style.useEmojis && styles.toggleButtonTextActive
//               ]}>
//                 {brandVoice.style.useEmojis ? 'ON' : 'OFF'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.switchRow}>
//             <Text style={styles.switchLabel}>Use Hashtags</Text>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 brandVoice.style.useHashtags && styles.toggleButtonActive
//               ]}
//               onPress={() => updateStyle('useHashtags', !brandVoice.style.useHashtags)}
//             >
//               <Text style={[
//                 styles.toggleButtonText,
//                 brandVoice.style.useHashtags && styles.toggleButtonTextActive
//               ]}>
//                 {brandVoice.style.useHashtags ? 'ON' : 'OFF'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.switchRow}>
//             <Text style={styles.switchLabel}>Use Mentions</Text>
//             <TouchableOpacity
//               style={[
//                 styles.toggleButton,
//                 brandVoice.style.useMentions && styles.toggleButtonActive
//               ]}
//               onPress={() => updateStyle('useMentions', !brandVoice.style.useMentions)}
//             >
//               <Text style={[
//                 styles.toggleButtonText,
//                 brandVoice.style.useMentions && styles.toggleButtonTextActive
//               ]}>
//                 {brandVoice.style.useMentions ? 'ON' : 'OFF'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <FormSlider
//             label="Formality"
//             value={brandVoice.style.formality}
//             onValueChange={(value) => updateStyle('formality', value)}
//             minimumValue={1}
//             maximumValue={10}
//             step={1}
//           />

//           <FormSlider
//             label="Enthusiasm"
//             value={brandVoice.style.enthusiasm}
//             onValueChange={(value) => updateStyle('enthusiasm', value)}
//             minimumValue={1}
//             maximumValue={10}
//             step={1}
//           />

//           <FormSlider
//             label="Humor"
//             value={brandVoice.style.humor}
//             onValueChange={(value) => updateStyle('humor', value)}
//             minimumValue={1}
//             maximumValue={10}
//             step={1}
//           />

//           <View style={styles.sentenceLengthContainer}>
//             <Text style={styles.sliderLabel}>Sentence Length</Text>
//             <View style={styles.sentenceLengthOptions}>
//               {['short', 'medium', 'long'].map((length) => (
//                 <TouchableOpacity
//                   key={length}
//                   style={[
//                     styles.sentenceLengthOption,
//                     brandVoice.style.sentenceLength === length && styles.sentenceLengthOptionSelected
//                   ]}
//                   onPress={() => updateStyle('sentenceLength', length)}
//                 >
//                   <Text
//                     style={[
//                       styles.sentenceLengthText,
//                       brandVoice.style.sentenceLength === length && styles.sentenceLengthTextSelected
//                     ]}
//                   >
//                     {length.charAt(0).toUpperCase() + length.slice(1)}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* Keywords */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Brand Keywords</Text>
//           <Text style={styles.sectionDescription}>
//             Keywords that are commonly associated with your brand
//           </Text>
          
//           <TagInput
//             tags={brandVoice.keywords || []} 
//             onTagsChange={(keywords) => setBrandVoice(prev => ({ ...prev, keywords }))}
//             placeholder="Add a keyword"
//           />
//         </View>

//         {/* Preferred Words */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Preferred Words</Text>
//           <Text style={styles.sectionDescription}>
//             Words you prefer to use in your content
//           </Text>
          
//           <TagInput
//             tags={brandVoice.preferredWords || []}
//             onTagsChange={(preferredWords) => setBrandVoice(prev => ({ ...prev, preferredWords }))}
//             placeholder="Add a preferred word"
//             tagStyle="preferred"
//           />
//         </View>

//         {/* Banned Words */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Banned Words</Text>
//           <Text style={styles.sectionDescription}>
//             Words that should never appear in your content
//           </Text>
          
//           <TagInput
//             tags={brandVoice.bannedWords || []}
//             onTagsChange={(bannedWords) => setBrandVoice(prev => ({ ...prev, bannedWords }))}
//             placeholder="Add a banned word"
//             tagStyle="banned"
//           />
//         </View>

//         {/* Preview */}
//         <BrandVoicePreview brandVoice={brandVoice} />

//         {/* Actions */}
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             {saving ? (
//               <LoadingSpinner size="small" color="#fff" />
//             ) : (
//               <Text style={styles.saveButtonText}>Save Changes</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     padding: 20,
//   },
//   section: {
//     marginBottom: 30,
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
//     marginBottom: 15,
//   },
//   toneGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -5,
//   },
//   toneOption: {
//     width: '23%',
//     margin: '1%',
//     padding: 12,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   toneOptionSelected: {
//     backgroundColor: '#e3f2fd',
//     borderColor: '#1976d2',
//   },
//   toneIcon: {
//     fontSize: 24,
//     marginBottom: 5,
//   },
//   toneLabel: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   toneLabelSelected: {
//     color: '#1976d2',
//     fontWeight: '600',
//   },
//   switchRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   switchLabel: {
//     fontSize: 16,
//     color: '#333',
//   },
//   toggleButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   toggleButtonActive: {
//     backgroundColor: '#1976d2',
//     borderColor: '#1976d2',
//   },
//   toggleButtonText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#666',
//   },
//   toggleButtonTextActive: {
//     color: '#fff',
//   },
//   sentenceLengthContainer: {
//     marginTop: 15,
//   },
//   sliderLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   sentenceLengthOptions: {
//     flexDirection: 'row',
//     marginTop: 10,
//   },
//   sentenceLengthOption: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   sentenceLengthOptionSelected: {
//     backgroundColor: '#1976d2',
//     borderColor: '#1976d2',
//   },
//   sentenceLengthText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   sentenceLengthTextSelected: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: '#1976d2',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
























// app/(app)/business/[id]/brand-voice.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
import BusinessApi from '../../../../../services/businessApi';
import LoadingSpinner from '../../../../../components/business/ui/LoadingSpinner';
import FormSlider from '../../../../../components/business/ui/FormSlider';
import TagInput from '../../../../../components/business/ui/TagInput';
import BrandVoicePreview from '../../../../../components/business/BrandVoicePreview';
import Header from '../../../../../components/common/Header';
import { TONE_OPTIONS } from '../../../../../utils/constants';

export default function BrandVoiceScreen() {
  const { id } = useLocalSearchParams();
  const { business, loading, refetch } = useBusiness(id);
  const [saving, setSaving] = useState(false);
  const [brandVoice, setBrandVoice] = useState(null);

  useEffect(() => {
    if (business?.branding?.brandVoice) {
      setBrandVoice(business.branding.brandVoice);
    } else {
      setBrandVoice({
        tone: 'professional',
        style: {
          useEmojis: false,
          useHashtags: true,
          useMentions: true,
          sentenceLength: 'medium',
          formality: 7,
          enthusiasm: 5,
          humor: 3,
        },
        keywords: [],
        bannedWords: [],
        preferredWords: [],
        samplePosts: [],
      });
    }
  }, [business]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await BusinessApi.updateBrandVoice(id, { brandVoice });
      Alert.alert('Success', 'Brand voice updated successfully');
      await refetch();
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update brand voice');
    } finally {
      setSaving(false);
    }
  };

  const updateStyle = (key, value) => {
    setBrandVoice(prev => ({
      ...prev,
      style: { ...prev.style, [key]: value }
    }));
  };

  if (loading || !brandVoice) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Brand Voice"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.content}>
          {/* Tone Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand Tone</Text>
            <Text style={styles.sectionDescription}>
              Choose the primary tone that best represents your brand's voice
            </Text>
            
            <View style={styles.toneGrid}>
              {(TONE_OPTIONS || []).map((tone) => (
                <TouchableOpacity
                  key={tone.value}
                  style={[
                    styles.toneOption,
                    brandVoice.tone === tone.value && styles.toneOptionSelected
                  ]}
                  onPress={() => setBrandVoice(prev => ({ ...prev, tone: tone.value }))}
                >
                  <Text style={styles.toneIcon}>{tone.icon}</Text>
                  <Text
                    style={[
                      styles.toneLabel,
                      brandVoice.tone === tone.value && styles.toneLabelSelected
                    ]}
                  >
                    {tone.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Style Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Style Preferences</Text>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Use Emojis</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  brandVoice.style.useEmojis && styles.toggleButtonActive
                ]}
                onPress={() => updateStyle('useEmojis', !brandVoice.style.useEmojis)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  brandVoice.style.useEmojis && styles.toggleButtonTextActive
                ]}>
                  {brandVoice.style.useEmojis ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Use Hashtags</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  brandVoice.style.useHashtags && styles.toggleButtonActive
                ]}
                onPress={() => updateStyle('useHashtags', !brandVoice.style.useHashtags)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  brandVoice.style.useHashtags && styles.toggleButtonTextActive
                ]}>
                  {brandVoice.style.useHashtags ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Use Mentions</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  brandVoice.style.useMentions && styles.toggleButtonActive
                ]}
                onPress={() => updateStyle('useMentions', !brandVoice.style.useMentions)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  brandVoice.style.useMentions && styles.toggleButtonTextActive
                ]}>
                  {brandVoice.style.useMentions ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <FormSlider
              label="Formality"
              value={brandVoice.style.formality}
              onValueChange={(value) => updateStyle('formality', value)}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />

            <FormSlider
              label="Enthusiasm"
              value={brandVoice.style.enthusiasm}
              onValueChange={(value) => updateStyle('enthusiasm', value)}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />

            <FormSlider
              label="Humor"
              value={brandVoice.style.humor}
              onValueChange={(value) => updateStyle('humor', value)}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />

            <View style={styles.sentenceLengthContainer}>
              <Text style={styles.sliderLabel}>Sentence Length</Text>
              <View style={styles.sentenceLengthOptions}>
                {['short', 'medium', 'long'].map((length) => (
                  <TouchableOpacity
                    key={length}
                    style={[
                      styles.sentenceLengthOption,
                      brandVoice.style.sentenceLength === length && styles.sentenceLengthOptionSelected
                    ]}
                    onPress={() => updateStyle('sentenceLength', length)}
                  >
                    <Text
                      style={[
                        styles.sentenceLengthText,
                        brandVoice.style.sentenceLength === length && styles.sentenceLengthTextSelected
                      ]}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Keywords */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand Keywords</Text>
            <Text style={styles.sectionDescription}>
              Keywords that are commonly associated with your brand
            </Text>
            
            <TagInput
              tags={brandVoice.keywords || []} 
              onTagsChange={(keywords) => setBrandVoice(prev => ({ ...prev, keywords }))}
              placeholder="Add a keyword"
            />
          </View>

          {/* Preferred Words */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Words</Text>
            <Text style={styles.sectionDescription}>
              Words you prefer to use in your content
            </Text>
            
            <TagInput
              tags={brandVoice.preferredWords || []}
              onTagsChange={(preferredWords) => setBrandVoice(prev => ({ ...prev, preferredWords }))}
              placeholder="Add a preferred word"
              tagStyle="preferred"
            />
          </View>

          {/* Banned Words */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Banned Words</Text>
            <Text style={styles.sectionDescription}>
              Words that should never appear in your content
            </Text>
            
            <TagInput
              tags={brandVoice.bannedWords || []}
              onTagsChange={(bannedWords) => setBrandVoice(prev => ({ ...prev, bannedWords }))}
              placeholder="Add a banned word"
              tagStyle="banned"
            />
          </View>

          {/* Preview */}
          <BrandVoicePreview brandVoice={brandVoice} />

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
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
    marginBottom: 15,
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  toneOption: {
    width: '23%',
    margin: '1%',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toneOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  toneIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  toneLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  toneLabelSelected: {
    color: '#1976d2',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  sentenceLengthContainer: {
    marginTop: 15,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sentenceLengthOptions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sentenceLengthOption: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sentenceLengthOptionSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  sentenceLengthText: {
    fontSize: 14,
    color: '#666',
  },
  sentenceLengthTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});