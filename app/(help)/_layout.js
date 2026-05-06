import { Stack } from 'expo-router';

export default function HelpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="help-center" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="contact-support" />
    </Stack>
  );
}