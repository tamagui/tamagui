import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KnifeBold } from '../bold/knife-bold'
import { KnifeDuotone } from '../duotone/knife-duotone'
import { KnifeFill } from '../fill/knife-fill'
import { KnifeLight } from '../light/knife-light'
import { KnifeRegular } from '../regular/knife-regular'
import { KnifeThin } from '../thin/knife-thin'

const weightMap = {
  regular: KnifeRegular,
  bold: KnifeBold,
  duotone: KnifeDuotone,
  fill: KnifeFill,
  light: KnifeLight,
  thin: KnifeThin,
} as const

export const Knife = (props: IconProps) => {
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
