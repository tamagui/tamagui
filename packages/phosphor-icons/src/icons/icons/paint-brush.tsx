import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaintBrushBold } from '../bold/paint-brush-bold'
import { PaintBrushDuotone } from '../duotone/paint-brush-duotone'
import { PaintBrushFill } from '../fill/paint-brush-fill'
import { PaintBrushLight } from '../light/paint-brush-light'
import { PaintBrushRegular } from '../regular/paint-brush-regular'
import { PaintBrushThin } from '../thin/paint-brush-thin'

const weightMap = {
  regular: PaintBrushRegular,
  bold: PaintBrushBold,
  duotone: PaintBrushDuotone,
  fill: PaintBrushFill,
  light: PaintBrushLight,
  thin: PaintBrushThin,
} as const

export const PaintBrush = (props: IconProps) => {
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
