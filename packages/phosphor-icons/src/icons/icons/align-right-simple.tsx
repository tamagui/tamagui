import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignRightSimpleBold } from '../bold/align-right-simple-bold'
import { AlignRightSimpleDuotone } from '../duotone/align-right-simple-duotone'
import { AlignRightSimpleFill } from '../fill/align-right-simple-fill'
import { AlignRightSimpleLight } from '../light/align-right-simple-light'
import { AlignRightSimpleRegular } from '../regular/align-right-simple-regular'
import { AlignRightSimpleThin } from '../thin/align-right-simple-thin'

const weightMap = {
  regular: AlignRightSimpleRegular,
  bold: AlignRightSimpleBold,
  duotone: AlignRightSimpleDuotone,
  fill: AlignRightSimpleFill,
  light: AlignRightSimpleLight,
  thin: AlignRightSimpleThin,
} as const

export const AlignRightSimple = (props: IconProps) => {
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
