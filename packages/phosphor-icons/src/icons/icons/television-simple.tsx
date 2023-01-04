import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TelevisionSimpleBold } from '../bold/television-simple-bold'
import { TelevisionSimpleDuotone } from '../duotone/television-simple-duotone'
import { TelevisionSimpleFill } from '../fill/television-simple-fill'
import { TelevisionSimpleLight } from '../light/television-simple-light'
import { TelevisionSimpleRegular } from '../regular/television-simple-regular'
import { TelevisionSimpleThin } from '../thin/television-simple-thin'

const weightMap = {
  regular: TelevisionSimpleRegular,
  bold: TelevisionSimpleBold,
  duotone: TelevisionSimpleDuotone,
  fill: TelevisionSimpleFill,
  light: TelevisionSimpleLight,
  thin: TelevisionSimpleThin,
} as const

export const TelevisionSimple = (props: IconProps) => {
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
