import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { theme } from '../../styles/theme';

const Card = ({
  children,
  onPress,
  style,
  contentStyle,
  elevation = 'sm',
  padding = 'md',
  bordered = true
}) => {
  // If onPress is provided, wrap with TouchableOpacity, otherwise use View
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.container,
        styles[elevation],
        bordered && styles.bordered,
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.content, styles[`padding${padding}`], contentStyle]}>
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  paddingxs: {
    padding: theme.spacing.xs,
  },
  paddingsm: {
    padding: theme.spacing.sm,
  },
  paddingmd: {
    padding: theme.spacing.md,
  },
  paddinglg: {
    padding: theme.spacing.lg,
  },
  paddingxl: {
    padding: theme.spacing.xl,
  },
  none: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  xs: {
    ...theme.shadows.xs,
  },
  sm: {
    ...theme.shadows.sm,
  },
  md: {
    ...theme.shadows.md,
  },
  lg: {
    ...theme.shadows.lg,
  },
  xl: {
    ...theme.shadows.xl,
  },
});

export default Card;