import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const HashtagInput = ({ hashtags, onHashtagsChange, maxHashtags = 30 }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    '#marketing', '#socialmedia', '#business', '#growth', '#success',
    '#digitalmarketing', '#contentmarketing', '#branding', '#strategy'
  ]);

  const addHashtag = (tag) => {
    const cleanTag = tag.replace(/[^\w]/g, '');
    if (!cleanTag) return;
    
    const formattedTag = `#${cleanTag}`;
    
    if (!hashtags.includes(formattedTag) && hashtags.length < maxHashtags) {
      onHashtagsChange([...hashtags, formattedTag]);
    }
    setInputValue('');
  };

  const removeHashtag = (index) => {
    onHashtagsChange(hashtags.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addHashtag(inputValue.trim());
    }
  };

  const handleSuggestion = (tag) => {
    addHashtag(tag);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>#</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Add hashtag..."
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
          <Icon name="add" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {hashtags.length > 0 && (
        <View style={styles.hashtagsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hashtags.map((tag, index) => (
              <View key={index} style={styles.hashtagChip}>
                <Text style={styles.hashtagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeHashtag(index)}>
                  <Icon name="close" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.suggestions}>
        <Text style={styles.suggestionsTitle}>Suggestions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {suggestions.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleSuggestion(tag)}
            >
              <Text style={styles.suggestionText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.counter}>
        {hashtags.length} / {maxHashtags} hashtags
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  prefix: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: 48,
    color: theme.colors.text,
    fontSize: 16,
  },
  addButton: {
    padding: 8,
  },
  hashtagsContainer: {
    marginTop: 8,
    minHeight: 40,
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    gap: 4,
  },
  hashtagText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  suggestions: {
    marginTop: 12,
  },
  suggestionsTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  counter: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default HashtagInput;