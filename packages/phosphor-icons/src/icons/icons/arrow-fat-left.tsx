import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLeftBold } from '../bold/arrow-fat-left-bold'
import { ArrowFatLeftDuotone } from '../duotone/arrow-fat-left-duotone'
import { ArrowFatLeftFill } from '../fill/arrow-fat-left-fill'
import { ArrowFatLeftLight } from '../light/arrow-fat-left-light'
import { ArrowFatLeftRegular } from '../regular/arrow-fat-left-regular'
import { ArrowFatLeftThin } from '../thin/arrow-fat-left-thin'

const weightMap = {
  regular: ArrowFatLeftRegular,
  bold: ArrowFatLeftBold,
  duotone: ArrowFatLeftDuotone,
  fill: ArrowFatLeftFill,
  light: ArrowFatLeftLight,
  thin: ArrowFatLeftThin,
} as const

export const ArrowFatLeft = (props: IconProps) => {
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
