import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

export default function ProgressBar({ 
  value, 
  maxValue = 100, 
  height = 8, 
  color = null,
  showLabel = true,
  labelPosition = 'right',
  animated = true
}) {
  const { colors } = useTheme();
  const progressColor = color || colors.primary;
  const percentage = Math.min(100, (value / maxValue) * 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(percentage);
    }
  }, [percentage, animated]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { height, backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthInterpolated,
              height,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary },
            labelPosition === 'right' && styles.labelRight,
            labelPosition === 'left' && styles.labelLeft,
          ]}
        >
          {percentage.toFixed(0)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    marginLeft: 8,
  },
  labelRight: {
    marginLeft: 8,
  },
  labelLeft: {
    marginRight: 8,
  },
});