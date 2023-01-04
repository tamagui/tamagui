import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DoorBold } from '../bold/door-bold'
import { DoorDuotone } from '../duotone/door-duotone'
import { DoorFill } from '../fill/door-fill'
import { DoorLight } from '../light/door-light'
import { DoorRegular } from '../regular/door-regular'
import { DoorThin } from '../thin/door-thin'

const weightMap = {
  regular: DoorRegular,
  bold: DoorBold,
  duotone: DoorDuotone,
  fill: DoorFill,
  light: DoorLight,
  thin: DoorThin,
} as const

export const Door = (props: IconProps) => {
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
