// import { Stack } from 'expo-router';

// export default function AppLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       {/* Tabs */}
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="(analytics)" options={{ headerShown: false }} />
//       <Stack.Screen name="(calendar)" options={{ headerShown: false }} />
//       <Stack.Screen name="(campaigns)" options={{ headerShown: false }} />
//       <Stack.Screen name="(meida)" options={{ headerShown: false }} />
//       <Stack.Screen name="(help)" options={{ headerShown: false }} />
//     </Stack>
//   );
// }












// import { Drawer } from 'expo-router/drawer';
// import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../../hooks/useTheme';
// import { useNotifications } from '../../hooks/useNotifications';
// import { TouchableOpacity, View, Text } from 'react-native';
// import { router } from 'expo-router';

// function CustomDrawerContent({ navigation }) {
//   const { colors } = useTheme();
//   const { unreadCount } = useNotifications();

//   const menuItems = [
//     { name: 'dashboard', title: 'Dashboard', icon: 'grid-outline', path: '/(app)/dashboard' },
//     { name: 'content', title: 'Content', icon: 'create-outline', path: '/(app)/content' },
//     { name: 'engagement', title: 'Engagement', icon: 'chatbubbles-outline', path: '/(app)/engagement' },
//     { name: 'analytics', title: 'Analytics', icon: 'stats-chart-outline', path: '/(app)/analytics' },
//     { name: 'calendar', title: 'Calendar', icon: 'calendar-outline', path: '/(app)/calendar' },
//     { name: 'campaigns', title: 'Campaigns', icon: 'megaphone-outline', path: '/(app)/campaigns' },
//     { name: 'media', title: 'Media Library', icon: 'images-outline', path: '/(app)/media' },
//     { name: 'profile', title: 'Profile', icon: 'person-outline', path: '/(app)/profile' },
//     { name: 'settings', title: 'Settings', icon: 'settings-outline', path: '/(app)/settings' },
//     { name: 'help', title: 'Help Center', icon: 'help-circle-outline', path: '/(help)/help-center' },
//   ];

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.surface, paddingTop: 60 }}>
//       <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>AI Social Media</Text>
//         <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Manager</Text>
//       </View>
      
//       {menuItems.map((item) => (
//         <TouchableOpacity
//           key={item.name}
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingHorizontal: 20,
//             paddingVertical: 14,
//             gap: 12,
//           }}
//           onPress={() => {
//             navigation.closeDrawer();
//             router.push(item.path);
//           }}
//         >
//           <Ionicons name={item.icon} size={24} color={colors.text} />
//           <Text style={{ fontSize: 16, color: colors.text, flex: 1 }}>{item.title}</Text>
//           {item.name === 'engagement' && unreadCount > 0 && (
//             <View style={{
//               backgroundColor: colors.error,
//               borderRadius: 10,
//               minWidth: 20,
//               height: 20,
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingHorizontal: 4,
//             }}>
//               <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       ))}
      
//       <View style={{ flex: 1 }} />
      
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           paddingHorizontal: 20,
//           paddingVertical: 14,
//           gap: 12,
//           borderTopWidth: 1,
//           borderTopColor: colors.border,
//         }}
//         onPress={() => {
//           navigation.closeDrawer();
//           // Handle logout
//           router.push('/(auth)/login');
//         }}
//       >
//         <Ionicons name="log-out-outline" size={24} color={colors.error} />
//         <Text style={{ fontSize: 16, color: colors.error, flex: 1 }}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default function AppLayout() {
//   const { colors } = useTheme();

//   return (
//     <Drawer
//       drawerContent={CustomDrawerContent}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           width: 280,
//         },
//         drawerActiveTintColor: colors.primary,
//         drawerInactiveTintColor: colors.textSecondary,
//       }}
//     >
//       <Drawer.Screen
//         name="dashboard"
//         options={{
//           drawerLabel: 'Dashboard',
//           drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="content/index"
//         options={{
//           drawerLabel: 'Content',
//           drawerIcon: ({ color, size }) => <Ionicons name="create-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="engagement/index"
//         options={{
//           drawerLabel: 'Engagement',
//           drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="analytics/index"
//         options={{
//           drawerLabel: 'Analytics',
//           drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="calendar/index"
//         options={{
//           drawerLabel: 'Calendar',
//           drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="campaigns/index"
//         options={{
//           drawerLabel: 'Campaigns',
//           drawerIcon: ({ color, size }) => <Ionicons name="megaphone-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="media/index"
//         options={{
//           drawerLabel: 'Media Library',
//           drawerIcon: ({ color, size }) => <Ionicons name="images-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="profile/index"
//         options={{
//           drawerLabel: 'Profile',
//           drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
//         }}
//       />
//       <Drawer.Screen
//         name="settings/index"
//         options={{
//           drawerLabel: 'Settings',
//           drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
//         }}
//       />
//       {/* Hide these from drawer - they are nested screens */}
//       <Drawer.Screen name="content/create" options={{ href: null }} />
//       <Drawer.Screen name="content/[id]" options={{ href: null }} />
//       <Drawer.Screen name="content/edit/[id]" options={{ href: null }} />
//       <Drawer.Screen name="engagement/mentions" options={{ href: null }} />
//       <Drawer.Screen name="engagement/comments/[id]" options={{ href: null }} />
//       <Drawer.Screen name="engagement/conversation/[id]" options={{ href: null }} />
//       <Drawer.Screen name="profile/edit" options={{ href: null }} />
//       <Drawer.Screen name="campaigns/[id]" options={{ href: null }} />
//       <Drawer.Screen name="settings/security" options={{ href: null }} />
//       <Drawer.Screen name="settings/billing" options={{ href: null }} />
//       <Drawer.Screen name="settings/plans" options={{ href: null }} />
//       <Drawer.Screen name="settings/invoices" options={{ href: null }} />
//       <Drawer.Screen name="settings/invoices/[id]" options={{ href: null }} />
//     </Drawer>
//   );
// }






import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}