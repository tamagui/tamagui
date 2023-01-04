import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignBottomSimpleBold } from '../bold/align-bottom-simple-bold'
import { AlignBottomSimpleDuotone } from '../duotone/align-bottom-simple-duotone'
import { AlignBottomSimpleFill } from '../fill/align-bottom-simple-fill'
import { AlignBottomSimpleLight } from '../light/align-bottom-simple-light'
import { AlignBottomSimpleRegular } from '../regular/align-bottom-simple-regular'
import { AlignBottomSimpleThin } from '../thin/align-bottom-simple-thin'

const weightMap = {
  regular: AlignBottomSimpleRegular,
  bold: AlignBottomSimpleBold,
  duotone: AlignBottomSimpleDuotone,
  fill: AlignBottomSimpleFill,
  light: AlignBottomSimpleLight,
  thin: AlignBottomSimpleThin,
} as const

export const AlignBottomSimple = (props: IconProps) => {
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
