import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendDoubleUpLeftBold } from '../bold/arrow-bend-double-up-left-bold'
import { ArrowBendDoubleUpLeftDuotone } from '../duotone/arrow-bend-double-up-left-duotone'
import { ArrowBendDoubleUpLeftFill } from '../fill/arrow-bend-double-up-left-fill'
import { ArrowBendDoubleUpLeftLight } from '../light/arrow-bend-double-up-left-light'
import { ArrowBendDoubleUpLeftRegular } from '../regular/arrow-bend-double-up-left-regular'
import { ArrowBendDoubleUpLeftThin } from '../thin/arrow-bend-double-up-left-thin'

const weightMap = {
  regular: ArrowBendDoubleUpLeftRegular,
  bold: ArrowBendDoubleUpLeftBold,
  duotone: ArrowBendDoubleUpLeftDuotone,
  fill: ArrowBendDoubleUpLeftFill,
  light: ArrowBendDoubleUpLeftLight,
  thin: ArrowBendDoubleUpLeftThin,
} as const

export const ArrowBendDoubleUpLeft = (props: IconProps) => {
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
