import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { theme } from '../../styles/theme';

const Divider = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  text,
  color = theme.colors.border,
  thickness = 1,
  style
}) => {
  const getOrientationStyle = () => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: '100%',
        backgroundColor: color,
      };
    }
    
    if (variant === 'inset') {
      return {
        marginLeft: 72,
      };
    }
    
    if (variant === 'middle') {
      return {
        marginHorizontal: theme.spacing.md,
      };
    }
    
    return {};
  };

  if (text) {
    return (
      <View style={[styles.dividerWithText, style]}>
        <View style={[styles.line, { backgroundColor: color, height: thickness, flex: 1 }]} />
        <Text style={styles.text}>{text}</Text>
        <View style={[styles.line, { backgroundColor: color, height: thickness, flex: 1 }]} />
      </View>
    );
  }

  if (orientation === 'vertical') {
    return (
      <View style={[getOrientationStyle(), style]} />
    );
  }

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
        },
        getOrientationStyle(),
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
  dividerWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    backgroundColor: theme.colors.border,
  },
  text: {
    marginHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default Divider;