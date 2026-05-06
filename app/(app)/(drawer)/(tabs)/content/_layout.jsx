// // app/(app)/_layout.jsx
// import { Stack } from 'expo-router';
// import { AuthProvider } from '../../../../../context/AuthContext';

// export default function ContentLayout() {
//   return (
//     <AuthProvider>
//       <Stack>
//         <Stack.Screen 
//           name="index" 
//           options={{ 
//             title: 'Content',
//             headerShown: false,
//           }} 
//         />
//         <Stack.Screen 
//           name="calendar" 
//           options={{ 
//             title: 'Content Calendar',
//             headerShown: false,
//           }} 
//         />
//         <Stack.Screen 
//           name="analytics" 
//           options={{ 
//             title: 'Content Analytics',
//             headerShown: false,
//           }} 
//         />
//         <Stack.Screen 
//           name="create" 
//           options={{ 
//             title: 'Create Content',
//             headerShown: true,
//           }} 
//         />
//         <Stack.Screen 
//           name="[contentId]" 
//           options={{ 
//             title: 'Content Detail',
//             headerShown: false,
//           }} 
//         />
//         <Stack.Screen 
//           name="[id]" 
//           options={{ 
//             title: 'Edit Content',
//             headerShown: false,
//           }} 
//         />
//       </Stack>
//     </AuthProvider>
//   );
// }











// app/(app)/_layout.jsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../../../../../context/AuthContext';

export default function ContentLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Content',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="calendar" 
          options={{ 
            title: 'Content Calendar',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="analytics" 
          options={{ 
            title: 'Content Analytics',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="create" 
          options={{ 
            title: 'Create Content',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="ai-generate" 
          options={{ 
            title: 'AI Generate',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="[contentId]" 
          options={{ 
            title: 'Content Detail',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="edit/[id]" 
          options={{ 
            title: 'Edit Content',
            headerShown: false,
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}