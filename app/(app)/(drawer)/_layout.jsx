// import { Drawer } from 'expo-router/drawer';
// import 'react-native-reanimated';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../../../hooks/useTheme';
// import { useNotifications } from '../../../hooks/useNotifications';
// import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
// import { router, usePathname } from 'expo-router';

// function CustomDrawerContent({ navigation }) {
//   const { colors } = useTheme();
//   const { unreadCount } = useNotifications();
//   const pathname = usePathname();

//   const menuItems = [
//     { name: 'dashboard', title: 'Dashboard', icon: 'grid-outline', path: '/app/(app)/(drawer)/(tabs)/dashboard' },
//     // { name: 'content', title: 'Content', icon: 'create-outline', path: '/app/(app)/(tabs)/content' },
//     // { name: 'engagement', title: 'Engagement', icon: 'chatbubbles-outline', path: '/app/app/(app)/(tabs)/engagement' },
//     // { name: 'analytics', title: 'Analytics', icon: 'stats-chart-outline', path: '/app/(app)/(analytics)' },
//     // { name: 'calendar', title: 'Calendar', icon: 'calendar-outline', path: '/app/(app)/(calendar)' },
//     // { name: 'campaigns', title: 'Campaigns', icon: 'megaphone-outline', path: '/app/(app)/(tabs)/campaigns' },
//     // { name: 'media', title: 'Media Library', icon: 'images-outline', path: '/app/(app)/(media)' },
//     // { name: 'profile', title: 'Profile', icon: 'person-outline', path: '/app/(app)/(tabs)/profile' },
//     // { name: 'settings', title: 'Settings', icon: 'settings-outline', path: '/app/(app)/(settings)' },
//     // { name: 'help', title: 'Help Center', icon: 'help-circle-outline', path: '/(help)/help-center' },
//   ];

//   const isActive = (path) => {
//     return pathname.includes(path);
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={[styles.drawerContainer, { backgroundColor: colors.surface }]}>
//         <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
//           <Text style={[styles.drawerTitle, { color: colors.text }]}>AI Social Media</Text>
//           <Text style={[styles.drawerSubtitle, { color: colors.textSecondary }]}>Manager</Text>
//         </View>

//         {menuItems.map((item) => (
//           <TouchableOpacity
//             key={item.name}
//             style={[
//               styles.drawerItem,
//               isActive(item.path) && [styles.drawerItemActive, { backgroundColor: colors.primary + '15' }]
//             ]}
//             onPress={() => {
//               navigation.closeDrawer();
//               router.push(item.path);
//             }}
//           >
//             <Ionicons
//               name={item.icon}
//               size={24}
//               color={isActive(item.path) ? colors.primary : colors.text}
//             />
//             <Text style={[
//               styles.drawerItemText,
//               { color: isActive(item.path) ? colors.primary : colors.text },
//               { flex: 1 }
//             ]}>
//               {item.title}
//             </Text>
//             {item.name === 'engagement' && unreadCount > 0 && (
//               <View style={[styles.badge, { backgroundColor: colors.error }]}>
//                 <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}

//         <View style={{ flex: 1 }} />

