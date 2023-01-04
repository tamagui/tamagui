import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CakeBold } from '../bold/cake-bold'
import { CakeDuotone } from '../duotone/cake-duotone'
import { CakeFill } from '../fill/cake-fill'
import { CakeLight } from '../light/cake-light'
import { CakeRegular } from '../regular/cake-regular'
import { CakeThin } from '../thin/cake-thin'

const weightMap = {
  regular: CakeRegular,
  bold: CakeBold,
  duotone: CakeDuotone,
  fill: CakeFill,
  light: CakeLight,
  thin: CakeThin,
} as const

export const Cake = (props: IconProps) => {
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
