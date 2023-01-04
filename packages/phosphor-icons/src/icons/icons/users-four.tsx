import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UsersFourBold } from '../bold/users-four-bold'
import { UsersFourDuotone } from '../duotone/users-four-duotone'
import { UsersFourFill } from '../fill/users-four-fill'
import { UsersFourLight } from '../light/users-four-light'
import { UsersFourRegular } from '../regular/users-four-regular'
import { UsersFourThin } from '../thin/users-four-thin'

const weightMap = {
  regular: UsersFourRegular,
  bold: UsersFourBold,
  duotone: UsersFourDuotone,
  fill: UsersFourFill,
  light: UsersFourLight,
  thin: UsersFourThin,
} as const

export const UsersFour = (props: IconProps) => {
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
