import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KeyholeBold } from '../bold/keyhole-bold'
import { KeyholeDuotone } from '../duotone/keyhole-duotone'
import { KeyholeFill } from '../fill/keyhole-fill'
import { KeyholeLight } from '../light/keyhole-light'
import { KeyholeRegular } from '../regular/keyhole-regular'
import { KeyholeThin } from '../thin/keyhole-thin'

const weightMap = {
  regular: KeyholeRegular,
  bold: KeyholeBold,
  duotone: KeyholeDuotone,
  fill: KeyholeFill,
  light: KeyholeLight,
  thin: KeyholeThin,
} as const

export const Keyhole = (props: IconProps) => {
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
