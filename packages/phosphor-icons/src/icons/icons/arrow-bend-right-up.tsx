import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendRightUpBold } from '../bold/arrow-bend-right-up-bold'
import { ArrowBendRightUpDuotone } from '../duotone/arrow-bend-right-up-duotone'
import { ArrowBendRightUpFill } from '../fill/arrow-bend-right-up-fill'
import { ArrowBendRightUpLight } from '../light/arrow-bend-right-up-light'
import { ArrowBendRightUpRegular } from '../regular/arrow-bend-right-up-regular'
import { ArrowBendRightUpThin } from '../thin/arrow-bend-right-up-thin'

const weightMap = {
  regular: ArrowBendRightUpRegular,
  bold: ArrowBendRightUpBold,
  duotone: ArrowBendRightUpDuotone,
  fill: ArrowBendRightUpFill,
  light: ArrowBendRightUpLight,
  thin: ArrowBendRightUpThin,
} as const

export const ArrowBendRightUp = (props: IconProps) => {
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
