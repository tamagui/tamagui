import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FunnelSimpleBold } from '../bold/funnel-simple-bold'
import { FunnelSimpleDuotone } from '../duotone/funnel-simple-duotone'
import { FunnelSimpleFill } from '../fill/funnel-simple-fill'
import { FunnelSimpleLight } from '../light/funnel-simple-light'
import { FunnelSimpleRegular } from '../regular/funnel-simple-regular'
import { FunnelSimpleThin } from '../thin/funnel-simple-thin'

const weightMap = {
  regular: FunnelSimpleRegular,
  bold: FunnelSimpleBold,
  duotone: FunnelSimpleDuotone,
  fill: FunnelSimpleFill,
  light: FunnelSimpleLight,
  thin: FunnelSimpleThin,
} as const

export const FunnelSimple = (props: IconProps) => {
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
