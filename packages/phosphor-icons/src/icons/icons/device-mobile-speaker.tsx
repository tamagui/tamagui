import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DeviceMobileSpeakerBold } from '../bold/device-mobile-speaker-bold'
import { DeviceMobileSpeakerDuotone } from '../duotone/device-mobile-speaker-duotone'
import { DeviceMobileSpeakerFill } from '../fill/device-mobile-speaker-fill'
import { DeviceMobileSpeakerLight } from '../light/device-mobile-speaker-light'
import { DeviceMobileSpeakerRegular } from '../regular/device-mobile-speaker-regular'
import { DeviceMobileSpeakerThin } from '../thin/device-mobile-speaker-thin'

const weightMap = {
  regular: DeviceMobileSpeakerRegular,
  bold: DeviceMobileSpeakerBold,
  duotone: DeviceMobileSpeakerDuotone,
  fill: DeviceMobileSpeakerFill,
  light: DeviceMobileSpeakerLight,
  thin: DeviceMobileSpeakerThin,
} as const

export const DeviceMobileSpeaker = (props: IconProps) => {
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
