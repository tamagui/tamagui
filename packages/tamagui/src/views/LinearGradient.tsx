import { Stack, useIsomorphicLayoutEffect } from '@tamagui/core'
import React, { ReactElement, useState } from 'react'

import { normalizeColor } from '../helpers/normalizeColor'
import { useLayout } from '../hooks/useLayout'
import { NativeLinearGradientPoint, NativeLinearGradientProps } from './NativeLinearGradientProps'

// bugfix esbuild strips react jsx: 'preserve'
React['keep']

export const LinearGradient = Stack.extractable(
  ({ colors, locations, start, end, ...props }: NativeLinearGradientProps): ReactElement => {
    const [gradientColors, setGradientColors] = useState<string[]>([])
    const [pseudoAngle, setPseudoAngle] = useState<number>(0)
    const layoutProps = useLayout()
    const { width = 1, height = 1 } = layoutProps.layout ?? {}

    useIsomorphicLayoutEffect(() => {
      const getControlPoints = (): NativeLinearGradientPoint[] => {
        let correctedStart: NativeLinearGradientPoint = [0, 0]
        if (Array.isArray(start)) {
          correctedStart = [start[0] != null ? start[0] : 0.0, start[1] != null ? start[1] : 0.0]
        }
        let correctedEnd: NativeLinearGradientPoint = [0.0, 1.0]
        if (Array.isArray(end)) {
          correctedEnd = [end[0] != null ? end[0] : 0.0, end[1] != null ? end[1] : 1.0]
        }
        return [correctedStart, correctedEnd]
      }

      const [start_, end_] = getControlPoints()
      start_[0] *= width
      end_[0] *= width
      start_[1] *= height
      end_[1] *= height
      const py = end_[1] - start_[1]
      const px = end_[0] - start_[0]

      setPseudoAngle(90 + (Math.atan2(py, px) * 180) / Math.PI)
    }, [width, height, start, end])

    useIsomorphicLayoutEffect(() => {
      const nextGradientColors = colors.map((color, index): string => {
        const hexColor = normalizeColor(color)
        let output = hexColor
        if (locations && locations[index]) {
          const location = Math.max(0, Math.min(1, locations[index]))
          // Convert 0...1 to 0...100
          const percentage = location * 100
          output += ` ${percentage}%`
        }
        return output || ''
      })

      setGradientColors(nextGradientColors)
    }, [colors, locations])

    const colorStyle = gradientColors.join(',')
    const backgroundImage = `linear-gradient(${pseudoAngle}deg, ${colorStyle})`
    // TODO(Bacon): In the future we could consider adding `backgroundRepeat: "no-repeat"`. For more
    // browser support.
    return (
      <Stack
        {...props}
        {...layoutProps}
        style={[
          props.style,
          // @ts-ignore: [ts] Property 'backgroundImage' does not exist on type 'ViewStyle'.
          { backgroundImage },
        ]}
      />
    )
  }
)
