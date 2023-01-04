import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UsersThreeBold } from '../bold/users-three-bold'
import { UsersThreeDuotone } from '../duotone/users-three-duotone'
import { UsersThreeFill } from '../fill/users-three-fill'
import { UsersThreeLight } from '../light/users-three-light'
import { UsersThreeRegular } from '../regular/users-three-regular'
import { UsersThreeThin } from '../thin/users-three-thin'

const weightMap = {
  regular: UsersThreeRegular,
  bold: UsersThreeBold,
  duotone: UsersThreeDuotone,
  fill: UsersThreeFill,
  light: UsersThreeLight,
  thin: UsersThreeThin,
} as const

export const UsersThree = (props: IconProps) => {
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
