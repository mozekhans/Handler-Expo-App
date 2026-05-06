// src/components/ui/LoadingSpinner.jsx
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingSpinner = ({ size = 'large', color = '#1976d2', text }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});

export default LoadingSpinner;