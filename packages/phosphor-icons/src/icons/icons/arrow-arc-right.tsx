import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowArcRightBold } from '../bold/arrow-arc-right-bold'
import { ArrowArcRightDuotone } from '../duotone/arrow-arc-right-duotone'
import { ArrowArcRightFill } from '../fill/arrow-arc-right-fill'
import { ArrowArcRightLight } from '../light/arrow-arc-right-light'
import { ArrowArcRightRegular } from '../regular/arrow-arc-right-regular'
import { ArrowArcRightThin } from '../thin/arrow-arc-right-thin'

const weightMap = {
  regular: ArrowArcRightRegular,
  bold: ArrowArcRightBold,
  duotone: ArrowArcRightDuotone,
  fill: ArrowArcRightFill,
  light: ArrowArcRightLight,
  thin: ArrowArcRightThin,
} as const

export const ArrowArcRight = (props: IconProps) => {
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
