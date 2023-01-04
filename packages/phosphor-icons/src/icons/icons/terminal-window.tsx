import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TerminalWindowBold } from '../bold/terminal-window-bold'
import { TerminalWindowDuotone } from '../duotone/terminal-window-duotone'
import { TerminalWindowFill } from '../fill/terminal-window-fill'
import { TerminalWindowLight } from '../light/terminal-window-light'
import { TerminalWindowRegular } from '../regular/terminal-window-regular'
import { TerminalWindowThin } from '../thin/terminal-window-thin'

const weightMap = {
  regular: TerminalWindowRegular,
  bold: TerminalWindowBold,
  duotone: TerminalWindowDuotone,
  fill: TerminalWindowFill,
  light: TerminalWindowLight,
  thin: TerminalWindowThin,
} as const

export const TerminalWindow = (props: IconProps) => {
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
