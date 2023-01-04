import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EqualizerBold } from '../bold/equalizer-bold'
import { EqualizerDuotone } from '../duotone/equalizer-duotone'
import { EqualizerFill } from '../fill/equalizer-fill'
import { EqualizerLight } from '../light/equalizer-light'
import { EqualizerRegular } from '../regular/equalizer-regular'
import { EqualizerThin } from '../thin/equalizer-thin'

const weightMap = {
  regular: EqualizerRegular,
  bold: EqualizerBold,
  duotone: EqualizerDuotone,
  fill: EqualizerFill,
  light: EqualizerLight,
  thin: EqualizerThin,
} as const

export const Equalizer = (props: IconProps) => {
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
