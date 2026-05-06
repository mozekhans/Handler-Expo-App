// app/media/_layout.js
import { Stack } from 'expo-router';
import { useTheme } from '../../../../hooks/useTheme';

export default function MediaStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Media Library' }} 
      />
    </Stack>
  );
}