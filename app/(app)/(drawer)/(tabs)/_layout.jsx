import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../hooks/useTheme";
import { useNotifications } from "../../../../hooks/useNotifications";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        // headerStyle: {
        //   backgroundColor: colors.surface,
        // },
        // headerTintColor: colors.text,
        // headerTitleStyle: {
        //   fontWeight: "600",
        // },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 80,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="content"
        options={{
          title: "Content",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="engagement"
        options={{
          title: "Engagement",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />

      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="campaigns/index"
        options={{
          title: "Campaign",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ❌ HIDE ALL OTHER ROUTES */}
      <Tabs.Screen name="content/create" options={{ href: null }} />
      <Tabs.Screen name="content/[id]" options={{ href: null }} />
      <Tabs.Screen name="content/edit/[id]" options={{ href: null }} />

      <Tabs.Screen name="engagement/mentions" options={{ href: null }} />
      <Tabs.Screen name="engagement/comments/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="engagement/conversation/[id]"
        options={{ href: null }}
      />

      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="campaigns/[id]" options={{ href: null }} />
    </Tabs>
  );
}
