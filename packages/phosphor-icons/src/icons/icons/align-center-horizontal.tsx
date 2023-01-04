import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignCenterHorizontalBold } from '../bold/align-center-horizontal-bold'
import { AlignCenterHorizontalDuotone } from '../duotone/align-center-horizontal-duotone'
import { AlignCenterHorizontalFill } from '../fill/align-center-horizontal-fill'
import { AlignCenterHorizontalLight } from '../light/align-center-horizontal-light'
import { AlignCenterHorizontalRegular } from '../regular/align-center-horizontal-regular'
import { AlignCenterHorizontalThin } from '../thin/align-center-horizontal-thin'

const weightMap = {
  regular: AlignCenterHorizontalRegular,
  bold: AlignCenterHorizontalBold,
  duotone: AlignCenterHorizontalDuotone,
  fill: AlignCenterHorizontalFill,
  light: AlignCenterHorizontalLight,
  thin: AlignCenterHorizontalThin,
} as const

export const AlignCenterHorizontal = (props: IconProps) => {
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
