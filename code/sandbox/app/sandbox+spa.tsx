import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { Configuration, H1 } from 'tamagui'
import { SheetDemo } from '@tamagui/demos'

export default () => {
  return (
    <H1
      $gtXs={{
        '$platform-web': {
          color: 'blue',
          backgroundColor: 'pink',
        },
      }}
    >
      Welcome to Tamagui.
    </H1>
  )
}
