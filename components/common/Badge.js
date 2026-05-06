import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { theme } from '../../styles/theme';

const Badge = ({
  count,
  label,
  variant = 'standard',
  color = 'primary',
  size = 'md',
  dot = false,
  style
}) => {
  const getBackgroundColor = () => {
    switch (color) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return dot ? 8 : 16;
      case 'md': return dot ? 10 : 20;
      case 'lg': return dot ? 12 : 24;
      default: return dot ? 10 : 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 10;
      case 'md': return 12;
      case 'lg': return 14;
      default: return 12;
    }
  };

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: getBackgroundColor(),
            width: getSize(),
            height: getSize(),
            borderRadius: getSize() / 2,
          },
          style
        ]}
      />
    );
  }

  if (!count && !label) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          minWidth: getSize() * 1.5,
          height: getSize(),
          borderRadius: getSize() / 2,
          paddingHorizontal: getSize() * 0.3,
        },
        style
      ]}
    >
      <Text style={[styles.text, { fontSize: getFontSize() }]}>
        {label || (count > 99 ? '99+' : count)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    margin: 2,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default Badge;