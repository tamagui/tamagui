import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendDownRightBold } from '../bold/arrow-bend-down-right-bold'
import { ArrowBendDownRightDuotone } from '../duotone/arrow-bend-down-right-duotone'
import { ArrowBendDownRightFill } from '../fill/arrow-bend-down-right-fill'
import { ArrowBendDownRightLight } from '../light/arrow-bend-down-right-light'
import { ArrowBendDownRightRegular } from '../regular/arrow-bend-down-right-regular'
import { ArrowBendDownRightThin } from '../thin/arrow-bend-down-right-thin'

const weightMap = {
  regular: ArrowBendDownRightRegular,
  bold: ArrowBendDownRightBold,
  duotone: ArrowBendDownRightDuotone,
  fill: ArrowBendDownRightFill,
  light: ArrowBendDownRightLight,
  thin: ArrowBendDownRightThin,
} as const

export const ArrowBendDownRight = (props: IconProps) => {
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
