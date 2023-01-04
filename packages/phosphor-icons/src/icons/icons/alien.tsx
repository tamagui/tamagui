import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlienBold } from '../bold/alien-bold'
import { AlienDuotone } from '../duotone/alien-duotone'
import { AlienFill } from '../fill/alien-fill'
import { AlienLight } from '../light/alien-light'
import { AlienRegular } from '../regular/alien-regular'
import { AlienThin } from '../thin/alien-thin'

const weightMap = {
  regular: AlienRegular,
  bold: AlienBold,
  duotone: AlienDuotone,
  fill: AlienFill,
  light: AlienLight,
  thin: AlienThin,
} as const

export const Alien = (props: IconProps) => {
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
