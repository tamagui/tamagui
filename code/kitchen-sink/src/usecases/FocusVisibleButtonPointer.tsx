import { Button } from '@tamagui/ui'

export function FocusVisibleButtonPointer() {
  return (
    <Button
      id="focus-visible-button"
      borderWidth={1}
      focusVisibleStyle={{
        borderWidth: 2,
      }}
    />
  )
}
