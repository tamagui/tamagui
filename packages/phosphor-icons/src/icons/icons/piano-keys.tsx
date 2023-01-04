import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PianoKeysBold } from '../bold/piano-keys-bold'
import { PianoKeysDuotone } from '../duotone/piano-keys-duotone'
import { PianoKeysFill } from '../fill/piano-keys-fill'
import { PianoKeysLight } from '../light/piano-keys-light'
import { PianoKeysRegular } from '../regular/piano-keys-regular'
import { PianoKeysThin } from '../thin/piano-keys-thin'

const weightMap = {
  regular: PianoKeysRegular,
  bold: PianoKeysBold,
  duotone: PianoKeysDuotone,
  fill: PianoKeysFill,
  light: PianoKeysLight,
  thin: PianoKeysThin,
} as const

export const PianoKeys = (props: IconProps) => {
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
