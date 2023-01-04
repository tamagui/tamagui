import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudSnowBold } from '../bold/cloud-snow-bold'
import { CloudSnowDuotone } from '../duotone/cloud-snow-duotone'
import { CloudSnowFill } from '../fill/cloud-snow-fill'
import { CloudSnowLight } from '../light/cloud-snow-light'
import { CloudSnowRegular } from '../regular/cloud-snow-regular'
import { CloudSnowThin } from '../thin/cloud-snow-thin'

const weightMap = {
  regular: CloudSnowRegular,
  bold: CloudSnowBold,
  duotone: CloudSnowDuotone,
  fill: CloudSnowFill,
  light: CloudSnowLight,
  thin: CloudSnowThin,
} as const

export const CloudSnow = (props: IconProps) => {
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
