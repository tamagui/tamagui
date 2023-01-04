import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TerminalBold } from '../bold/terminal-bold'
import { TerminalDuotone } from '../duotone/terminal-duotone'
import { TerminalFill } from '../fill/terminal-fill'
import { TerminalLight } from '../light/terminal-light'
import { TerminalRegular } from '../regular/terminal-regular'
import { TerminalThin } from '../thin/terminal-thin'

const weightMap = {
  regular: TerminalRegular,
  bold: TerminalBold,
  duotone: TerminalDuotone,
  fill: TerminalFill,
  light: TerminalLight,
  thin: TerminalThin,
} as const

export const Terminal = (props: IconProps) => {
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
