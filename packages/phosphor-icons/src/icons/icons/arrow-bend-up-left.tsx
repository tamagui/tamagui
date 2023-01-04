import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendUpLeftBold } from '../bold/arrow-bend-up-left-bold'
import { ArrowBendUpLeftDuotone } from '../duotone/arrow-bend-up-left-duotone'
import { ArrowBendUpLeftFill } from '../fill/arrow-bend-up-left-fill'
import { ArrowBendUpLeftLight } from '../light/arrow-bend-up-left-light'
import { ArrowBendUpLeftRegular } from '../regular/arrow-bend-up-left-regular'
import { ArrowBendUpLeftThin } from '../thin/arrow-bend-up-left-thin'

const weightMap = {
  regular: ArrowBendUpLeftRegular,
  bold: ArrowBendUpLeftBold,
  duotone: ArrowBendUpLeftDuotone,
  fill: ArrowBendUpLeftFill,
  light: ArrowBendUpLeftLight,
  thin: ArrowBendUpLeftThin,
} as const

export const ArrowBendUpLeft = (props: IconProps) => {
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
