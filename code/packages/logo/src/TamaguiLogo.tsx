import React from 'react'
import type { XStackProps } from 'tamagui'
import { XStack, YStack } from 'tamagui'

import { LogoIcon } from './LogoIcon'
import { LogoWords } from './LogoWords'

type LogoProps = {
  showWords?: boolean
  downscale?: number
  animated?: boolean
} & XStackProps

export const TamaguiLogo = React.forwardRef<any, LogoProps>(
  ({ showWords, downscale, animated, ...props }: LogoProps, ref) => {
    return (
      <XStack
        tag="span"
        ref={ref}
        alignItems="center"
        justifyContent="center"
        gap="$5"
        {...props}
      >
        <LogoIcon downscale={(downscale ?? 1) * (showWords ? 2 : 1.5)} />
        {showWords && (
          <YStack tag="span" marginBottom={-4}>
            <LogoWords animated={animated} downscale={downscale ?? 2} />
          </YStack>
        )}
      </XStack>
    )
  }
)
