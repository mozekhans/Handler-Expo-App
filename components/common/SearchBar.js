import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  autoFocus = false,
  showClear = true,
  onClear,
  containerStyle,
  inputStyle
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  const handleSubmit = () => {
    if (onSearch) onSearch(value);
  };

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused,
      containerStyle
    ]}>
      <Icon name="search" size={20} color={theme.colors.textSecondary} style={styles.icon} />
      
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      
      {showClear && value ? (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="close" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    height: 48,
  },
  containerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
});

export default SearchBar;