// import { Stack } from 'expo-router';

// export default function BusinessLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: 'My Businesses',
//           headerShown: true,
//           headerBackVisible: false
//         }} 
//       />
//       <Stack.Screen 
//         name="create" 
//         options={{ 
//           title: 'Create Business',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="detail" 
//         options={{ 
//           title: 'Business Details',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="[id]" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//     </Stack>
//   );
// }











// import { Stack } from 'expo-router';

// export default function BusinessLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: 'My Businesses',
//           headerShown: true,
//           headerBackVisible: false
//         }} 
//       />
//       <Stack.Screen 
//         name="create" 
//         options={{ 
//           title: 'Create Business',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="select" 
//         options={{ 
//           title: 'Select Business',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       {/* Remove the conflicting 'detail' screen - it's now handled by [id]/index */}
//       <Stack.Screen 
//         name="[id]" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//     </Stack>
//   );
// }












// app/(app)/business/_layout.js
import { Stack } from 'expo-router';

export default function BusinessLayout() {
  return (
    <Stack options={{headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Businesses',
          headerShown: false,
          headerBackVisible: false
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Business',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="select" 
        options={{ 
          title: 'Select Business',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}