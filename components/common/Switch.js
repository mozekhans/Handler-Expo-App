import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import { theme } from '../../styles/theme';

const Switch = ({
  value,
  onValueChange,
  disabled = false,
  trackColor = { true: theme.colors.primary, false: theme.colors.border },
  thumbColor = '#ffffff',
  size = 'md',
  label,
  labelPosition = 'right',
  style
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [value]);

  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 40, height: 24, thumb: 20, thumbOffset: 2 };
      case 'md': return { width: 50, height: 30, thumb: 26, thumbOffset: 2 };
      case 'lg': return { width: 60, height: 36, thumb: 32, thumbOffset: 2 };
      default: return { width: 50, height: 30, thumb: 26, thumbOffset: 2 };
    }
  };

  const dimensions = getSize();

  const thumbTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [dimensions.thumbOffset, dimensions.width - dimensions.thumb - dimensions.thumbOffset]
  });

  const renderSwitch = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[
        styles.track,
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.height / 2,
          backgroundColor: value ? trackColor.true : trackColor.false,
          opacity: disabled ? 0.5 : 1,
        }
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: dimensions.thumb,
            height: dimensions.thumb,
            borderRadius: dimensions.thumb / 2,
            backgroundColor: thumbColor,
            transform: [{ translateX: thumbTranslate }],
          }
        ]}
      />
    </TouchableOpacity>
  );

  if (!label) return renderSwitch();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { flexDirection: labelPosition === 'right' ? 'row' : 'row-reverse' },
        style
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      activeOpacity={1}
    >
      {renderSwitch()}
      <Text style={[
        styles.label,
        labelPosition === 'right' ? { marginLeft: theme.spacing.sm } : { marginRight: theme.spacing.sm }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    justifyContent: 'center',
  },
  thumb: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default Switch;