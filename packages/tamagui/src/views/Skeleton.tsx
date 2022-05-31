import { GetProps, styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import { forwardRef } from 'react'

import { LinearGradient, LinearGradientProps } from './LinearGradient'

export const SkeletonFrame = styled(YStack, {
  name: 'Skeleton',
})

export type SkeletonProps = GetProps<typeof SkeletonFrame>

export const Skeleton = SkeletonFrame.extractable(
  forwardRef(({ children, ...props }: SkeletonProps, ref) => {
    return (
      <SkeletonFrame ref={ref} {...props}>
        {children}
      </SkeletonFrame>
    )
  })
)

export const SkeletonShine = (props: LinearGradientProps) => {
  return (
    <LinearGradient
      position="absolute"
      top={0}
      bottom={0}
      width="25%"
      colors={['$background', '$color']}
      {...props}
    />
  )
}
