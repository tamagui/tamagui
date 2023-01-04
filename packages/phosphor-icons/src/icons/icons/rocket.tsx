import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RocketBold } from '../bold/rocket-bold'
import { RocketDuotone } from '../duotone/rocket-duotone'
import { RocketFill } from '../fill/rocket-fill'
import { RocketLight } from '../light/rocket-light'
import { RocketRegular } from '../regular/rocket-regular'
import { RocketThin } from '../thin/rocket-thin'

const weightMap = {
  regular: RocketRegular,
  bold: RocketBold,
  duotone: RocketDuotone,
  fill: RocketFill,
  light: RocketLight,
  thin: RocketThin,
} as const

export const Rocket = (props: IconProps) => {
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
