import { forwardRef } from 'react'
import { YStack } from 'tamagui'

import { TamaguiIconSvg } from './TamaguiLogoSvg'

export const LogoIcon = forwardRef(({ downscale = 2 }: any, ref: any) => {
  return (
    <YStack
      ref={ref}
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
})

LogoIcon.displayName = 'LogoIcon'
