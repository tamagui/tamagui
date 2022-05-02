import { Square } from 'tamagui'

import { LogoIcon } from '../TamaguiLogo'

export default () => {
  return (
    <Square
      bc="$pink10"
      animation="bouncy"
      elevation="$4"
      size={110}
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
