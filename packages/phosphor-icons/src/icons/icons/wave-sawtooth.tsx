import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WaveSawtoothBold } from '../bold/wave-sawtooth-bold'
import { WaveSawtoothDuotone } from '../duotone/wave-sawtooth-duotone'
import { WaveSawtoothFill } from '../fill/wave-sawtooth-fill'
import { WaveSawtoothLight } from '../light/wave-sawtooth-light'
import { WaveSawtoothRegular } from '../regular/wave-sawtooth-regular'
import { WaveSawtoothThin } from '../thin/wave-sawtooth-thin'

const weightMap = {
  regular: WaveSawtoothRegular,
  bold: WaveSawtoothBold,
  duotone: WaveSawtoothDuotone,
  fill: WaveSawtoothFill,
  light: WaveSawtoothLight,
  thin: WaveSawtoothThin,
} as const

export const WaveSawtooth = (props: IconProps) => {
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
