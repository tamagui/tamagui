import { YStack } from 'tamagui'

import { TamaguiIconSvg } from './TamaguiLogoSvg'

export const LogoIcon = ({ downscale = 2 }: { downscale?: number }) => {
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
