import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CloudSunBold } from '../bold/cloud-sun-bold'
import { CloudSunDuotone } from '../duotone/cloud-sun-duotone'
import { CloudSunFill } from '../fill/cloud-sun-fill'
import { CloudSunLight } from '../light/cloud-sun-light'
import { CloudSunRegular } from '../regular/cloud-sun-regular'
import { CloudSunThin } from '../thin/cloud-sun-thin'

const weightMap = {
  regular: CloudSunRegular,
  bold: CloudSunBold,
  duotone: CloudSunDuotone,
  fill: CloudSunFill,
  light: CloudSunLight,
  thin: CloudSunThin,
} as const

export const CloudSun = (props: IconProps) => {
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
