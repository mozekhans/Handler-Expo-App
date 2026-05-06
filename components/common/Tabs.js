import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { theme } from '../../styles/theme';

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'standard',
  scrollable = false,
  style,
  tabStyle,
  activeTabStyle,
  indicatorStyle
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || 0);
  const scrollViewRef = useRef(null);
  const tabPositions = useRef([]);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeTab !== undefined && activeTab !== selectedTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (variant === 'underlined' && tabPositions.current[selectedTab]) {
      Animated.parallel([
        Animated.spring(indicatorPosition, {
          toValue: tabPositions.current[selectedTab].x,
          useNativeDriver: false,
          friction: 8,
        }),
        Animated.spring(indicatorWidth, {
          toValue: tabPositions.current[selectedTab].width,
          useNativeDriver: false,
          friction: 8,
        })
      ]).start();

      // Scroll to make tab visible
      if (scrollable && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: tabPositions.current[selectedTab].x - 20,
          animated: true
        });
      }
    }
  }, [selectedTab, variant]);

  const handleTabPress = (index) => {
    setSelectedTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const handleTabLayout = (index, event) => {
    const { x, width } = event.nativeEvent.layout;
    tabPositions.current[index] = { x, width };
    
    if (variant === 'underlined' && index === selectedTab) {
      indicatorPosition.setValue(x);
      indicatorWidth.setValue(width);
    }
  };

  const renderTab = (tab, index) => {
    const isActive = index === selectedTab;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.tab,
          variant === 'pills' && styles.pillTab,
          isActive && variant === 'pills' && styles.pillTabActive,
          tabStyle,
          isActive && activeTabStyle
        ]}
        onPress={() => handleTabPress(index)}
        onLayout={(event) => handleTabLayout(index, event)}
        activeOpacity={0.7}
      >
        {tab.icon && (
          <View style={styles.iconContainer}>
            {tab.icon}
          </View>
        )}
        <Text style={[
          styles.tabText,
          variant === 'pills' && styles.pillText,
          isActive && variant === 'pills' && styles.pillTextActive,
          isActive && variant === 'standard' && styles.activeText
        ]}>
          {tab.label}
        </Text>
        {tab.badge !== undefined && tab.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tab.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollable}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => renderTab(tab, index))}
          
          {variant === 'underlined' && (
            <Animated.View
              style={[
                styles.indicator,
                {
                  left: indicatorPosition,
                  width: indicatorWidth,
                },
                indicatorStyle
              ]}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'relative',
    minHeight: 48,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: 2,
  },
  pillTab: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: 4,
  },
  pillTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  pillText: {
    color: theme.colors.text,
  },
  pillTextActive: {
    color: '#ffffff',
  },
  activeText: {
    color: theme.colors.primary,
  },
  iconContainer: {
    marginRight: theme.spacing.xs,
  },
  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
  },
});

export default Tabs;