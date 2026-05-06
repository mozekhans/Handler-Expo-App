import { Stack } from 'expo-router';

export default function AnalyticsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="analytics-overview" />
      <Stack.Screen name="engagement-analytics" />
      <Stack.Screen name="content-analytics" />
      <Stack.Screen name="audience-analytics" />
      <Stack.Screen name="campaigns-analytics" />
      <Stack.Screen name="competitors-analytics" />
      {/* <Stack.Screen name="benchmarks" /> */}
      <Stack.Screen name="reports-analytics" />
      {/* <Stack.Screen name="report/[id]" /> */}
    </Stack>
  );
}