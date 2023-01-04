import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignTopSimpleBold } from '../bold/align-top-simple-bold'
import { AlignTopSimpleDuotone } from '../duotone/align-top-simple-duotone'
import { AlignTopSimpleFill } from '../fill/align-top-simple-fill'
import { AlignTopSimpleLight } from '../light/align-top-simple-light'
import { AlignTopSimpleRegular } from '../regular/align-top-simple-regular'
import { AlignTopSimpleThin } from '../thin/align-top-simple-thin'

const weightMap = {
  regular: AlignTopSimpleRegular,
  bold: AlignTopSimpleBold,
  duotone: AlignTopSimpleDuotone,
  fill: AlignTopSimpleFill,
  light: AlignTopSimpleLight,
  thin: AlignTopSimpleThin,
} as const

export const AlignTopSimple = (props: IconProps) => {
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
