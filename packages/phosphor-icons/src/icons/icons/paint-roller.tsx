import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaintRollerBold } from '../bold/paint-roller-bold'
import { PaintRollerDuotone } from '../duotone/paint-roller-duotone'
import { PaintRollerFill } from '../fill/paint-roller-fill'
import { PaintRollerLight } from '../light/paint-roller-light'
import { PaintRollerRegular } from '../regular/paint-roller-regular'
import { PaintRollerThin } from '../thin/paint-roller-thin'

const weightMap = {
  regular: PaintRollerRegular,
  bold: PaintRollerBold,
  duotone: PaintRollerDuotone,
  fill: PaintRollerFill,
  light: PaintRollerLight,
  thin: PaintRollerThin,
} as const

export const PaintRoller = (props: IconProps) => {
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
