import { Button } from '@tamagui/ui'

export function FocusVisibleButton() {
  return (
    <Button
      id="focus-visible-button"
      borderColor="red"
      borderWidth={1}
      focusVisibleStyle={{
        borderWidth: 2,
      }}
    />
  )
}
