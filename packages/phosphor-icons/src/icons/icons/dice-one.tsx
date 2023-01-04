import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceOneBold } from '../bold/dice-one-bold'
import { DiceOneDuotone } from '../duotone/dice-one-duotone'
import { DiceOneFill } from '../fill/dice-one-fill'
import { DiceOneLight } from '../light/dice-one-light'
import { DiceOneRegular } from '../regular/dice-one-regular'
import { DiceOneThin } from '../thin/dice-one-thin'

const weightMap = {
  regular: DiceOneRegular,
  bold: DiceOneBold,
  duotone: DiceOneDuotone,
  fill: DiceOneFill,
  light: DiceOneLight,
  thin: DiceOneThin,
} as const

export const DiceOne = (props: IconProps) => {
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
