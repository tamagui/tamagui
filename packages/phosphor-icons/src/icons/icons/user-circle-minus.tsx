import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserCircleMinusBold } from '../bold/user-circle-minus-bold'
import { UserCircleMinusDuotone } from '../duotone/user-circle-minus-duotone'
import { UserCircleMinusFill } from '../fill/user-circle-minus-fill'
import { UserCircleMinusLight } from '../light/user-circle-minus-light'
import { UserCircleMinusRegular } from '../regular/user-circle-minus-regular'
import { UserCircleMinusThin } from '../thin/user-circle-minus-thin'

const weightMap = {
  regular: UserCircleMinusRegular,
  bold: UserCircleMinusBold,
  duotone: UserCircleMinusDuotone,
  fill: UserCircleMinusFill,
  light: UserCircleMinusLight,
  thin: UserCircleMinusThin,
} as const

export const UserCircleMinus = (props: IconProps) => {
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
