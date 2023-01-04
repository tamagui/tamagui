import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceTwoBold } from '../bold/dice-two-bold'
import { DiceTwoDuotone } from '../duotone/dice-two-duotone'
import { DiceTwoFill } from '../fill/dice-two-fill'
import { DiceTwoLight } from '../light/dice-two-light'
import { DiceTwoRegular } from '../regular/dice-two-regular'
import { DiceTwoThin } from '../thin/dice-two-thin'

const weightMap = {
  regular: DiceTwoRegular,
  bold: DiceTwoBold,
  duotone: DiceTwoDuotone,
  fill: DiceTwoFill,
  light: DiceTwoLight,
  thin: DiceTwoThin,
} as const

export const DiceTwo = (props: IconProps) => {
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
