import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StackBold } from '../bold/stack-bold'
import { StackDuotone } from '../duotone/stack-duotone'
import { StackFill } from '../fill/stack-fill'
import { StackLight } from '../light/stack-light'
import { StackRegular } from '../regular/stack-regular'
import { StackThin } from '../thin/stack-thin'

const weightMap = {
  regular: StackRegular,
  bold: StackBold,
  duotone: StackDuotone,
  fill: StackFill,
  light: StackLight,
  thin: StackThin,
} as const

export const Stack = (props: IconProps) => {
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
