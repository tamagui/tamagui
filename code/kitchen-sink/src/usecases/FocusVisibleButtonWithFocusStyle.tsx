import { Button } from '@tamagui/ui'

export function FocusVisibleButtonWithFocusStyle() {
  return (
    <Button
      id="focus-visible-button"
      borderWidth={1}
      focusStyle={{
        borderWidth: 2,
      }}
      focusVisibleStyle={{
        borderWidth: 3,
      }}
    />
  )
}
