import { GetProps, styled } from '@tamagui/core'

import Box from './Box'

const AspectRatioFrame = styled(Box, {
  w: '$full',

  variants: {
    ratio: {
      ':number': (value) => {
        return {
          aspectRatio: value,
        }
      },
      square: {
        aspectRatio: 1,
      },
    },
  } as const,
})

const x = <AspectRatioFrame />

export type AspectRatioProps = GetProps<typeof AspectRatioFrame>

type y = AspectRatioProps

const AspectRatio = AspectRatioFrame.extractable(
  ({ children, ...props }: AspectRatioProps) => {
    return (
      <AspectRatioFrame {...props}>
        <Box pin="full">{children}</Box>
      </AspectRatioFrame>
    )
  }
)

export default AspectRatio
