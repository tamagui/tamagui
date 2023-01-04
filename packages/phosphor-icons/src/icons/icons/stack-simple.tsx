import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StackSimpleBold } from '../bold/stack-simple-bold'
import { StackSimpleDuotone } from '../duotone/stack-simple-duotone'
import { StackSimpleFill } from '../fill/stack-simple-fill'
import { StackSimpleLight } from '../light/stack-simple-light'
import { StackSimpleRegular } from '../regular/stack-simple-regular'
import { StackSimpleThin } from '../thin/stack-simple-thin'

const weightMap = {
  regular: StackSimpleRegular,
  bold: StackSimpleBold,
  duotone: StackSimpleDuotone,
  fill: StackSimpleFill,
  light: StackSimpleLight,
  thin: StackSimpleThin,
} as const

export const StackSimple = (props: IconProps) => {
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
