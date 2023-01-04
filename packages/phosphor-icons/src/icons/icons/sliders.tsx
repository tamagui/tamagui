import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SlidersBold } from '../bold/sliders-bold'
import { SlidersDuotone } from '../duotone/sliders-duotone'
import { SlidersFill } from '../fill/sliders-fill'
import { SlidersLight } from '../light/sliders-light'
import { SlidersRegular } from '../regular/sliders-regular'
import { SlidersThin } from '../thin/sliders-thin'

const weightMap = {
  regular: SlidersRegular,
  bold: SlidersBold,
  duotone: SlidersDuotone,
  fill: SlidersFill,
  light: SlidersLight,
  thin: SlidersThin,
} as const

export const Sliders = (props: IconProps) => {
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
