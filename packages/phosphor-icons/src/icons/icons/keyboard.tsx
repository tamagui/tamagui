import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KeyboardBold } from '../bold/keyboard-bold'
import { KeyboardDuotone } from '../duotone/keyboard-duotone'
import { KeyboardFill } from '../fill/keyboard-fill'
import { KeyboardLight } from '../light/keyboard-light'
import { KeyboardRegular } from '../regular/keyboard-regular'
import { KeyboardThin } from '../thin/keyboard-thin'

const weightMap = {
  regular: KeyboardRegular,
  bold: KeyboardBold,
  duotone: KeyboardDuotone,
  fill: KeyboardFill,
  light: KeyboardLight,
  thin: KeyboardThin,
} as const

export const Keyboard = (props: IconProps) => {
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
