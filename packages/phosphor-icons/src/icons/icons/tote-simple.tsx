import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToteSimpleBold } from '../bold/tote-simple-bold'
import { ToteSimpleDuotone } from '../duotone/tote-simple-duotone'
import { ToteSimpleFill } from '../fill/tote-simple-fill'
import { ToteSimpleLight } from '../light/tote-simple-light'
import { ToteSimpleRegular } from '../regular/tote-simple-regular'
import { ToteSimpleThin } from '../thin/tote-simple-thin'

const weightMap = {
  regular: ToteSimpleRegular,
  bold: ToteSimpleBold,
  duotone: ToteSimpleDuotone,
  fill: ToteSimpleFill,
  light: ToteSimpleLight,
  thin: ToteSimpleThin,
} as const

export const ToteSimple = (props: IconProps) => {
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
