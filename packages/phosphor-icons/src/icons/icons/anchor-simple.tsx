import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AnchorSimpleBold } from '../bold/anchor-simple-bold'
import { AnchorSimpleDuotone } from '../duotone/anchor-simple-duotone'
import { AnchorSimpleFill } from '../fill/anchor-simple-fill'
import { AnchorSimpleLight } from '../light/anchor-simple-light'
import { AnchorSimpleRegular } from '../regular/anchor-simple-regular'
import { AnchorSimpleThin } from '../thin/anchor-simple-thin'

const weightMap = {
  regular: AnchorSimpleRegular,
  bold: AnchorSimpleBold,
  duotone: AnchorSimpleDuotone,
  fill: AnchorSimpleFill,
  light: AnchorSimpleLight,
  thin: AnchorSimpleThin,
} as const

export const AnchorSimple = (props: IconProps) => {
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
