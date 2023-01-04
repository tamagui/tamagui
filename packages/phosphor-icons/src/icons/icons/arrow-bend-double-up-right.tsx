import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendDoubleUpRightBold } from '../bold/arrow-bend-double-up-right-bold'
import { ArrowBendDoubleUpRightDuotone } from '../duotone/arrow-bend-double-up-right-duotone'
import { ArrowBendDoubleUpRightFill } from '../fill/arrow-bend-double-up-right-fill'
import { ArrowBendDoubleUpRightLight } from '../light/arrow-bend-double-up-right-light'
import { ArrowBendDoubleUpRightRegular } from '../regular/arrow-bend-double-up-right-regular'
import { ArrowBendDoubleUpRightThin } from '../thin/arrow-bend-double-up-right-thin'

const weightMap = {
  regular: ArrowBendDoubleUpRightRegular,
  bold: ArrowBendDoubleUpRightBold,
  duotone: ArrowBendDoubleUpRightDuotone,
  fill: ArrowBendDoubleUpRightFill,
  light: ArrowBendDoubleUpRightLight,
  thin: ArrowBendDoubleUpRightThin,
} as const

export const ArrowBendDoubleUpRight = (props: IconProps) => {
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
