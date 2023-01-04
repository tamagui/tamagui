import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FirstAidKitBold } from '../bold/first-aid-kit-bold'
import { FirstAidKitDuotone } from '../duotone/first-aid-kit-duotone'
import { FirstAidKitFill } from '../fill/first-aid-kit-fill'
import { FirstAidKitLight } from '../light/first-aid-kit-light'
import { FirstAidKitRegular } from '../regular/first-aid-kit-regular'
import { FirstAidKitThin } from '../thin/first-aid-kit-thin'

const weightMap = {
  regular: FirstAidKitRegular,
  bold: FirstAidKitBold,
  duotone: FirstAidKitDuotone,
  fill: FirstAidKitFill,
  light: FirstAidKitLight,
  thin: FirstAidKitThin,
} as const

export const FirstAidKit = (props: IconProps) => {
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
