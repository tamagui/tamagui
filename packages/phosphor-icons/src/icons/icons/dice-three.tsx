import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiceThreeBold } from '../bold/dice-three-bold'
import { DiceThreeDuotone } from '../duotone/dice-three-duotone'
import { DiceThreeFill } from '../fill/dice-three-fill'
import { DiceThreeLight } from '../light/dice-three-light'
import { DiceThreeRegular } from '../regular/dice-three-regular'
import { DiceThreeThin } from '../thin/dice-three-thin'

const weightMap = {
  regular: DiceThreeRegular,
  bold: DiceThreeBold,
  duotone: DiceThreeDuotone,
  fill: DiceThreeFill,
  light: DiceThreeLight,
  thin: DiceThreeThin,
} as const

export const DiceThree = (props: IconProps) => {
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
