import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLineLeftBold } from '../bold/arrow-fat-line-left-bold'
import { ArrowFatLineLeftDuotone } from '../duotone/arrow-fat-line-left-duotone'
import { ArrowFatLineLeftFill } from '../fill/arrow-fat-line-left-fill'
import { ArrowFatLineLeftLight } from '../light/arrow-fat-line-left-light'
import { ArrowFatLineLeftRegular } from '../regular/arrow-fat-line-left-regular'
import { ArrowFatLineLeftThin } from '../thin/arrow-fat-line-left-thin'

const weightMap = {
  regular: ArrowFatLineLeftRegular,
  bold: ArrowFatLineLeftBold,
  duotone: ArrowFatLineLeftDuotone,
  fill: ArrowFatLineLeftFill,
  light: ArrowFatLineLeftLight,
  thin: ArrowFatLineLeftThin,
} as const

export const ArrowFatLineLeft = (props: IconProps) => {
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
