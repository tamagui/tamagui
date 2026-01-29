import type { JSX } from 'react/jsx-runtime'
import type { XStackProps } from 'tamagui'
import { XStack, YStack } from 'tamagui'
import { LogoIcon } from './LogoIcon'
import { LogoWords } from './LogoWords'

type LogoProps = {
  showWords?: boolean
  downscale?: number
  animated?: boolean
  color?: string
  ref?: any
} & XStackProps

export const TamaguiLogo = ({
  showWords,
  downscale,
  animated,
  color,
  ref,
  ...props
}: LogoProps): JSX.Element => {
  return (
    <XStack
      render="span"
      ref={ref}
      alignItems="center"
      justifyContent="center"
      gap="$5"
      {...props}
    >
      <LogoIcon downscale={(downscale ?? 1) * (showWords ? 2 : 1.5)} color={color} />
      {showWords && (
        <YStack render="span" marginBottom={-4}>
          <LogoWords animated={animated} downscale={downscale ?? 2} />
        </YStack>
      )}
    </XStack>
  )
}
