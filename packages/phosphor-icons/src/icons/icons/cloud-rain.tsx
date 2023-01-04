import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudRainBold } from '../bold/cloud-rain-bold'
import { CloudRainDuotone } from '../duotone/cloud-rain-duotone'
import { CloudRainFill } from '../fill/cloud-rain-fill'
import { CloudRainLight } from '../light/cloud-rain-light'
import { CloudRainRegular } from '../regular/cloud-rain-regular'
import { CloudRainThin } from '../thin/cloud-rain-thin'

const weightMap = {
  regular: CloudRainRegular,
  bold: CloudRainBold,
  duotone: CloudRainDuotone,
  fill: CloudRainFill,
  light: CloudRainLight,
  thin: CloudRainThin,
} as const

export const CloudRain = (props: IconProps) => {
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
