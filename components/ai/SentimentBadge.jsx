import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const SENTIMENT_CONFIG = {
  positive: {
    icon: 'happy-outline',
    label: 'Positive',
    color: '#4CAF50',
    bgOpacity: 0.15,
    score: 1,
  },
  'very positive': {
    icon: 'happy-outline',
    label: 'Very Positive',
    color: '#2E7D32',
    bgOpacity: 0.2,
    score: 1.5,
  },
  negative: {
    icon: 'sad-outline',
    label: 'Negative',
    color: '#F44336',
    bgOpacity: 0.15,
    score: -1,
  },
  'very negative': {
    icon: 'sad-outline',
    label: 'Very Negative',
    color: '#C62828',
    bgOpacity: 0.2,
    score: -1.5,
  },
  neutral: {
    icon: 'remove-circle-outline',
    label: 'Neutral',
    color: '#FF9800',
    bgOpacity: 0.15,
    score: 0,
  },
  mixed: {
    icon: 'help-circle-outline',
    label: 'Mixed',
    color: '#9C27B0',
    bgOpacity: 0.15,
    score: 0,
  },
  unknown: {
    icon: 'help-circle-outline',
    label: 'Unknown',
    color: '#9E9E9E',
    bgOpacity: 0.1,
    score: 0,
  },
};

export default function SentimentBadge({ 
  sentiment, 
  size = 'medium', 
  showIcon = true, 
  showLabel = true,
  showScore = false,
  score = null,
  compact = false,
  style = {},
}) {
  const { colors } = useTheme();
  
  // Normalize sentiment string
  const normalizedSentiment = sentiment?.toLowerCase() || 'unknown';
  const config = SENTIMENT_CONFIG[normalizedSentiment] || SENTIMENT_CONFIG.unknown;
  
  // Size configurations
  const sizeConfig = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 10,
      iconSize: 12,
      borderRadius: 10,
    },
    medium: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      fontSize: 12,
      iconSize: 14,
      borderRadius: 14,
    },
    large: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      fontSize: 14,
      iconSize: 16,
      borderRadius: 18,
    },
  };
  
  const currentSize = sizeConfig[size] || sizeConfig.medium;
  
  // Use provided score or default from config
  const displayScore = score !== null ? score : config.score;
  
  // Score indicator color
  const getScoreColor = () => {
    if (displayScore > 0.5) return '#4CAF50';
    if (displayScore > 0) return '#8BC34A';
    if (displayScore < -0.5) return '#F44336';
    if (displayScore < 0) return '#FF9800';
    return '#9E9E9E';
  };
  
  const getScoreIcon = () => {
    if (displayScore > 0) return 'trending-up';
    if (displayScore < 0) return 'trending-down';
    return 'remove';
  };
  
  if (compact) {
    return (
      <View
        style={[
          styles.compactBadge,
          {
            backgroundColor: config.color + '20',
            borderRadius: currentSize.borderRadius,
            paddingHorizontal: currentSize.paddingHorizontal,
            paddingVertical: currentSize.paddingVertical,
          },
          style,
        ]}
      >
        {showIcon && (
          <Ionicons
            name={config.icon}
            size={currentSize.iconSize}
            color={config.color}
          />
        )}
        {showLabel && (
          <Text
            style={[
              styles.compactText,
              {
                color: config.color,
                fontSize: currentSize.fontSize,
                marginLeft: showIcon ? 4 : 0,
              },
            ]}
          >
            {config.label}
          </Text>
        )}
      </View>
    );
  }
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color + '20',
          borderRadius: currentSize.borderRadius,
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {showIcon && (
          <Ionicons
            name={config.icon}
            size={currentSize.iconSize}
            color={config.color}
            style={styles.icon}
          />
        )}
        
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: config.color,
                fontSize: currentSize.fontSize,
                fontWeight: '500',
              },
            ]}
          >
            {config.label}
          </Text>
        )}
        
        {showScore && (
          <View style={[styles.scoreContainer, { marginLeft: showLabel ? 8 : 0 }]}>
            <Ionicons
              name={getScoreIcon()}
              size={currentSize.iconSize - 2}
              color={getScoreColor()}
            />
            <Text
              style={[
                styles.scoreText,
                {
                  color: getScoreColor(),
                  fontSize: currentSize.fontSize - 2,
                },
              ]}
            >
              {displayScore > 0 ? '+' : ''}{displayScore.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Sub-component for sentiment indicator dot (for lists, etc.)
export const SentimentDot = ({ sentiment, size = 8 }) => {
  const normalizedSentiment = sentiment?.toLowerCase() || 'unknown';
  const config = SENTIMENT_CONFIG[normalizedSentiment] || SENTIMENT_CONFIG.unknown;
  
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: config.color,
      }}
    />
  );
};

// Sub-component for sentiment meter (showing intensity)
export const SentimentMeter = ({ score, maxScore = 1.5 }) => {
  const { colors } = useTheme();
  const percentage = Math.min(100, Math.max(0, (Math.abs(score) / maxScore) * 100));
  const isPositive = score > 0;
  
  return (
    <View style={styles.meterContainer}>
      <View style={[styles.meterTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.meterFill,
            {
              width: `${percentage}%`,
              backgroundColor: isPositive ? '#4CAF50' : '#F44336',
            },
          ]}
        />
      </View>
      <Text style={[styles.meterText, { color: colors.textSecondary }]}>
        {isPositive ? 'Positive' : 'Negative'} Intensity: {Math.round(percentage)}%
      </Text>
    </View>
  );
};

// Sub-component for sentiment breakdown (for analytics)
export const SentimentBreakdown = ({ positive, neutral, negative, total }) => {
  const { colors } = useTheme();
  const totalCount = total || positive + neutral + negative;
  
  const positivePercent = totalCount > 0 ? (positive / totalCount) * 100 : 0;
  const neutralPercent = totalCount > 0 ? (neutral / totalCount) * 100 : 0;
  const negativePercent = totalCount > 0 ? (negative / totalCount) * 100 : 0;
  
  return (
    <View style={styles.breakdownContainer}>
      <View style={styles.breakdownBars}>
        <View
          style={[
            styles.breakdownBar,
            { width: `${positivePercent}%`, backgroundColor: '#4CAF50' },
          ]}
        />
        <View
          style={[
            styles.breakdownBar,
            { width: `${neutralPercent}%`, backgroundColor: '#FF9800' },
          ]}
        />
        <View
          style={[
            styles.breakdownBar,
            { width: `${negativePercent}%`, backgroundColor: '#F44336' },
          ]}
        />
      </View>
      <View style={styles.breakdownLabels}>
        <View style={styles.breakdownLabel}>
          <View style={[styles.breakdownDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>
            Positive ({positive})
          </Text>
        </View>
        <View style={styles.breakdownLabel}>
          <View style={[styles.breakdownDot, { backgroundColor: '#FF9800' }]} />
          <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>
            Neutral ({neutral})
          </Text>
        </View>
        <View style={styles.breakdownLabel}>
          <View style={[styles.breakdownDot, { backgroundColor: '#F44336' }]} />
          <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>
            Negative ({negative})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  scoreText: {
    fontWeight: '500',
    marginLeft: 2,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  compactText: {
    fontWeight: '500',
  },
  meterContainer: {
    marginTop: 4,
  },
  meterTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  meterFill: {
    height: '100%',
    borderRadius: 2,
  },
  meterText: {
    fontSize: 10,
  },
  breakdownContainer: {
    width: '100%',
  },
  breakdownBars: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  breakdownBar: {
    height: '100%',
  },
  breakdownLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  breakdownText: {
    fontSize: 11,
  },
});
