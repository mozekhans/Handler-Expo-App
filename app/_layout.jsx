import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as WebBrowser from 'expo-web-browser';
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { BusinessProvider } from "../hooks/useBusiness";
import { NotificationProvider } from "../context/NotificationContext";
import { SocketProvider } from "../context/SocketContext";
import { AIProvider } from "../context/AIContext";
import { AnalyticsProvider } from "../context/AnalyticsContext";
import { CampaignProvider } from "../context/CampaignContext";
import { ContentProvider } from "../context/ContentContext";
import { EngagementProvider } from "../context/EngagementContext";
import { SubscriptionProvider } from "../context/SubscriptionContext";
import { SocialProvider } from "../context/SocialContext";
import { useAuth } from "../hooks/useAuth";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession();


function RootLayoutContent() {
  const { isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  useEffect(() => {
    // Initialize any required services here
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; // Or a loading screen
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BusinessProvider>
            <NotificationProvider>
              <SocketProvider>
                <AIProvider>
                  <AnalyticsProvider>
                    <CampaignProvider>
                      <ContentProvider>
                        <EngagementProvider>
                          <SubscriptionProvider>
                            <SocialProvider>
                              <StatusBar style="auto" />
                              <RootLayoutContent />
                            </SocialProvider>
                          </SubscriptionProvider>
                        </EngagementProvider>
                      </ContentProvider>
                    </CampaignProvider>
                  </AnalyticsProvider>
                </AIProvider>
              </SocketProvider>
            </NotificationProvider>
          </BusinessProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
