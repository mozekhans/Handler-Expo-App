// // app/(app)/business/[id]/_layout.js
// import { Stack, useLocalSearchParams } from 'expo-router';
// import { useBusiness } from '../../../../../hooks/useBusiness';
// import { Text } from 'react-native';

// export default function BusinessDetailLayout() {
//   const { id } = useLocalSearchParams();
//   const { business, loading } = useBusiness(id);

//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: loading ? 'Loading...' : business?.name || 'Business',
//           headerShown: true,
//           headerBackTitle: 'Back'
//         }} 
//       />
//       <Stack.Screen 
//         name="edit" 
//         options={{ 
//           title: 'Edit Business',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="brand-voice" 
//         options={{ 
//           title: 'Brand Voice',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="target-audience" 
//         options={{ 
//           title: 'Target Audience',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="settings" 
//         options={{ 
//           title: 'Settings',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="team" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//       <Stack.Screen 
//         name="competitors" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//       <Stack.Screen 
//         name="integrations" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//     </Stack>
//   );
// }
















// import { Stack, useLocalSearchParams } from 'expo-router';
// import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';
// import { Text } from 'react-native';

// export default function BusinessDetailLayout() {
//   const { id } = useLocalSearchParams();
//   const { business, loading } = useBusiness(id);

//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: loading ? 'Loading...' : business?.name || 'Business',
//           headerShown: true,
//           headerBackTitle: 'Back'
//         }} 
//       />
//       <Stack.Screen 
//         name="edit" 
//         options={{ 
//           title: 'Edit Business',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="settings" 
//         options={{ 
//           title: 'Settings',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="brand-voice" 
//         options={{ 
//           title: 'Brand Voice',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="target-audience" 
//         options={{ 
//           title: 'Target Audience',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="team" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//       <Stack.Screen 
//         name="competitors" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//       <Stack.Screen 
//         name="integrations" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//     </Stack>
//   );
// }

















// app/(app)/business/[id]/_layout.jsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { useBusiness } from '../../../../../hooks/businessHooks/useBusiness';

export default function BusinessDetailLayout() {
  const { id } = useLocalSearchParams();
  const { business, loading } = useBusiness(id);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: loading ? 'Loading...' : business?.name || 'Business',
          headerShown: false,
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Business',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="brand-voice" 
        options={{ 
          title: 'Brand Voice',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="target-audience" 
        options={{ 
          title: 'Target Audience',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="team" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="competitors" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="integrations" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}