import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendLeftUpBold } from '../bold/arrow-bend-left-up-bold'
import { ArrowBendLeftUpDuotone } from '../duotone/arrow-bend-left-up-duotone'
import { ArrowBendLeftUpFill } from '../fill/arrow-bend-left-up-fill'
import { ArrowBendLeftUpLight } from '../light/arrow-bend-left-up-light'
import { ArrowBendLeftUpRegular } from '../regular/arrow-bend-left-up-regular'
import { ArrowBendLeftUpThin } from '../thin/arrow-bend-left-up-thin'

const weightMap = {
  regular: ArrowBendLeftUpRegular,
  bold: ArrowBendLeftUpBold,
  duotone: ArrowBendLeftUpDuotone,
  fill: ArrowBendLeftUpFill,
  light: ArrowBendLeftUpLight,
  thin: ArrowBendLeftUpThin,
} as const

export const ArrowBendLeftUp = (props: IconProps) => {
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
