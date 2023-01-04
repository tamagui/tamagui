import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendUpRightBold } from '../bold/arrow-bend-up-right-bold'
import { ArrowBendUpRightDuotone } from '../duotone/arrow-bend-up-right-duotone'
import { ArrowBendUpRightFill } from '../fill/arrow-bend-up-right-fill'
import { ArrowBendUpRightLight } from '../light/arrow-bend-up-right-light'
import { ArrowBendUpRightRegular } from '../regular/arrow-bend-up-right-regular'
import { ArrowBendUpRightThin } from '../thin/arrow-bend-up-right-thin'

const weightMap = {
  regular: ArrowBendUpRightRegular,
  bold: ArrowBendUpRightBold,
  duotone: ArrowBendUpRightDuotone,
  fill: ArrowBendUpRightFill,
  light: ArrowBendUpRightLight,
  thin: ArrowBendUpRightThin,
} as const

export const ArrowBendUpRight = (props: IconProps) => {
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
