import { Stack, useTheme } from '@tamagui/core'

export function UseTheme() {
  const x = useTheme()
  return (
    <>
      <Stack id="theme-get">{x.background.get()}</Stack>
      <Stack id="theme-val">{x.background.val}</Stack>
      <Stack id="token-get">{x.blue1.get()}</Stack>
      <Stack id="token-val">{x.blue1.val}</Stack>
    </>
  )
}
