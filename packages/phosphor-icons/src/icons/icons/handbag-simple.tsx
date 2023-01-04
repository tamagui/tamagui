import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandbagSimpleBold } from '../bold/handbag-simple-bold'
import { HandbagSimpleDuotone } from '../duotone/handbag-simple-duotone'
import { HandbagSimpleFill } from '../fill/handbag-simple-fill'
import { HandbagSimpleLight } from '../light/handbag-simple-light'
import { HandbagSimpleRegular } from '../regular/handbag-simple-regular'
import { HandbagSimpleThin } from '../thin/handbag-simple-thin'

const weightMap = {
  regular: HandbagSimpleRegular,
  bold: HandbagSimpleBold,
  duotone: HandbagSimpleDuotone,
  fill: HandbagSimpleFill,
  light: HandbagSimpleLight,
  thin: HandbagSimpleThin,
} as const

export const HandbagSimple = (props: IconProps) => {
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
