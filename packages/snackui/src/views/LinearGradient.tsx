import normalizeColor2 from 'normalize-css-color'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { LayoutRectangle, View } from 'react-native'

// temp took this from expo because its a bad citizen for compiling

const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.indexOf('var(') === 0
const processColor = (color) => {
  if (color === undefined || color === null) {
    return color
  }
  // convert number and hex
  let int32Color = normalizeColor2(color)
  if (int32Color === undefined || int32Color === null) {
    return undefined
  }
  int32Color = ((int32Color << 24) | (int32Color >>> 8)) >>> 0
  return int32Color
}
const normalizeColor = (color: number | string, opacity = 1) => {
  if (color == null) return

  if (typeof color === 'string' && isWebColor(color)) {
    return color
  }

  const colorInt = processColor(color)
  if (colorInt != null) {
    const r = (colorInt >> 16) & 255
    const g = (colorInt >> 8) & 255
    const b = colorInt & 255
    const a = ((colorInt >> 24) & 255) / 255
    const alpha = (a * opacity).toFixed(2)
    return `rgba(${r},${g},${b},${alpha})`
  }
}

type Props = {
  colors: string[]
  locations?: number[] | null
  startPoint?: Point | null
  endPoint?: Point | null
  onLayout?: Function
} & React.ComponentProps<typeof View>

type Point = [number, number]

export const LinearGradient: FunctionComponent<Props> = ({
  colors,
  locations,
  startPoint,
  endPoint,
  ...props
}: Props) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  const [gradientColors, setGradientColors] = useState<string[]>([])
  const [pseudoAngle, setPseudoAngle] = useState<number>(0)

  useEffect(() => {
    const getControlPoints = (): Point[] => {
      let correctedStartPoint: Point = [0, 0]
      if (Array.isArray(startPoint)) {
        correctedStartPoint = [
          startPoint[0] != null ? startPoint[0] : 0.0,
          startPoint[1] != null ? startPoint[1] : 0.0,
        ]
      }
      let correctedEndPoint: Point = [0.0, 1.0]
      if (Array.isArray(endPoint)) {
        correctedEndPoint = [
          endPoint[0] != null ? endPoint[0] : 0.0,
          endPoint[1] != null ? endPoint[1] : 1.0,
        ]
      }
      return [correctedStartPoint, correctedEndPoint]
    }

    const [start, end] = getControlPoints()
    const { width = 1, height = 1 } = layout || {}
    start[0] *= width
    end[0] *= width
    start[1] *= height
    end[1] *= height
    const py = end[1] - start[1]
    const px = end[0] - start[0]

    setPseudoAngle(90 + (Math.atan2(py, px) * 180) / Math.PI)
  }, [startPoint, endPoint])

  useEffect(() => {
    const nextGradientColors = colors.map(
      (color: string, index: number): string => {
        const hexColor = `${normalizeColor(color)}`
        let output = hexColor
        if (locations && locations[index]) {
          const location = Math.max(0, Math.min(1, locations[index]))
          // Convert 0...1 to 0...100
          const percentage = location * 100
          output += ` ${percentage}%`
        }
        return output
      }
    )

    setGradientColors(nextGradientColors)
  }, [colors, locations])

  const colorStyle = gradientColors.join(',')
  const backgroundImage = `linear-gradient(${pseudoAngle}deg, ${colorStyle})`
  // TODO: Bacon: In the future we could consider adding `backgroundRepeat: "no-repeat"`. For more
  // browser support.
  return (
    <View
      {...props}
      style={[
        props.style,
        // @ts-ignore: [ts] Property 'backgroundImage' does not exist on type 'ViewStyle'.
        { backgroundImage },
      ]}
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout)
        if (props.onLayout) {
          props.onLayout(event)
        }
      }}
    />
  )
}
