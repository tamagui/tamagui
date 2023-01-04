import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CarSimpleBold } from '../bold/car-simple-bold'
import { CarSimpleDuotone } from '../duotone/car-simple-duotone'
import { CarSimpleFill } from '../fill/car-simple-fill'
import { CarSimpleLight } from '../light/car-simple-light'
import { CarSimpleRegular } from '../regular/car-simple-regular'
import { CarSimpleThin } from '../thin/car-simple-thin'

const weightMap = {
  regular: CarSimpleRegular,
  bold: CarSimpleBold,
  duotone: CarSimpleDuotone,
  fill: CarSimpleFill,
  light: CarSimpleLight,
  thin: CarSimpleThin,
} as const

export const CarSimple = (props: IconProps) => {
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
