import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserMinusBold } from '../bold/user-minus-bold'
import { UserMinusDuotone } from '../duotone/user-minus-duotone'
import { UserMinusFill } from '../fill/user-minus-fill'
import { UserMinusLight } from '../light/user-minus-light'
import { UserMinusRegular } from '../regular/user-minus-regular'
import { UserMinusThin } from '../thin/user-minus-thin'

const weightMap = {
  regular: UserMinusRegular,
  bold: UserMinusBold,
  duotone: UserMinusDuotone,
  fill: UserMinusFill,
  light: UserMinusLight,
  thin: UserMinusThin,
} as const

export const UserMinus = (props: IconProps) => {
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
