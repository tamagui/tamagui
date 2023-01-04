import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SlidersHorizontalBold } from '../bold/sliders-horizontal-bold'
import { SlidersHorizontalDuotone } from '../duotone/sliders-horizontal-duotone'
import { SlidersHorizontalFill } from '../fill/sliders-horizontal-fill'
import { SlidersHorizontalLight } from '../light/sliders-horizontal-light'
import { SlidersHorizontalRegular } from '../regular/sliders-horizontal-regular'
import { SlidersHorizontalThin } from '../thin/sliders-horizontal-thin'

const weightMap = {
  regular: SlidersHorizontalRegular,
  bold: SlidersHorizontalBold,
  duotone: SlidersHorizontalDuotone,
  fill: SlidersHorizontalFill,
  light: SlidersHorizontalLight,
  thin: SlidersHorizontalThin,
} as const

export const SlidersHorizontal = (props: IconProps) => {
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
