import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaintBrushBroadBold } from '../bold/paint-brush-broad-bold'
import { PaintBrushBroadDuotone } from '../duotone/paint-brush-broad-duotone'
import { PaintBrushBroadFill } from '../fill/paint-brush-broad-fill'
import { PaintBrushBroadLight } from '../light/paint-brush-broad-light'
import { PaintBrushBroadRegular } from '../regular/paint-brush-broad-regular'
import { PaintBrushBroadThin } from '../thin/paint-brush-broad-thin'

const weightMap = {
  regular: PaintBrushBroadRegular,
  bold: PaintBrushBroadBold,
  duotone: PaintBrushBroadDuotone,
  fill: PaintBrushBroadFill,
  light: PaintBrushBroadLight,
  thin: PaintBrushBroadThin,
} as const

export const PaintBrushBroad = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
