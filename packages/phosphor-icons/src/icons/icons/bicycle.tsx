import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BicycleBold } from '../bold/bicycle-bold'
import { BicycleDuotone } from '../duotone/bicycle-duotone'
import { BicycleFill } from '../fill/bicycle-fill'
import { BicycleLight } from '../light/bicycle-light'
import { BicycleRegular } from '../regular/bicycle-regular'
import { BicycleThin } from '../thin/bicycle-thin'

const weightMap = {
  regular: BicycleRegular,
  bold: BicycleBold,
  duotone: BicycleDuotone,
  fill: BicycleFill,
  light: BicycleLight,
  thin: BicycleThin,
} as const

export const Bicycle = (props: IconProps) => {
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
