import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AsteriskSimpleBold } from '../bold/asterisk-simple-bold'
import { AsteriskSimpleDuotone } from '../duotone/asterisk-simple-duotone'
import { AsteriskSimpleFill } from '../fill/asterisk-simple-fill'
import { AsteriskSimpleLight } from '../light/asterisk-simple-light'
import { AsteriskSimpleRegular } from '../regular/asterisk-simple-regular'
import { AsteriskSimpleThin } from '../thin/asterisk-simple-thin'

const weightMap = {
  regular: AsteriskSimpleRegular,
  bold: AsteriskSimpleBold,
  duotone: AsteriskSimpleDuotone,
  fill: AsteriskSimpleFill,
  light: AsteriskSimpleLight,
  thin: AsteriskSimpleThin,
} as const

export const AsteriskSimple = (props: IconProps) => {
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
