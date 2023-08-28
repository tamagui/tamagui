import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="edit"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
