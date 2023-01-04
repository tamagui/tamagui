import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ButterflyBold } from '../bold/butterfly-bold'
import { ButterflyDuotone } from '../duotone/butterfly-duotone'
import { ButterflyFill } from '../fill/butterfly-fill'
import { ButterflyLight } from '../light/butterfly-light'
import { ButterflyRegular } from '../regular/butterfly-regular'
import { ButterflyThin } from '../thin/butterfly-thin'

const weightMap = {
  regular: ButterflyRegular,
  bold: ButterflyBold,
  duotone: ButterflyDuotone,
  fill: ButterflyFill,
  light: ButterflyLight,
  thin: ButterflyThin,
} as const

export const Butterfly = (props: IconProps) => {
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
