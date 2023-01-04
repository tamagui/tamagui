import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CommandBold } from '../bold/command-bold'
import { CommandDuotone } from '../duotone/command-duotone'
import { CommandFill } from '../fill/command-fill'
import { CommandLight } from '../light/command-light'
import { CommandRegular } from '../regular/command-regular'
import { CommandThin } from '../thin/command-thin'

const weightMap = {
  regular: CommandRegular,
  bold: CommandBold,
  duotone: CommandDuotone,
  fill: CommandFill,
  light: CommandLight,
  thin: CommandThin,
} as const

export const Command = (props: IconProps) => {
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
