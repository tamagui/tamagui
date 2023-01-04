import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowBendDownLeftBold } from '../bold/arrow-bend-down-left-bold'
import { ArrowBendDownLeftDuotone } from '../duotone/arrow-bend-down-left-duotone'
import { ArrowBendDownLeftFill } from '../fill/arrow-bend-down-left-fill'
import { ArrowBendDownLeftLight } from '../light/arrow-bend-down-left-light'
import { ArrowBendDownLeftRegular } from '../regular/arrow-bend-down-left-regular'
import { ArrowBendDownLeftThin } from '../thin/arrow-bend-down-left-thin'

const weightMap = {
  regular: ArrowBendDownLeftRegular,
  bold: ArrowBendDownLeftBold,
  duotone: ArrowBendDownLeftDuotone,
  fill: ArrowBendDownLeftFill,
  light: ArrowBendDownLeftLight,
  thin: ArrowBendDownLeftThin,
} as const

export const ArrowBendDownLeft = (props: IconProps) => {
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
