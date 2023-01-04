import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GlobeSimpleBold } from '../bold/globe-simple-bold'
import { GlobeSimpleDuotone } from '../duotone/globe-simple-duotone'
import { GlobeSimpleFill } from '../fill/globe-simple-fill'
import { GlobeSimpleLight } from '../light/globe-simple-light'
import { GlobeSimpleRegular } from '../regular/globe-simple-regular'
import { GlobeSimpleThin } from '../thin/globe-simple-thin'

const weightMap = {
  regular: GlobeSimpleRegular,
  bold: GlobeSimpleBold,
  duotone: GlobeSimpleDuotone,
  fill: GlobeSimpleFill,
  light: GlobeSimpleLight,
  thin: GlobeSimpleThin,
} as const

export const GlobeSimple = (props: IconProps) => {
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
