// src/components/ui/FormInput.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  success,
  warning,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  maxLength,
  editable = true,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helper,
  variant = 'default', // default, outlined, filled
  size = 'medium', // small, medium, large
  returnKeyType = 'default',
  onSubmitEditing,
  blurOnSubmit = true,
  autoFocus = false,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [animatedLabel] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const getBorderColor = () => {
    if (error) return '#d32f2f';
    if (success) return '#4caf50';
    if (warning) return '#ff9800';
    if (isFocused) return '#1976d2';
    return '#e0e0e0';
  };

  const getBackgroundColor = () => {
    if (disabled) return '#f5f5f5';
    if (variant === 'filled') return '#f5f5f5';
    return '#fff';
  };

  const getInputHeight = () => {
    if (multiline) return Math.max(100, numberOfLines * 40);
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const labelStyle = {
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [size === 'small' ? 12 : 14, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [size === 'small' ? 14 : 16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ['#999', error ? '#d32f2f' : '#1976d2'],
    }),
  };

  return (
    <View style={styles.container}>
      {label && variant !== 'floating' && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, disabled && styles.disabledText]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
          {maxLength && (
            <Text style={styles.counter}>
              {value?.length || 0}/{maxLength}
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            minHeight: getInputHeight(),
          },
          variant === 'outlined' && styles.outlined,
          variant === 'filled' && styles.filled,
          isFocused && styles.focused,
          error && styles.error,
          success && styles.success,
          disabled && styles.disabled,
          multiline && styles.multilineWrapper,
        ]}
      >
        {variant === 'floating' && label && (
          <Animated.Text style={[styles.floatingLabel, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        )}

        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            {
              minHeight: getInputHeight(),
              paddingTop: variant === 'floating' && label ? (size === 'small' ? 18 : 20) : 0,
              paddingBottom: variant === 'floating' && label ? 4 : 0,
            },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            disabled && styles.disabledText,
            size === 'small' && styles.smallInput,
            size === 'large' && styles.largeInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={variant !== 'floating' ? placeholder : (isFocused ? placeholder : '')}
          placeholderTextColor="#999"
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          maxLength={maxLength}
          editable={editable && !disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          autoFocus={autoFocus}
          testID={testID}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={disabled}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress || disabled}
          >
            {rightIcon}
          </TouchableOpacity>
        )}

        {error && (
          <View style={styles.iconIndicator}>
            <Ionicons name="alert-circle" size={18} color="#d32f2f" />
          </View>
        )}

        {success && !error && (
          <View style={styles.iconIndicator}>
            <Ionicons name="checkmark-circle" size={18} color="#4caf50" />
          </View>
        )}

        {warning && !error && !success && (
          <View style={styles.iconIndicator}>
            <Ionicons name="warning" size={18} color="#ff9800" />
          </View>
        )}
      </View>

      {(error || success || warning || helper) && (
        <View style={styles.helperContainer}>
          {error && (
            <>
              <Ionicons name="alert-circle" size={14} color="#d32f2f" />
              <Text style={[styles.helperText, styles.errorText]}>{error}</Text>
            </>
          )}
          {success && !error && (
            <>
              <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
              <Text style={[styles.helperText, styles.successText]}>{success}</Text>
            </>
          )}
          {warning && !error && !success && (
            <>
              <Ionicons name="warning" size={14} color="#ff9800" />
              <Text style={[styles.helperText, styles.warningText]}>{warning}</Text>
            </>
          )}
          {helper && !error && !success && !warning && (
            <Text style={styles.helperText}>{helper}</Text>
          )}
        </View>
      )}

      {maxLength && variant === 'floating' && (
        <Text style={styles.floatingCounter}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#d32f2f',
  },
  counter: {
    fontSize: 12,
    color: '#999',
  },
  floatingCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'relative',
  },
  outlined: {
    backgroundColor: 'transparent',
  },
  filled: {
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderRadius: 8,
  },
  focused: {
    borderColor: '#1976d2',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: '#d32f2f',
  },
  success: {
    borderColor: '#4caf50',
  },
  disabled: {
    opacity: 0.6,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
  },
  floatingLabel: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
  },
  smallInput: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
  largeInput: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  iconIndicator: {
    paddingRight: 12,
  },
  disabledText: {
    color: '#999',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    flex: 1,
  },
  errorText: {
    color: '#d32f2f',
  },
  successText: {
    color: '#4caf50',
  },
  warningText: {
    color: '#ff9800',
  },
});

export default FormInput;