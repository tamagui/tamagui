import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellRingingBold } from '../bold/bell-ringing-bold'
import { BellRingingDuotone } from '../duotone/bell-ringing-duotone'
import { BellRingingFill } from '../fill/bell-ringing-fill'
import { BellRingingLight } from '../light/bell-ringing-light'
import { BellRingingRegular } from '../regular/bell-ringing-regular'
import { BellRingingThin } from '../thin/bell-ringing-thin'

const weightMap = {
  regular: BellRingingRegular,
  bold: BellRingingBold,
  duotone: BellRingingDuotone,
  fill: BellRingingFill,
  light: BellRingingLight,
  thin: BellRingingThin,
} as const

export const BellRinging = (props: IconProps) => {
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
