// components/engagement/ActionSheet.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const { height } = Dimensions.get('window');

const ActionSheet = ({ visible, onClose, items, title }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose?.());
  };

  const handleItemPress = (item) => {
    handleClose();
    setTimeout(() => item.onPress?.(), 300);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.handle} />
          
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}

          {items?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              {item.icon && (
                <View style={[
                  styles.iconContainer,
                  item.destructive && styles.destructiveIcon,
                ]}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={item.destructive ? '#F44336' : item.iconColor || theme.colors.text}
                  />
                </View>
              )}
              <View style={styles.itemContent}>
                <Text
                  style={[
                    styles.actionText,
                    item.destructive && styles.destructiveText,
                  ]}
                >
                  {item.label}
                </Text>
                {item.subtitle && (
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destructiveIcon: {
    backgroundColor: '#F4433610',
  },
  itemContent: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  actionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: '#F44336',
  },
  badge: {
    backgroundColor: theme.colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 8,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});

export default ActionSheet;