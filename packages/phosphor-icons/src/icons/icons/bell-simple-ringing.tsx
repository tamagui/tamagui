import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellSimpleRingingBold } from '../bold/bell-simple-ringing-bold'
import { BellSimpleRingingDuotone } from '../duotone/bell-simple-ringing-duotone'
import { BellSimpleRingingFill } from '../fill/bell-simple-ringing-fill'
import { BellSimpleRingingLight } from '../light/bell-simple-ringing-light'
import { BellSimpleRingingRegular } from '../regular/bell-simple-ringing-regular'
import { BellSimpleRingingThin } from '../thin/bell-simple-ringing-thin'

const weightMap = {
  regular: BellSimpleRingingRegular,
  bold: BellSimpleRingingBold,
  duotone: BellSimpleRingingDuotone,
  fill: BellSimpleRingingFill,
  light: BellSimpleRingingLight,
  thin: BellSimpleRingingThin,
} as const

export const BellSimpleRinging = (props: IconProps) => {
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
