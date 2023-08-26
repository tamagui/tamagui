import { Stack, useRouter } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function AppLayout() {
  const router = useRouter()

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Notes',
            headerLargeTitle: true,
            headerSearchBarOptions: {
              onChangeText: (event) => {
                // Update the query params to match the search query.
                router.setParams({
                  q: event.nativeEvent.text,
                })
              },
            },
          }}
        />
      </Stack>
    </>
  )
}
