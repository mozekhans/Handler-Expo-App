// components/Toast.jsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Toast = ({ visible, message, type = 'info' }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#17a2b8';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Toast;