// src/components/ui/FormSlider.jsx
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const FormSlider = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  unit = '',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}{unit}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#1976d2"
        maximumTrackTintColor="#e0e0e0"
        thumbTintColor="#1976d2"
      />
      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>{minimumValue}{unit}</Text>
        <Text style={styles.rangeText}>{maximumValue}{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
  },
  rangeText: {
    fontSize: 12,
    color: '#999',
  },
});

export default FormSlider;