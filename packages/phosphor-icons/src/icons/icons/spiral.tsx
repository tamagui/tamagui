import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpiralBold } from '../bold/spiral-bold'
import { SpiralDuotone } from '../duotone/spiral-duotone'
import { SpiralFill } from '../fill/spiral-fill'
import { SpiralLight } from '../light/spiral-light'
import { SpiralRegular } from '../regular/spiral-regular'
import { SpiralThin } from '../thin/spiral-thin'

const weightMap = {
  regular: SpiralRegular,
  bold: SpiralBold,
  duotone: SpiralDuotone,
  fill: SpiralFill,
  light: SpiralLight,
  thin: SpiralThin,
} as const

export const Spiral = (props: IconProps) => {
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
