import { useMemo } from 'react'
import { YStack } from 'tamagui'

import { useTint } from './header/ColorToggleButton.client'

// todo - just use <Theme> here

export const SectionTintedBackground = ({
  children,
  gradient,
  extraPad,
  bubble,
  noBorderTop,
  ...props
}: any) => {
  const { tint } = useTint()
  return (
    <YStack
      zi={2}
      theme={tint}
      contain="paint"
      pos="relative"
      py="$14"
      elevation="$2"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: '$borderColor',
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        zi={-1}
        bc={gradient ? '$background' : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: '$borderColor',
        })}
      />
      {useMemo(() => children, [children])}
    </YStack>
  )
}
