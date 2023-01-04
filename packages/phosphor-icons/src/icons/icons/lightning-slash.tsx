import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LightningSlashBold } from '../bold/lightning-slash-bold'
import { LightningSlashDuotone } from '../duotone/lightning-slash-duotone'
import { LightningSlashFill } from '../fill/lightning-slash-fill'
import { LightningSlashLight } from '../light/lightning-slash-light'
import { LightningSlashRegular } from '../regular/lightning-slash-regular'
import { LightningSlashThin } from '../thin/lightning-slash-thin'

const weightMap = {
  regular: LightningSlashRegular,
  bold: LightningSlashBold,
  duotone: LightningSlashDuotone,
  fill: LightningSlashFill,
  light: LightningSlashLight,
  thin: LightningSlashThin,
} as const

export const LightningSlash = (props: IconProps) => {
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
