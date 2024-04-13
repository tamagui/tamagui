import { isWeb } from '@tamagui/core'
import { Stack } from '@vxrn/expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={
        isWeb
          ? {
              header() {
                return null
              },
            }
          : {}
      }
    />
  )
}
