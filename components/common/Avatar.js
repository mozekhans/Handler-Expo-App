import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../styles/theme';

const Avatar = ({
  source,
  name,
  size = 50,
  onPress,
  style,
  borderColor,
  borderWidth = 0,
  badge,
  badgeColor = theme.colors.success
}) => {
  const getInitials = () => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getFontSize = () => {
    if (size >= 60) return 24;
    if (size >= 40) return 18;
    return 14;
  };

  const renderAvatar = () => {
    if (source) {
      return (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth,
              borderColor: borderColor || theme.colors.border
            }
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.placeholder,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.primary + '20',
            borderWidth,
            borderColor: borderColor || theme.colors.border
          }
        ]}
      >
        <Text style={[styles.initials, { fontSize: getFontSize(), color: theme.colors.primary }]}>
          {getInitials()}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {renderAvatar()}
      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              right: size * 0.05,
              top: size * 0.05
            }
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
});

export default Avatar;