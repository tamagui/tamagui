import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DropHalfBottomBold } from '../bold/drop-half-bottom-bold'
import { DropHalfBottomDuotone } from '../duotone/drop-half-bottom-duotone'
import { DropHalfBottomFill } from '../fill/drop-half-bottom-fill'
import { DropHalfBottomLight } from '../light/drop-half-bottom-light'
import { DropHalfBottomRegular } from '../regular/drop-half-bottom-regular'
import { DropHalfBottomThin } from '../thin/drop-half-bottom-thin'

const weightMap = {
  regular: DropHalfBottomRegular,
  bold: DropHalfBottomBold,
  duotone: DropHalfBottomDuotone,
  fill: DropHalfBottomFill,
  light: DropHalfBottomLight,
  thin: DropHalfBottomThin,
} as const

export const DropHalfBottom = (props: IconProps) => {
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
