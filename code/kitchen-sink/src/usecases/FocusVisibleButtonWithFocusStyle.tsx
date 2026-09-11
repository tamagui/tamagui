import { Button } from 'tamagui'

export function FocusVisibleButtonWithFocusStyle() {
  return (
    <Button id="focus-visible-button" borderWidth="1px focus:2px focus-visible:3px" />
  )
}
