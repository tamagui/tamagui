import { StackProps } from '@tamagui/core'
import React from 'react'

import { IPlacement, defaultArrowHeight, defaultArrowWidth, getDiagonalLength } from './Popper'
import { YStack } from './Stacks'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type PopperArrowProps = StackProps & {
  placement?: IPlacement
}

export const PopperArrow = React.memo(
  React.forwardRef((props: PopperArrowProps, ref: any) => {
    const {
      height = defaultArrowHeight,
      width = defaultArrowWidth,
      borderWidth = 0,
      placement,
      // never render children
      children,
      ...rest
    } = props
    const diagonalLength = getDiagonalLength(defaultArrowHeight, defaultArrowHeight)
    if (!width || !height || !placement) {
      return null
    }
    return (
      <YStack
        ref={ref}
        borderColor="$borderColor"
        backgroundColor="$background"
        position="absolute"
        rotate="45deg"
        zIndex={1}
        width={width}
        height={height}
        {...(placement === 'top' && {
          y: +height / 2,
          x: -width / 2,
          bottom: Math.ceil((diagonalLength - defaultArrowHeight) / 2),
          borderBottomWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(placement === 'bottom' && {
          y: height,
          x: -width / 2,
          top: Math.ceil((diagonalLength - defaultArrowHeight) / 2),
          borderTopWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
        {...(placement === 'left' && {
          y: +height / 2,
          x: +width / 2,
          right: Math.ceil((diagonalLength - defaultArrowHeight) / 2),
          borderTopWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(placement === 'right' && {
          // x: -width / 2,
          y: -height / 2,
          left: Math.ceil((diagonalLength - defaultArrowHeight) / 2),
          borderBottomWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
        {...rest}
      />
    )
  })
)

PopperArrow.displayName = 'PopperArrow'
