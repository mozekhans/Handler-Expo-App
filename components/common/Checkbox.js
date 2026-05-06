import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const Checkbox = ({
  checked,
  onPress,
  label,
  value,
  disabled = false,
  color = theme.colors.primary,
  size = 'md',
  indeterminate = false,
  style
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 20;
      default: return 16;
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(value);
    }
  };

  const boxSize = getSize();
  const iconSize = getIconSize();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: 4,
            borderColor: disabled ? theme.colors.border : (checked || indeterminate ? color : theme.colors.border),
            backgroundColor: checked || indeterminate ? color : 'transparent',
          }
        ]}
      >
        {indeterminate && (
          <View style={[styles.indeterminate, { width: boxSize * 0.6, height: 2, backgroundColor: '#ffffff' }]} />
        )}
        {checked && !indeterminate && (
          <Icon name="check" size={iconSize} color="#ffffff" />
        )}
      </View>
      
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indeterminate: {
    backgroundColor: '#ffffff',
  },
  label: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  labelDisabled: {
    color: theme.colors.textDisabled,
  },
});

export default Checkbox;