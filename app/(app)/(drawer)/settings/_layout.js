// // app/settings/_layout.js
// import { Stack } from 'expo-router';
// import { useTheme } from '../../../hooks/useTheme';

// export default function SettingsStack() {
//   const { colors } = useTheme();

//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: { backgroundColor: colors.surface },
//         headerTintColor: colors.text,
//         headerTitleStyle: { fontWeight: '600' },
//       }}
//     >
//       <Stack.Screen name="index" options={{ title: 'Settings' }} />
//       <Stack.Screen name="billing" options={{ title: 'Billing' }} />
//       <Stack.Screen name="plans" options={{ title: 'Plans' }} />
//       <Stack.Screen name="security" options={{ title: 'Security' }} />
//     </Stack>
//   );
// }









import { Stack } from 'expo-router';
import { useTheme } from '../../../../hooks/useTheme';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings', headerShown: false }} />
      <Stack.Screen name="security" options={{ title: 'Security', headerShown: false }} />
      <Stack.Screen name="billing" options={{ title: 'Billing', headerShown: false }} />
      <Stack.Screen name="plans" options={{ title: 'Plans', headerShown: false }} />
      <Stack.Screen name="invoices" options={{ title: 'Invoices', headerShown: false }} />
      <Stack.Screen name="invoices/[id]" options={{ title: 'Invoice Details', headerShown: false }} />
    </Stack>
  );
}