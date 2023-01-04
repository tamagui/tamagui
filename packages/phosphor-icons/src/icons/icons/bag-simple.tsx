import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BagSimpleBold } from '../bold/bag-simple-bold'
import { BagSimpleDuotone } from '../duotone/bag-simple-duotone'
import { BagSimpleFill } from '../fill/bag-simple-fill'
import { BagSimpleLight } from '../light/bag-simple-light'
import { BagSimpleRegular } from '../regular/bag-simple-regular'
import { BagSimpleThin } from '../thin/bag-simple-thin'

const weightMap = {
  regular: BagSimpleRegular,
  bold: BagSimpleBold,
  duotone: BagSimpleDuotone,
  fill: BagSimpleFill,
  light: BagSimpleLight,
  thin: BagSimpleThin,
} as const

export const BagSimple = (props: IconProps) => {
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
