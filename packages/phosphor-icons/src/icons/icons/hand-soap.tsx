import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandSoapBold } from '../bold/hand-soap-bold'
import { HandSoapDuotone } from '../duotone/hand-soap-duotone'
import { HandSoapFill } from '../fill/hand-soap-fill'
import { HandSoapLight } from '../light/hand-soap-light'
import { HandSoapRegular } from '../regular/hand-soap-regular'
import { HandSoapThin } from '../thin/hand-soap-thin'

const weightMap = {
  regular: HandSoapRegular,
  bold: HandSoapBold,
  duotone: HandSoapDuotone,
  fill: HandSoapFill,
  light: HandSoapLight,
  thin: HandSoapThin,
} as const

export const HandSoap = (props: IconProps) => {
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
