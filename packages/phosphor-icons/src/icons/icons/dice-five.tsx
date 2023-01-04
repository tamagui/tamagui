import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceFiveBold } from '../bold/dice-five-bold'
import { DiceFiveDuotone } from '../duotone/dice-five-duotone'
import { DiceFiveFill } from '../fill/dice-five-fill'
import { DiceFiveLight } from '../light/dice-five-light'
import { DiceFiveRegular } from '../regular/dice-five-regular'
import { DiceFiveThin } from '../thin/dice-five-thin'

const weightMap = {
  regular: DiceFiveRegular,
  bold: DiceFiveBold,
  duotone: DiceFiveDuotone,
  fill: DiceFiveFill,
  light: DiceFiveLight,
  thin: DiceFiveThin,
} as const

export const DiceFive = (props: IconProps) => {
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
