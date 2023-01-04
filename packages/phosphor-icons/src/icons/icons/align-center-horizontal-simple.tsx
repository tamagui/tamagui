import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignCenterHorizontalSimpleBold } from '../bold/align-center-horizontal-simple-bold'
import { AlignCenterHorizontalSimpleDuotone } from '../duotone/align-center-horizontal-simple-duotone'
import { AlignCenterHorizontalSimpleFill } from '../fill/align-center-horizontal-simple-fill'
import { AlignCenterHorizontalSimpleLight } from '../light/align-center-horizontal-simple-light'
import { AlignCenterHorizontalSimpleRegular } from '../regular/align-center-horizontal-simple-regular'
import { AlignCenterHorizontalSimpleThin } from '../thin/align-center-horizontal-simple-thin'

const weightMap = {
  regular: AlignCenterHorizontalSimpleRegular,
  bold: AlignCenterHorizontalSimpleBold,
  duotone: AlignCenterHorizontalSimpleDuotone,
  fill: AlignCenterHorizontalSimpleFill,
  light: AlignCenterHorizontalSimpleLight,
  thin: AlignCenterHorizontalSimpleThin,
} as const

export const AlignCenterHorizontalSimple = (props: IconProps) => {
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
