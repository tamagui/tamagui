import { YStack } from 'tamagui'
import { TamaguiIconSvg } from './TamaguiLogoSvg'
import type { JSX } from 'react/jsx-runtime'

export const LogoIcon = ({
  downscale = 2,
  color,
}: {
  downscale?: number
  color?: string
}): JSX.Element => {
  return (
    <YStack
            render="span" className="unselectable" alignSelf="center" marginVertical={-10} opacity="press:0.7" scaleX="press:-1"
          >
      <TamaguiIconSvg
        className="tamagui-icon"
        width={450 / 8 / downscale}
        height={420 / 8 / downscale}
        color={color}
      />
    </YStack>
  )
}
