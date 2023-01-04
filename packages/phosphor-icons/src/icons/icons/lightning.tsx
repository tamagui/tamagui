import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LightningBold } from '../bold/lightning-bold'
import { LightningDuotone } from '../duotone/lightning-duotone'
import { LightningFill } from '../fill/lightning-fill'
import { LightningLight } from '../light/lightning-light'
import { LightningRegular } from '../regular/lightning-regular'
import { LightningThin } from '../thin/lightning-thin'

const weightMap = {
  regular: LightningRegular,
  bold: LightningBold,
  duotone: LightningDuotone,
  fill: LightningFill,
  light: LightningLight,
  thin: LightningThin,
} as const

export const Lightning = (props: IconProps) => {
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
