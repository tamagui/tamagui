import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AsteriskBold } from '../bold/asterisk-bold'
import { AsteriskDuotone } from '../duotone/asterisk-duotone'
import { AsteriskFill } from '../fill/asterisk-fill'
import { AsteriskLight } from '../light/asterisk-light'
import { AsteriskRegular } from '../regular/asterisk-regular'
import { AsteriskThin } from '../thin/asterisk-thin'

const weightMap = {
  regular: AsteriskRegular,
  bold: AsteriskBold,
  duotone: AsteriskDuotone,
  fill: AsteriskFill,
  light: AsteriskLight,
  thin: AsteriskThin,
} as const

export const Asterisk = (props: IconProps) => {
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
