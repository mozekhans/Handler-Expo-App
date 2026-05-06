import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const Accordion = ({
  title,
  children,
  expanded = false,
  onExpand,
  showIcon = true,
  iconPosition = 'left',
  variant = 'standard',
  style
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const animation = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const contentHeight = useRef(0);

  useEffect(() => {
    setIsExpanded(expanded);
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const handlePress = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpand?.(newState);
  };

  const getIconName = () => {
    return isExpanded ? 'expand-less' : 'expand-more';
  };

  return (
    <View style={[styles.container, variant === 'bordered' && styles.bordered, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {showIcon && iconPosition === 'left' && (
          <Icon name={getIconName()} size={24} color={theme.colors.textSecondary} />
        )}
        <Text style={styles.title}>{title}</Text>
        {showIcon && iconPosition === 'right' && (
          <Icon name={getIconName()} size={24} color={theme.colors.textSecondary} />
        )}
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, contentHeight.current],
            }),
            opacity: animation,
          },
        ]}
      >
        <View
          onLayout={(event) => {
            contentHeight.current = event.nativeEvent.layout.height;
          }}
          style={styles.content}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
});

export default Accordion;