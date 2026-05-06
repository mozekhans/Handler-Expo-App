// // app/(app)/business/[id]/integrations/_layout.js
// import { Stack } from 'expo-router';

// export default function IntegrationsLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: 'Integrations',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="[integrationId]" 
//         options={{ 
//           title: 'Integration Settings',
//           headerShown: true
//         }} 
//       />
//     </Stack>
//   );
// }

















// app/(app)/business/[id]/integrations/_layout.js
import { Stack } from 'expo-router';

export default function IntegrationsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Integrations',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="[integrationId]" 
        options={{ 
          title: 'Integration Settings',
          headerShown: false
        }} 
      />
    </Stack>
  );
}