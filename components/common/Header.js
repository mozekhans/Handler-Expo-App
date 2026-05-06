import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';

const Header = ({
  title,
  showBack = false,
  showMenu = false,
  rightComponent,
  onBackPress,
  onMenuPress,
  transparent = false,
  backgroundColor
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  // const handleMenu = () => {
  //   if (onMenuPress) {
  //     onMenuPress();
  //   } else {
  //     // Open drawer navigation
  //     navigation.dispatch(DrawerActions.openDrawer());
  //   }
  // };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      // Try to find drawer navigator in parent navigators
      let parent = navigation;
      while (parent) {
        if (parent.getParent) {
          const nextParent = parent.getParent();
          if (nextParent) {
            parent = nextParent;
            // Check if this navigator can handle drawer actions
            try {
              parent.dispatch(DrawerActions.openDrawer());
              return;
            } catch (e) {
              // Continue to next parent
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }
      console.warn('No drawer navigator found in parent chain');
    }
  };

  return (
    <View style={[
      styles.headerContainer,
      {
        paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8,
        backgroundColor: transparent ? 'transparent' : (backgroundColor || theme.colors.surface),
      }
    ]}>
      <View style={[
        styles.container,
        !transparent && styles.containerWithBorder
      ]}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.button}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          
          {showMenu && !showBack && (
            <TouchableOpacity onPress={handleMenu} style={styles.button}>
              <Ionicons name="menu" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: theme.spacing.md,
  },
  containerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48,
    justifyContent: 'flex-end',
  },
  button: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
});

export default Header;