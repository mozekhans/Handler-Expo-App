import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal
} from 'react-native';
import { theme } from '../../styles/theme';

const LoadingIndicator = ({ visible = false, text = 'Loading...', fullScreen = false }) => {
  if (!visible) return null;

  if (fullScreen) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            {text && <Text style={styles.modalText}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minWidth: 200,
  },
  modalText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default LoadingIndicator;