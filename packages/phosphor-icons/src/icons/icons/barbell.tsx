import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BarbellBold } from '../bold/barbell-bold'
import { BarbellDuotone } from '../duotone/barbell-duotone'
import { BarbellFill } from '../fill/barbell-fill'
import { BarbellLight } from '../light/barbell-light'
import { BarbellRegular } from '../regular/barbell-regular'
import { BarbellThin } from '../thin/barbell-thin'

const weightMap = {
  regular: BarbellRegular,
  bold: BarbellBold,
  duotone: BarbellDuotone,
  fill: BarbellFill,
  light: BarbellLight,
  thin: BarbellThin,
} as const

export const Barbell = (props: IconProps) => {
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
