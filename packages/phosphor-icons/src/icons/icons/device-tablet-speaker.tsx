import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DeviceTabletSpeakerBold } from '../bold/device-tablet-speaker-bold'
import { DeviceTabletSpeakerDuotone } from '../duotone/device-tablet-speaker-duotone'
import { DeviceTabletSpeakerFill } from '../fill/device-tablet-speaker-fill'
import { DeviceTabletSpeakerLight } from '../light/device-tablet-speaker-light'
import { DeviceTabletSpeakerRegular } from '../regular/device-tablet-speaker-regular'
import { DeviceTabletSpeakerThin } from '../thin/device-tablet-speaker-thin'

const weightMap = {
  regular: DeviceTabletSpeakerRegular,
  bold: DeviceTabletSpeakerBold,
  duotone: DeviceTabletSpeakerDuotone,
  fill: DeviceTabletSpeakerFill,
  light: DeviceTabletSpeakerLight,
  thin: DeviceTabletSpeakerThin,
} as const

export const DeviceTabletSpeaker = (props: IconProps) => {
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
