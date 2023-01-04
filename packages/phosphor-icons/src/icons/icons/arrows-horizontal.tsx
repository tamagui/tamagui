import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsHorizontalBold } from '../bold/arrows-horizontal-bold'
import { ArrowsHorizontalDuotone } from '../duotone/arrows-horizontal-duotone'
import { ArrowsHorizontalFill } from '../fill/arrows-horizontal-fill'
import { ArrowsHorizontalLight } from '../light/arrows-horizontal-light'
import { ArrowsHorizontalRegular } from '../regular/arrows-horizontal-regular'
import { ArrowsHorizontalThin } from '../thin/arrows-horizontal-thin'

const weightMap = {
  regular: ArrowsHorizontalRegular,
  bold: ArrowsHorizontalBold,
  duotone: ArrowsHorizontalDuotone,
  fill: ArrowsHorizontalFill,
  light: ArrowsHorizontalLight,
  thin: ArrowsHorizontalThin,
} as const

export const ArrowsHorizontal = (props: IconProps) => {
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
