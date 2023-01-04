import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SuitcaseSimpleBold } from '../bold/suitcase-simple-bold'
import { SuitcaseSimpleDuotone } from '../duotone/suitcase-simple-duotone'
import { SuitcaseSimpleFill } from '../fill/suitcase-simple-fill'
import { SuitcaseSimpleLight } from '../light/suitcase-simple-light'
import { SuitcaseSimpleRegular } from '../regular/suitcase-simple-regular'
import { SuitcaseSimpleThin } from '../thin/suitcase-simple-thin'

const weightMap = {
  regular: SuitcaseSimpleRegular,
  bold: SuitcaseSimpleBold,
  duotone: SuitcaseSimpleDuotone,
  fill: SuitcaseSimpleFill,
  light: SuitcaseSimpleLight,
  thin: SuitcaseSimpleThin,
} as const

export const SuitcaseSimple = (props: IconProps) => {
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
