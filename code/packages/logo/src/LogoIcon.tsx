import { YStack } from 'tamagui'
import { TamaguiIconSvg } from './TamaguiLogoSvg'
import type { JSX } from 'react/jsx-runtime'

export const LogoIcon = ({ downscale = 2 }: { downscale?: number }): JSX.Element => {
  return (
    <YStack
      tag="span"
      className="unselectable"
      alignSelf="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 0.7,
        scaleX: -1,
      }}
    >
      <TamaguiIconSvg
        className="tamagui-icon"
        width={450 / 8 / downscale}
        height={420 / 8 / downscale}
      />
    </YStack>
  )
}
