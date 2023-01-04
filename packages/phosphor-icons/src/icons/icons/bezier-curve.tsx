import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BezierCurveBold } from '../bold/bezier-curve-bold'
import { BezierCurveDuotone } from '../duotone/bezier-curve-duotone'
import { BezierCurveFill } from '../fill/bezier-curve-fill'
import { BezierCurveLight } from '../light/bezier-curve-light'
import { BezierCurveRegular } from '../regular/bezier-curve-regular'
import { BezierCurveThin } from '../thin/bezier-curve-thin'

const weightMap = {
  regular: BezierCurveRegular,
  bold: BezierCurveBold,
  duotone: BezierCurveDuotone,
  fill: BezierCurveFill,
  light: BezierCurveLight,
  thin: BezierCurveThin,
} as const

export const BezierCurve = (props: IconProps) => {
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
