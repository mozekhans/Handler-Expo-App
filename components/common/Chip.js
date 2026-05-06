import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Avatar from './Avatar';
import { theme } from '../../styles/theme';

const Chip = ({
  label,
  icon,
  avatar,
  onPress,
  onDelete,
  selected = false,
  disabled = false,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  style
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    
    if (variant === 'filled') {
      if (selected) return theme.colors[color];
      return theme.colors.surface;
    }
    return 'transparent';
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border;
    if (selected) return theme.colors[color];
    return theme.colors.border;
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textDisabled;
    
    if (variant === 'filled' && selected) {
      return '#ffffff';
    }
    if (selected) return theme.colors[color];
    return theme.colors.text;
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.textDisabled;
    if (variant === 'filled' && selected) return '#ffffff';
    return theme.colors[color];
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 24;
      case 'md': return 32;
      case 'lg': return 40;
      default: return 32;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 12;
      case 'md': return 14;
      case 'lg': return 16;
      default: return 14;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getSize(),
        },
        variant === 'outlined' && styles.outlined,
        style
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {avatar && (
        <Avatar
          source={avatar}
          size={getSize() - 8}
          style={styles.avatar}
        />
      )}
      
      {icon && !avatar && (
        <Icon name={icon} size={getSize() - 12} color={getIconColor()} style={styles.icon} />
      )}
      
      <Text style={[styles.label, { color: getTextColor(), fontSize: getFontSize() }]}>
        {label}
      </Text>
      
      {onDelete && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={styles.deleteButton}
          disabled={disabled}
        >
          <Icon name="close" size={getSize() - 16} color={getIconColor()} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  outlined: {
    borderWidth: 1,
  },
  avatar: {
    marginRight: theme.spacing.xs,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontWeight: '500',
    marginHorizontal: theme.spacing.xs,
  },
  deleteButton: {
    marginLeft: theme.spacing.xs,
    padding: 2,
  },
});

export default Chip;