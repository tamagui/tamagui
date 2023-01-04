import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RainbowCloudBold } from '../bold/rainbow-cloud-bold'
import { RainbowCloudDuotone } from '../duotone/rainbow-cloud-duotone'
import { RainbowCloudFill } from '../fill/rainbow-cloud-fill'
import { RainbowCloudLight } from '../light/rainbow-cloud-light'
import { RainbowCloudRegular } from '../regular/rainbow-cloud-regular'
import { RainbowCloudThin } from '../thin/rainbow-cloud-thin'

const weightMap = {
  regular: RainbowCloudRegular,
  bold: RainbowCloudBold,
  duotone: RainbowCloudDuotone,
  fill: RainbowCloudFill,
  light: RainbowCloudLight,
  thin: RainbowCloudThin,
} as const

export const RainbowCloud = (props: IconProps) => {
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
