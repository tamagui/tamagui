import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendRightDownBold } from '../bold/arrow-bend-right-down-bold'
import { ArrowBendRightDownDuotone } from '../duotone/arrow-bend-right-down-duotone'
import { ArrowBendRightDownFill } from '../fill/arrow-bend-right-down-fill'
import { ArrowBendRightDownLight } from '../light/arrow-bend-right-down-light'
import { ArrowBendRightDownRegular } from '../regular/arrow-bend-right-down-regular'
import { ArrowBendRightDownThin } from '../thin/arrow-bend-right-down-thin'

const weightMap = {
  regular: ArrowBendRightDownRegular,
  bold: ArrowBendRightDownBold,
  duotone: ArrowBendRightDownDuotone,
  fill: ArrowBendRightDownFill,
  light: ArrowBendRightDownLight,
  thin: ArrowBendRightDownThin,
} as const

export const ArrowBendRightDown = (props: IconProps) => {
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
