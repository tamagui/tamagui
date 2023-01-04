import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VibrateBold } from '../bold/vibrate-bold'
import { VibrateDuotone } from '../duotone/vibrate-duotone'
import { VibrateFill } from '../fill/vibrate-fill'
import { VibrateLight } from '../light/vibrate-light'
import { VibrateRegular } from '../regular/vibrate-regular'
import { VibrateThin } from '../thin/vibrate-thin'

const weightMap = {
  regular: VibrateRegular,
  bold: VibrateBold,
  duotone: VibrateDuotone,
  fill: VibrateFill,
  light: VibrateLight,
  thin: VibrateThin,
} as const

export const Vibrate = (props: IconProps) => {
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
