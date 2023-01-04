import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignCenterVerticalSimpleBold } from '../bold/align-center-vertical-simple-bold'
import { AlignCenterVerticalSimpleDuotone } from '../duotone/align-center-vertical-simple-duotone'
import { AlignCenterVerticalSimpleFill } from '../fill/align-center-vertical-simple-fill'
import { AlignCenterVerticalSimpleLight } from '../light/align-center-vertical-simple-light'
import { AlignCenterVerticalSimpleRegular } from '../regular/align-center-vertical-simple-regular'
import { AlignCenterVerticalSimpleThin } from '../thin/align-center-vertical-simple-thin'

const weightMap = {
  regular: AlignCenterVerticalSimpleRegular,
  bold: AlignCenterVerticalSimpleBold,
  duotone: AlignCenterVerticalSimpleDuotone,
  fill: AlignCenterVerticalSimpleFill,
  light: AlignCenterVerticalSimpleLight,
  thin: AlignCenterVerticalSimpleThin,
} as const

export const AlignCenterVerticalSimple = (props: IconProps) => {
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
