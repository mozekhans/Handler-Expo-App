// import { Stack } from 'expo-router';

// export default function SocialLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="connect" />
//       <Stack.Screen name="[id]" />
//       <Stack.Screen name="webhook" />
//       {/* <Stack.Screen name="analytics/[id]" /> */}
//     </Stack>
//   );
// }























import { Stack } from 'expo-router';
import { theme } from '../../../../styles/theme';

export default function SocialLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="connect" />
      <Stack.Screen name="accounts/[accountId]/index" />
      <Stack.Screen name="accounts/[accountId]/settings" />
      <Stack.Screen name="accounts/[accountId]/metrics" />
      <Stack.Screen name="accounts/[accountId]/webhooks" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}