//         <TouchableOpacity
//           style={[styles.drawerItem, styles.logoutItem, { borderTopColor: colors.border }]}
//           onPress={() => {
//             navigation.closeDrawer();
//             router.push('/(auth)/login');
//           }}
//         >
//           <Ionicons name="log-out-outline" size={24} color={colors.error} />
//           <Text style={[styles.drawerItemText, { color: colors.error, flex: 1 }]}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// export default function DrawerLayout() {
//   const { colors } = useTheme();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         drawerContent={CustomDrawerContent}
//         screenOptions={{
//           headerShown: true,
//           drawerStyle: {
//             width: 280,
//           },
//           drawerType: 'front',
//           overlayColor: 'rgba(0,0,0,0.5)',
//         }}
//       >
//         <Drawer.Screen
//           name="dashboard"
//           options={{
//             drawerLabel: 'Dashboard',
//             drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
//           }}
//         />
//         {/* <Drawer.Screen
//           name="content"
//           options={{
//             drawerLabel: 'Content',
//             drawerIcon: ({ color, size }) => <Ionicons name="create-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="engagement"
//           options={{
//             drawerLabel: 'Engagement',
//             drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="analytics"
//           options={{
//             drawerLabel: 'Analytics',
//             drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="calendar"
//           options={{
//             drawerLabel: 'Calendar',
//             drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="campaigns"
//           options={{
//             drawerLabel: 'Campaigns',
//             drawerIcon: ({ color, size }) => <Ionicons name="megaphone-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="media"
//           options={{
//             drawerLabel: 'Media Library',
//             drawerIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="profile"
//           options={{
//             drawerLabel: 'Profile',
//             drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
//           }}
//         />
//         <Drawer.Screen
//           name="settings"
//           options={{
//             drawerLabel: 'Settings',
//             drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
//           }}
//         /> */}
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContainer: {
//     flex: 1,
//     paddingTop: 60,
//   },
//   drawerHeader: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     marginBottom: 8,
//   },
//   drawerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   drawerSubtitle: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     gap: 12,
//   },
//   drawerItemActive: {
//     borderRightWidth: 3,
//     borderRightColor: '#1976d2',
//   },
//   drawerItemText: {
//     fontSize: 16,
//   },
//   logoutItem: {
//     borderTopWidth: 1,
//     marginTop: 8,
//     paddingTop: 16,
//   },
//   badge: {
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '600',
//   },
// });

import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../hooks/useTheme";
import { useNotifications } from "../../../hooks/useNotifications";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { router, usePathname } from "expo-router";

function CustomDrawerContent({ navigation }) {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "dashboard",
      title: "Dashboard",
      icon: "grid-outline",
      path: "/dashboard",
    },
    {
      name: "content",
      title: "Content",
      icon: "create-outline",
      path: "/content",
    },
    {
      name: "engagement",
      title: "Engagement",
      icon: "chatbubbles-outline",
      path: "/engagement",
    },
    {
      name: "social",
      title: "Social Platfrom",
      icon: "settings-outline",
      path: "/social",
    },
     {
      name: "business",
      title: "Business",
      icon: "settings-outline",
      path: "/business",
    },
    {
      name: "analytics",
      title: "Analytics",
      icon: "stats-chart-outline",
      path: "/analytics",
    },
    {
      name: "calendar",
      title: "Calendar",
      icon: "calendar-outline",
      path: "/calendar",
    },
    {
      name: "campaigns",
      title: "Campaigns",
      icon: "megaphone-outline",
      path: "/campaigns",
    },
    {
      name: "media",
      title: "Media Library",
      icon: "images-outline",
      path: "/media",
    },
    {
      name: "profile",
      title: "Profile",
      icon: "person-outline",
      path: "/profile",
    },
    {
      name: "settings",
      title: "Settings",
      icon: "settings-outline",
      path: "/settings",
    },
  ];

  const isActive = (path) => pathname.startsWith(path);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[styles.drawerContainer, { backgroundColor: colors.surface }]}
      >
        <View
          style={[styles.drawerHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.drawerTitle, { color: colors.text }]}>
            Handlerr
          </Text>
          <Text
            style={[styles.drawerSubtitle, { color: colors.textSecondary }]}
          >
            AI powered Social Media Manager
          </Text>
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.drawerItem,
              isActive(item.path) && [
                styles.drawerItemActive,
                { backgroundColor: colors.primary + "15" },
              ],
            ]}
            onPress={() => {
              navigation.closeDrawer();
              router.push(item.path);
            }}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive(item.path) ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.drawerItemText,
                { color: isActive(item.path) ? colors.primary : colors.text },
                { flex: 1 },
              ]}
            >
              {item.title}
            </Text>
            {item.name === "engagement" && unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            styles.drawerItem,
            styles.logoutItem,
            { borderTopColor: colors.border },
          ]}
          onPress={() => {
            navigation.closeDrawer();
            router.push("/(auth)/login");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text
            style={[styles.drawerItemText, { color: colors.error, flex: 1 }]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: 280 },
          drawerType: "front",
          overlayColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
        <Drawer.Screen
          name="analytics"
          options={{ drawerLabel: "Analytics" }}
        />
        <Drawer.Screen name="calendar" options={{ drawerLabel: "Calendar" }} />
        <Drawer.Screen
          name="media"
          options={{ drawerLabel: "Media Library" }}
        />
        <Drawer.Screen name="settings" options={{ drawerLabel: "Settings" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 60,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  drawerItemActive: {
    borderRightWidth: 3,
    borderRightColor: '#1976d2',
  },
  drawerItemText: {
    fontSize: 16,
  },
  logoutItem: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 16,
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
