import { Button } from 'tamagui'

export function FocusVisibleButton() {
  return (
    <Button
      id="focus-visible-button"
      borderColor="red"
      borderWidth="1px focus-visible:2px"
    />
  )
}
