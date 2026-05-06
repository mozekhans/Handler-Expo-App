// // app/(app)/business/[id]/team/_layout.js
// import { Stack } from 'expo-router';

// export default function TeamLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: 'Team Members',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="invite" 
//         options={{ 
//           title: 'Invite Team Member',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="[memberId]" 
//         options={{ 
//           title: 'Team Member Details',
//           headerShown: true
//         }} 
//       />
//     </Stack>
//   );
// }











// app/(app)/business/[id]/team/_layout.js
import { Stack } from 'expo-router';

export default function TeamLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Team Members',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="invite" 
        options={{ 
          title: 'Invite Team Member',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[memberId]" 
        options={{ 
          title: 'Team Member Details',
          headerShown: false
        }} 
      />
    </Stack>
  );
}