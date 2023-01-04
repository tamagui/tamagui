import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WavesBold } from '../bold/waves-bold'
import { WavesDuotone } from '../duotone/waves-duotone'
import { WavesFill } from '../fill/waves-fill'
import { WavesLight } from '../light/waves-light'
import { WavesRegular } from '../regular/waves-regular'
import { WavesThin } from '../thin/waves-thin'

const weightMap = {
  regular: WavesRegular,
  bold: WavesBold,
  duotone: WavesDuotone,
  fill: WavesFill,
  light: WavesLight,
  thin: WavesThin,
} as const

export const Waves = (props: IconProps) => {
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
