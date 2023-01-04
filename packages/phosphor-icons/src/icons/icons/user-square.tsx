import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserSquareBold } from '../bold/user-square-bold'
import { UserSquareDuotone } from '../duotone/user-square-duotone'
import { UserSquareFill } from '../fill/user-square-fill'
import { UserSquareLight } from '../light/user-square-light'
import { UserSquareRegular } from '../regular/user-square-regular'
import { UserSquareThin } from '../thin/user-square-thin'

const weightMap = {
  regular: UserSquareRegular,
  bold: UserSquareBold,
  duotone: UserSquareDuotone,
  fill: UserSquareFill,
  light: UserSquareLight,
  thin: UserSquareThin,
} as const

export const UserSquare = (props: IconProps) => {
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
