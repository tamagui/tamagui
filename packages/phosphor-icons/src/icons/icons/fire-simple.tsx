import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FireSimpleBold } from '../bold/fire-simple-bold'
import { FireSimpleDuotone } from '../duotone/fire-simple-duotone'
import { FireSimpleFill } from '../fill/fire-simple-fill'
import { FireSimpleLight } from '../light/fire-simple-light'
import { FireSimpleRegular } from '../regular/fire-simple-regular'
import { FireSimpleThin } from '../thin/fire-simple-thin'

const weightMap = {
  regular: FireSimpleRegular,
  bold: FireSimpleBold,
  duotone: FireSimpleDuotone,
  fill: FireSimpleFill,
  light: FireSimpleLight,
  thin: FireSimpleThin,
} as const

export const FireSimple = (props: IconProps) => {
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
