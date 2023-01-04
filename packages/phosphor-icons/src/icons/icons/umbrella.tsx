import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UmbrellaBold } from '../bold/umbrella-bold'
import { UmbrellaDuotone } from '../duotone/umbrella-duotone'
import { UmbrellaFill } from '../fill/umbrella-fill'
import { UmbrellaLight } from '../light/umbrella-light'
import { UmbrellaRegular } from '../regular/umbrella-regular'
import { UmbrellaThin } from '../thin/umbrella-thin'

const weightMap = {
  regular: UmbrellaRegular,
  bold: UmbrellaBold,
  duotone: UmbrellaDuotone,
  fill: UmbrellaFill,
  light: UmbrellaLight,
  thin: UmbrellaThin,
} as const

export const Umbrella = (props: IconProps) => {
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
