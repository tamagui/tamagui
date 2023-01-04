import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignLeftSimpleBold } from '../bold/align-left-simple-bold'
import { AlignLeftSimpleDuotone } from '../duotone/align-left-simple-duotone'
import { AlignLeftSimpleFill } from '../fill/align-left-simple-fill'
import { AlignLeftSimpleLight } from '../light/align-left-simple-light'
import { AlignLeftSimpleRegular } from '../regular/align-left-simple-regular'
import { AlignLeftSimpleThin } from '../thin/align-left-simple-thin'

const weightMap = {
  regular: AlignLeftSimpleRegular,
  bold: AlignLeftSimpleBold,
  duotone: AlignLeftSimpleDuotone,
  fill: AlignLeftSimpleFill,
  light: AlignLeftSimpleLight,
  thin: AlignLeftSimpleThin,
} as const

export const AlignLeftSimple = (props: IconProps) => {
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
