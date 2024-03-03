import { Button } from 'tamagui'

export function FocusVisibleButton() {
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
