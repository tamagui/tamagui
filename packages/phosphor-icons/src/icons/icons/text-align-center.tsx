import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextAlignCenterBold } from '../bold/text-align-center-bold'
import { TextAlignCenterDuotone } from '../duotone/text-align-center-duotone'
import { TextAlignCenterFill } from '../fill/text-align-center-fill'
import { TextAlignCenterLight } from '../light/text-align-center-light'
import { TextAlignCenterRegular } from '../regular/text-align-center-regular'
import { TextAlignCenterThin } from '../thin/text-align-center-thin'

const weightMap = {
  regular: TextAlignCenterRegular,
  bold: TextAlignCenterBold,
  duotone: TextAlignCenterDuotone,
  fill: TextAlignCenterFill,
  light: TextAlignCenterLight,
  thin: TextAlignCenterThin,
} as const

export const TextAlignCenter = (props: IconProps) => {
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
