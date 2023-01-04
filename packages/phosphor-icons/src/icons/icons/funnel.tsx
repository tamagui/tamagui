import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FunnelBold } from '../bold/funnel-bold'
import { FunnelDuotone } from '../duotone/funnel-duotone'
import { FunnelFill } from '../fill/funnel-fill'
import { FunnelLight } from '../light/funnel-light'
import { FunnelRegular } from '../regular/funnel-regular'
import { FunnelThin } from '../thin/funnel-thin'

const weightMap = {
  regular: FunnelRegular,
  bold: FunnelBold,
  duotone: FunnelDuotone,
  fill: FunnelFill,
  light: FunnelLight,
  thin: FunnelThin,
} as const

export const Funnel = (props: IconProps) => {
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
