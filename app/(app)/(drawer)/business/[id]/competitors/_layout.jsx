// // app/(app)/business/[id]/competitors/_layout.js
// import { Stack } from 'expo-router';

// export default function CompetitorsLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="index" 
//         options={{ 
//           title: 'Competitors',
//           headerShown: true
//         }} 
//       />
//       <Stack.Screen 
//         name="add" 
//         options={{ 
//           title: 'Add Competitor',
//           headerShown: true,
//           presentation: 'modal'
//         }} 
//       />
//       <Stack.Screen 
//         name="[competitorId]" 
//         options={{ 
//           title: 'Competitor Details',
//           headerShown: true
//         }} 
//       />
//     </Stack>
//   );
// }












// app/(app)/business/[id]/competitors/_layout.js
import { Stack } from 'expo-router';

export default function CompetitorsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Competitors',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Add Competitor',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[competitorId]" 
        options={{ 
          title: 'Competitor Details',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Competitor',
          headerShown: false
        }} 
      />
    </Stack>
  );
}