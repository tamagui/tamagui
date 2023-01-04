import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudLightningBold } from '../bold/cloud-lightning-bold'
import { CloudLightningDuotone } from '../duotone/cloud-lightning-duotone'
import { CloudLightningFill } from '../fill/cloud-lightning-fill'
import { CloudLightningLight } from '../light/cloud-lightning-light'
import { CloudLightningRegular } from '../regular/cloud-lightning-regular'
import { CloudLightningThin } from '../thin/cloud-lightning-thin'

const weightMap = {
  regular: CloudLightningRegular,
  bold: CloudLightningBold,
  duotone: CloudLightningDuotone,
  fill: CloudLightningFill,
  light: CloudLightningLight,
  thin: CloudLightningThin,
} as const

export const CloudLightning = (props: IconProps) => {
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
