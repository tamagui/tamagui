import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CodeSimpleBold } from '../bold/code-simple-bold'
import { CodeSimpleDuotone } from '../duotone/code-simple-duotone'
import { CodeSimpleFill } from '../fill/code-simple-fill'
import { CodeSimpleLight } from '../light/code-simple-light'
import { CodeSimpleRegular } from '../regular/code-simple-regular'
import { CodeSimpleThin } from '../thin/code-simple-thin'

const weightMap = {
  regular: CodeSimpleRegular,
  bold: CodeSimpleBold,
  duotone: CodeSimpleDuotone,
  fill: CodeSimpleFill,
  light: CodeSimpleLight,
  thin: CodeSimpleThin,
} as const

export const CodeSimple = (props: IconProps) => {
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
