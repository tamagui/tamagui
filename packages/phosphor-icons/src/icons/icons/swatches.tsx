import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SwatchesBold } from '../bold/swatches-bold'
import { SwatchesDuotone } from '../duotone/swatches-duotone'
import { SwatchesFill } from '../fill/swatches-fill'
import { SwatchesLight } from '../light/swatches-light'
import { SwatchesRegular } from '../regular/swatches-regular'
import { SwatchesThin } from '../thin/swatches-thin'

const weightMap = {
  regular: SwatchesRegular,
  bold: SwatchesBold,
  duotone: SwatchesDuotone,
  fill: SwatchesFill,
  light: SwatchesLight,
  thin: SwatchesThin,
} as const

export const Swatches = (props: IconProps) => {
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
