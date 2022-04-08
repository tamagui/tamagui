import { Square } from 'tamagui'

import { LogoIcon } from '../TamaguiLogo'

export default () => {
  return (
    <Square
      debug
      animation="bouncy"
      elevation="$4"
      size={110}
      bc="$background"
      br="$9"
      hoverStyle={{
        size: 130,
        bc: 'red',
        x: 10,
      }}
      pressStyle={{
        size: 100,
      }}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  )
}
