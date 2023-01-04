import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserRectangleBold } from '../bold/user-rectangle-bold'
import { UserRectangleDuotone } from '../duotone/user-rectangle-duotone'
import { UserRectangleFill } from '../fill/user-rectangle-fill'
import { UserRectangleLight } from '../light/user-rectangle-light'
import { UserRectangleRegular } from '../regular/user-rectangle-regular'
import { UserRectangleThin } from '../thin/user-rectangle-thin'

const weightMap = {
  regular: UserRectangleRegular,
  bold: UserRectangleBold,
  duotone: UserRectangleDuotone,
  fill: UserRectangleFill,
  light: UserRectangleLight,
  thin: UserRectangleThin,
} as const

export const UserRectangle = (props: IconProps) => {
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
