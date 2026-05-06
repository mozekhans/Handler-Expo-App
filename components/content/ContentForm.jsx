// components/ContentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PlatformSelector from './PlatformSelector';
import MediaPicker from './MediaPicker';
import { SOCIAL_PLATFORMS } from '../../utils/constants';

const ContentForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: {
      text: '',
      media: [],
      links: [],
      hashtags: [],
      mentions: [],
    },
    platforms: [],
    scheduledFor: null,
    tags: [],
    categories: [],
    aiGenerated: false,
  });
  
  const [hashtagInput, setHashtagInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.scheduledFor) {
        setScheduleEnabled(true);
      }
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !formData.content.hashtags.includes(hashtagInput.trim())) {
      handleContentChange('hashtags', [...formData.content.hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (index) => {
    const newHashtags = formData.content.hashtags.filter((_, i) => i !== index);
    handleContentChange('hashtags', newHashtags);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    handleChange('tags', newTags);
  };

  const handlePlatformSelect = (platforms) => {
    handleChange('platforms', platforms);
  };

  const handleMediaSelect = (media) => {
    handleContentChange('media', media);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('scheduledFor', selectedDate);
    }
  };

  const handleSubmit = () => {
    const submitData = { ...formData };
    
    if (!scheduleEnabled) {
      delete submitData.scheduledFor;
    }
    
    onSubmit(submitData);
  };

  const isFormValid = () => {
    if (formData.platforms.length === 0) return false;
    if (!formData.content.text && formData.content.media.length === 0) return false;
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>Title (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Give your content a title..."
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          maxLength={200}
        />
        <Text style={styles.counter}>{formData.title.length}/200</Text>
      </View>

      {/* Content Text */}
      <View style={styles.section}>
        <Text style={styles.label}>Content *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your post content here..."
          value={formData.content.text}
          onChangeText={(value) => handleContentChange('text', value)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.counter}>
          {formData.content.text.length}/10000 characters
        </Text>
      </View>

      {/* Media Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Media</Text>
        <MediaPicker
          media={formData.content.media}
          onMediaSelect={handleMediaSelect}
          multiple={true}
        />
      </View>

      {/* Platform Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>Platforms *</Text>
        <PlatformSelector
          selectedPlatforms={formData.platforms}
          onSelect={handlePlatformSelect}
        />
      </View>

      {/* Hashtags */}
      <View style={styles.section}>
        <Text style={styles.label}>Hashtags</Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, styles.addInput]}
            placeholder="Enter hashtag..."
            value={hashtagInput}
            onChangeText={setHashtagInput}
            onSubmitEditing={addHashtag}
          />
          <TouchableOpacity style={styles.addButton} onPress={addHashtag}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {formData.content.hashtags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
              <TouchableOpacity onPress={() => removeHashtag(index)}>
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Tags/Categories */}
      <View style={styles.section}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, styles.addInput]}
            placeholder="Enter tag..."
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addTag}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTag}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(index)}>
                <Text style={styles.removeTag}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Scheduling */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Schedule Post</Text>
          <Switch
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
            trackColor={{ false: '#767577', true: '#007bff' }}
          />
        </View>
        
        {scheduleEnabled && (
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.scheduledFor
                ? `Scheduled for: ${formData.scheduledFor.toLocaleString()}`
                : 'Select date and time'}
            </Text>
          </TouchableOpacity>
        )}
        
        {showDatePicker && (
          <DateTimePicker
            value={formData.scheduledFor || new Date()}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (!isFormValid() || loading) && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : initialData ? 'Update Content' : 'Create Content'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  addRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#495057',
    marginRight: 4,
  },
  removeTag: {
    fontSize: 18,
    color: '#dc3545',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContentForm;