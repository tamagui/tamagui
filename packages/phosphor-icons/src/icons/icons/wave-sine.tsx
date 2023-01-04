import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WaveSineBold } from '../bold/wave-sine-bold'
import { WaveSineDuotone } from '../duotone/wave-sine-duotone'
import { WaveSineFill } from '../fill/wave-sine-fill'
import { WaveSineLight } from '../light/wave-sine-light'
import { WaveSineRegular } from '../regular/wave-sine-regular'
import { WaveSineThin } from '../thin/wave-sine-thin'

const weightMap = {
  regular: WaveSineRegular,
  bold: WaveSineBold,
  duotone: WaveSineDuotone,
  fill: WaveSineFill,
  light: WaveSineLight,
  thin: WaveSineThin,
} as const

export const WaveSine = (props: IconProps) => {
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
