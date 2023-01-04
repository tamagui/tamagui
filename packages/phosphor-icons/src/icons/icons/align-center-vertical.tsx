import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignCenterVerticalBold } from '../bold/align-center-vertical-bold'
import { AlignCenterVerticalDuotone } from '../duotone/align-center-vertical-duotone'
import { AlignCenterVerticalFill } from '../fill/align-center-vertical-fill'
import { AlignCenterVerticalLight } from '../light/align-center-vertical-light'
import { AlignCenterVerticalRegular } from '../regular/align-center-vertical-regular'
import { AlignCenterVerticalThin } from '../thin/align-center-vertical-thin'

const weightMap = {
  regular: AlignCenterVerticalRegular,
  bold: AlignCenterVerticalBold,
  duotone: AlignCenterVerticalDuotone,
  fill: AlignCenterVerticalFill,
  light: AlignCenterVerticalLight,
  thin: AlignCenterVerticalThin,
} as const

export const AlignCenterVertical = (props: IconProps) => {
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
