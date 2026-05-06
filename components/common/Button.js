import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const Button = ({
  title,
  onPress,
  variant = 'contained',
  size = 'md',
  color = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    
    switch (variant) {
      case 'contained':
        return theme.colors[color];
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textDisabled;
    
    switch (variant) {
      case 'contained':
        return '#ffffff';
      case 'outline':
      case 'text':
        return theme.colors[color];
      default:
        return theme.colors.primary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border;
    return variant === 'outline' ? theme.colors[color] : 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return theme.spacing.xs;
      case 'md':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.md;
      default:
        return theme.spacing.sm;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      default: return 20;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          padding: getPadding(),
          width: fullWidth ? '100%' : 'auto',
        },
        variant === 'outline' && styles.outline,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={[styles.content, iconPosition === 'right' && styles.contentReverse]}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={getIconSize()} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={getIconSize()} color={getTextColor()} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  outline: {
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentReverse: {
    flexDirection: 'row-reverse',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
});

export default Button;