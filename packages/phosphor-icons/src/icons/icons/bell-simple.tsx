import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellSimpleBold } from '../bold/bell-simple-bold'
import { BellSimpleDuotone } from '../duotone/bell-simple-duotone'
import { BellSimpleFill } from '../fill/bell-simple-fill'
import { BellSimpleLight } from '../light/bell-simple-light'
import { BellSimpleRegular } from '../regular/bell-simple-regular'
import { BellSimpleThin } from '../thin/bell-simple-thin'

const weightMap = {
  regular: BellSimpleRegular,
  bold: BellSimpleBold,
  duotone: BellSimpleDuotone,
  fill: BellSimpleFill,
  light: BellSimpleLight,
  thin: BellSimpleThin,
} as const

export const BellSimple = (props: IconProps) => {
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
