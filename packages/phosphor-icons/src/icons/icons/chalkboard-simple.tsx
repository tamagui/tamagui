import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChalkboardSimpleBold } from '../bold/chalkboard-simple-bold'
import { ChalkboardSimpleDuotone } from '../duotone/chalkboard-simple-duotone'
import { ChalkboardSimpleFill } from '../fill/chalkboard-simple-fill'
import { ChalkboardSimpleLight } from '../light/chalkboard-simple-light'
import { ChalkboardSimpleRegular } from '../regular/chalkboard-simple-regular'
import { ChalkboardSimpleThin } from '../thin/chalkboard-simple-thin'

const weightMap = {
  regular: ChalkboardSimpleRegular,
  bold: ChalkboardSimpleBold,
  duotone: ChalkboardSimpleDuotone,
  fill: ChalkboardSimpleFill,
  light: ChalkboardSimpleLight,
  thin: ChalkboardSimpleThin,
} as const

export const ChalkboardSimple = (props: IconProps) => {
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
