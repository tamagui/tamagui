import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EjectSimpleBold } from '../bold/eject-simple-bold'
import { EjectSimpleDuotone } from '../duotone/eject-simple-duotone'
import { EjectSimpleFill } from '../fill/eject-simple-fill'
import { EjectSimpleLight } from '../light/eject-simple-light'
import { EjectSimpleRegular } from '../regular/eject-simple-regular'
import { EjectSimpleThin } from '../thin/eject-simple-thin'

const weightMap = {
  regular: EjectSimpleRegular,
  bold: EjectSimpleBold,
  duotone: EjectSimpleDuotone,
  fill: EjectSimpleFill,
  light: EjectSimpleLight,
  thin: EjectSimpleThin,
} as const

export const EjectSimple = (props: IconProps) => {
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
