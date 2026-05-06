import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export default function GaugeChart({ 
  value, 
  maxValue = 100, 
  size = 120, 
  title,
  color = null,
  suffix = '%'
}) {
  const { colors } = useTheme();
  const gaugeColor = color || colors.primary;
  const percentage = Math.min(100, (value / maxValue) * 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={10}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={gaugeColor}
            strokeWidth={10}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        <SvgText
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fontSize={20}
          fontWeight="bold"
          fill={colors.text}
        >
          {value}{suffix}
        </SvgText>
      </Svg>
      {title && (
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    marginTop: 8,
  },
});