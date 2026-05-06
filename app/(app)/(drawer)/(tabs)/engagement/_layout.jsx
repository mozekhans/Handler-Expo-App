// app/(tabs)/engagements/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../../../styles/theme';

export default function EngagementsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Engagements',
        }} 
      />
    </Stack>
  );
}