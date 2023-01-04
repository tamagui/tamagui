import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudFogBold } from '../bold/cloud-fog-bold'
import { CloudFogDuotone } from '../duotone/cloud-fog-duotone'
import { CloudFogFill } from '../fill/cloud-fog-fill'
import { CloudFogLight } from '../light/cloud-fog-light'
import { CloudFogRegular } from '../regular/cloud-fog-regular'
import { CloudFogThin } from '../thin/cloud-fog-thin'

const weightMap = {
  regular: CloudFogRegular,
  bold: CloudFogBold,
  duotone: CloudFogDuotone,
  fill: CloudFogFill,
  light: CloudFogLight,
  thin: CloudFogThin,
} as const

export const CloudFog = (props: IconProps) => {
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
