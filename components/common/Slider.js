import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import { theme } from '../../styles/theme';

const Slider = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
  minimumTrackTintColor = theme.colors.primary,
  maximumTrackTintColor = theme.colors.border,
  thumbTintColor = theme.colors.primary,
  thumbSize = 24,
  trackHeight = 4,
  showValue = false,
  valueFormat = (v) => Math.round(v),
  style
}) => {
  const [width, setWidth] = useState(0);
  const panX = useRef(new Animated.Value(0)).current;

  const getPositionFromValue = (val) => {
    const clamped = Math.min(maximumValue, Math.max(minimumValue, val));
    return ((clamped - minimumValue) / (maximumValue - minimumValue)) * width;
  };

  const getValueFromPosition = (position) => {
    const ratio = Math.min(width, Math.max(0, position)) / width;
    const rawValue = minimumValue + (maximumValue - minimumValue) * ratio;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(maximumValue, Math.max(minimumValue, steppedValue));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        panX.setValue(getPositionFromValue(value));
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = Math.min(width, Math.max(0, gestureState.moveX - 0));
        panX.setValue(newPosition);
        const newValue = getValueFromPosition(newPosition);
        onValueChange?.(newValue);
      },
      onPanResponderRelease: () => {
        // Snap to step
        const position = panX._value;
        const newValue = getValueFromPosition(position);
        panX.setValue(getPositionFromValue(newValue));
        onValueChange?.(newValue);
      },
    })
  ).current;

  React.useEffect(() => {
    panX.setValue(getPositionFromValue(value));
  }, [value, width]);

  return (
    <View style={[styles.container, style]}>
      <View
        style={styles.sliderContainer}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        <View style={[styles.track, { height: trackHeight, backgroundColor: maximumTrackTintColor }]}>
          <Animated.View
            style={[
              styles.trackFill,
              {
                width: panX,
                height: trackHeight,
                backgroundColor: minimumTrackTintColor,
              }
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbTintColor,
              transform: [{ translateX: Animated.subtract(panX, thumbSize / 2) }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>

      {showValue && (
        <Text style={styles.valueText}>
          {valueFormat(value)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sliderContainer: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    borderRadius: 2,
    position: 'relative',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  valueText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default Slider;