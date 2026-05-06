import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { theme } from '../styles/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const { businesses, isLoading: businessLoading } = useBusiness();

  // Show loading spinner while checking auth status
  if (isLoading || businessLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Redirect based on authentication and business status
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
    // return <Redirect href="/(app)/dashboard" />;
  }

  if (isAuthenticated && (!businesses || businesses.length === 0)) {
    return <Redirect href="/(app)/(drawer)/business/select" />;
  }

  if (isAuthenticated && businesses && businesses.length > 0) {
    return <Redirect href="/(app)/dashboard" />;
  }

  // Fallback - should not reach here
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});