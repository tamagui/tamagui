import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaintBrushHouseholdBold } from '../bold/paint-brush-household-bold'
import { PaintBrushHouseholdDuotone } from '../duotone/paint-brush-household-duotone'
import { PaintBrushHouseholdFill } from '../fill/paint-brush-household-fill'
import { PaintBrushHouseholdLight } from '../light/paint-brush-household-light'
import { PaintBrushHouseholdRegular } from '../regular/paint-brush-household-regular'
import { PaintBrushHouseholdThin } from '../thin/paint-brush-household-thin'

const weightMap = {
  regular: PaintBrushHouseholdRegular,
  bold: PaintBrushHouseholdBold,
  duotone: PaintBrushHouseholdDuotone,
  fill: PaintBrushHouseholdFill,
  light: PaintBrushHouseholdLight,
  thin: PaintBrushHouseholdThin,
} as const

export const PaintBrushHousehold = (props: IconProps) => {
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
