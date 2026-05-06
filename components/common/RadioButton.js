import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { theme } from '../../styles/theme';

const RadioButton = ({
  selected,
  onPress,
  label,
  value,
  disabled = false,
  color = theme.colors.primary,
  size = 'md',
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

  const getInnerSize = () => {
    return getSize() * 0.6;
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(value);
    }
  };

  const radioSize = getSize();
  const innerSize = getInnerSize();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radio,
          {
            width: radioSize,
            height: radioSize,
            borderRadius: radioSize / 2,
            borderColor: disabled ? theme.colors.border : (selected ? color : theme.colors.border),
          }
        ]}
      >
        {selected && (
          <View
            style={[
              styles.selected,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                backgroundColor: disabled ? theme.colors.border : color,
              }
            ]}
          />
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
  radio: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: theme.colors.primary,
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

export default RadioButton;