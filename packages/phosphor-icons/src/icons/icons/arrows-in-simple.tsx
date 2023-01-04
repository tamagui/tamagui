import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsInSimpleBold } from '../bold/arrows-in-simple-bold'
import { ArrowsInSimpleDuotone } from '../duotone/arrows-in-simple-duotone'
import { ArrowsInSimpleFill } from '../fill/arrows-in-simple-fill'
import { ArrowsInSimpleLight } from '../light/arrows-in-simple-light'
import { ArrowsInSimpleRegular } from '../regular/arrows-in-simple-regular'
import { ArrowsInSimpleThin } from '../thin/arrows-in-simple-thin'

const weightMap = {
  regular: ArrowsInSimpleRegular,
  bold: ArrowsInSimpleBold,
  duotone: ArrowsInSimpleDuotone,
  fill: ArrowsInSimpleFill,
  light: ArrowsInSimpleLight,
  thin: ArrowsInSimpleThin,
} as const

export const ArrowsInSimple = (props: IconProps) => {
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
