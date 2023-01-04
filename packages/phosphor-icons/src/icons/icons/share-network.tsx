import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShareNetworkBold } from '../bold/share-network-bold'
import { ShareNetworkDuotone } from '../duotone/share-network-duotone'
import { ShareNetworkFill } from '../fill/share-network-fill'
import { ShareNetworkLight } from '../light/share-network-light'
import { ShareNetworkRegular } from '../regular/share-network-regular'
import { ShareNetworkThin } from '../thin/share-network-thin'

const weightMap = {
  regular: ShareNetworkRegular,
  bold: ShareNetworkBold,
  duotone: ShareNetworkDuotone,
  fill: ShareNetworkFill,
  light: ShareNetworkLight,
  thin: ShareNetworkThin,
} as const

export const ShareNetwork = (props: IconProps) => {
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
