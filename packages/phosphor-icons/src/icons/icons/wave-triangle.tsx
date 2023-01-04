import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WaveTriangleBold } from '../bold/wave-triangle-bold'
import { WaveTriangleDuotone } from '../duotone/wave-triangle-duotone'
import { WaveTriangleFill } from '../fill/wave-triangle-fill'
import { WaveTriangleLight } from '../light/wave-triangle-light'
import { WaveTriangleRegular } from '../regular/wave-triangle-regular'
import { WaveTriangleThin } from '../thin/wave-triangle-thin'

const weightMap = {
  regular: WaveTriangleRegular,
  bold: WaveTriangleBold,
  duotone: WaveTriangleDuotone,
  fill: WaveTriangleFill,
  light: WaveTriangleLight,
  thin: WaveTriangleThin,
} as const

export const WaveTriangle = (props: IconProps) => {
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
