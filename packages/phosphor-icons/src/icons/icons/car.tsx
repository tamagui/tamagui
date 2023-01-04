import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CarBold } from '../bold/car-bold'
import { CarDuotone } from '../duotone/car-duotone'
import { CarFill } from '../fill/car-fill'
import { CarLight } from '../light/car-light'
import { CarRegular } from '../regular/car-regular'
import { CarThin } from '../thin/car-thin'

const weightMap = {
  regular: CarRegular,
  bold: CarBold,
  duotone: CarDuotone,
  fill: CarFill,
  light: CarLight,
  thin: CarThin,
} as const

export const Car = (props: IconProps) => {
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
