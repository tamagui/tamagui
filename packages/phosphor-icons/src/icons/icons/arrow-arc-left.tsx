import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowArcLeftBold } from '../bold/arrow-arc-left-bold'
import { ArrowArcLeftDuotone } from '../duotone/arrow-arc-left-duotone'
import { ArrowArcLeftFill } from '../fill/arrow-arc-left-fill'
import { ArrowArcLeftLight } from '../light/arrow-arc-left-light'
import { ArrowArcLeftRegular } from '../regular/arrow-arc-left-regular'
import { ArrowArcLeftThin } from '../thin/arrow-arc-left-thin'

const weightMap = {
  regular: ArrowArcLeftRegular,
  bold: ArrowArcLeftBold,
  duotone: ArrowArcLeftDuotone,
  fill: ArrowArcLeftFill,
  light: ArrowArcLeftLight,
  thin: ArrowArcLeftThin,
} as const

export const ArrowArcLeft = (props: IconProps) => {
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
