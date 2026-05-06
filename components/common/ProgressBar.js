import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated
} from 'react-native';
import { theme } from '../../styles/theme';

const ProgressBar = ({
  progress,
  height = 8,
  color = 'primary',
  backgroundColor = theme.colors.border,
  animated = true,
  duration = 500,
  style
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress / 100,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated, duration]);

  const getColor = () => {
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

  const width = animated ? progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  }) : `${progress}%`;

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <Animated.View
        style={[
          styles.progress,
          {
            width,
            height,
            backgroundColor: getColor(),
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});

export default ProgressBar;