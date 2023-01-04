import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsOutSimpleBold } from '../bold/arrows-out-simple-bold'
import { ArrowsOutSimpleDuotone } from '../duotone/arrows-out-simple-duotone'
import { ArrowsOutSimpleFill } from '../fill/arrows-out-simple-fill'
import { ArrowsOutSimpleLight } from '../light/arrows-out-simple-light'
import { ArrowsOutSimpleRegular } from '../regular/arrows-out-simple-regular'
import { ArrowsOutSimpleThin } from '../thin/arrows-out-simple-thin'

const weightMap = {
  regular: ArrowsOutSimpleRegular,
  bold: ArrowsOutSimpleBold,
  duotone: ArrowsOutSimpleDuotone,
  fill: ArrowsOutSimpleFill,
  light: ArrowsOutSimpleLight,
  thin: ArrowsOutSimpleThin,
} as const

export const ArrowsOutSimple = (props: IconProps) => {
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
