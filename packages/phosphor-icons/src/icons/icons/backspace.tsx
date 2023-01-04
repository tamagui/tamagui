import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BackspaceBold } from '../bold/backspace-bold'
import { BackspaceDuotone } from '../duotone/backspace-duotone'
import { BackspaceFill } from '../fill/backspace-fill'
import { BackspaceLight } from '../light/backspace-light'
import { BackspaceRegular } from '../regular/backspace-regular'
import { BackspaceThin } from '../thin/backspace-thin'

const weightMap = {
  regular: BackspaceRegular,
  bold: BackspaceBold,
  duotone: BackspaceDuotone,
  fill: BackspaceFill,
  light: BackspaceLight,
  thin: BackspaceThin,
} as const

export const Backspace = (props: IconProps) => {
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
