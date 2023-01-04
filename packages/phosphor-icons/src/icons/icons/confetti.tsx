import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ConfettiBold } from '../bold/confetti-bold'
import { ConfettiDuotone } from '../duotone/confetti-duotone'
import { ConfettiFill } from '../fill/confetti-fill'
import { ConfettiLight } from '../light/confetti-light'
import { ConfettiRegular } from '../regular/confetti-regular'
import { ConfettiThin } from '../thin/confetti-thin'

const weightMap = {
  regular: ConfettiRegular,
  bold: ConfettiBold,
  duotone: ConfettiDuotone,
  fill: ConfettiFill,
  light: ConfettiLight,
  thin: ConfettiThin,
} as const

export const Confetti = (props: IconProps) => {
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
