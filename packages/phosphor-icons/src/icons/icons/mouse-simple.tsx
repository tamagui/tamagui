import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MouseSimpleBold } from '../bold/mouse-simple-bold'
import { MouseSimpleDuotone } from '../duotone/mouse-simple-duotone'
import { MouseSimpleFill } from '../fill/mouse-simple-fill'
import { MouseSimpleLight } from '../light/mouse-simple-light'
import { MouseSimpleRegular } from '../regular/mouse-simple-regular'
import { MouseSimpleThin } from '../thin/mouse-simple-thin'

const weightMap = {
  regular: MouseSimpleRegular,
  bold: MouseSimpleBold,
  duotone: MouseSimpleDuotone,
  fill: MouseSimpleFill,
  light: MouseSimpleLight,
  thin: MouseSimpleThin,
} as const

export const MouseSimple = (props: IconProps) => {
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
