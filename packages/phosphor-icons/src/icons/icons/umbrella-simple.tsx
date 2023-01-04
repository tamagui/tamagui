import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UmbrellaSimpleBold } from '../bold/umbrella-simple-bold'
import { UmbrellaSimpleDuotone } from '../duotone/umbrella-simple-duotone'
import { UmbrellaSimpleFill } from '../fill/umbrella-simple-fill'
import { UmbrellaSimpleLight } from '../light/umbrella-simple-light'
import { UmbrellaSimpleRegular } from '../regular/umbrella-simple-regular'
import { UmbrellaSimpleThin } from '../thin/umbrella-simple-thin'

const weightMap = {
  regular: UmbrellaSimpleRegular,
  bold: UmbrellaSimpleBold,
  duotone: UmbrellaSimpleDuotone,
  fill: UmbrellaSimpleFill,
  light: UmbrellaSimpleLight,
  thin: UmbrellaSimpleThin,
} as const

export const UmbrellaSimple = (props: IconProps) => {
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
