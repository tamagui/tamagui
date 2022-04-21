import { Square } from 'tamagui'

import { LogoIcon } from '../TamaguiLogo'

export default () => {
  return (
    <Square
      animation="bouncy"
      elevation="$4"
      size={110}
      bc="$background"
      br="$9"
      hoverStyle={{
        scale: 1.2,
      }}
      pressStyle={{
        scale: 0.9,
      }}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
