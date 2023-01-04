import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeadsetBold } from '../bold/headset-bold'
import { HeadsetDuotone } from '../duotone/headset-duotone'
import { HeadsetFill } from '../fill/headset-fill'
import { HeadsetLight } from '../light/headset-light'
import { HeadsetRegular } from '../regular/headset-regular'
import { HeadsetThin } from '../thin/headset-thin'

const weightMap = {
  regular: HeadsetRegular,
  bold: HeadsetBold,
  duotone: HeadsetDuotone,
  fill: HeadsetFill,
  light: HeadsetLight,
  thin: HeadsetThin,
} as const

export const Headset = (props: IconProps) => {
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
