import { Square } from 'tamagui'

import { LogoIcon } from '../TamaguiLogo'

export default () => {
  return (
    <Square
      enterStyle={{
        scale: 1.5,
        y: -10,
        opacity: 0,
      }}
      animation="bouncy"
      elevation="$4"
      size={110}
      opacity={1}
      scale={1}
      y={0}
      bc="$background"
      br="$9"
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
