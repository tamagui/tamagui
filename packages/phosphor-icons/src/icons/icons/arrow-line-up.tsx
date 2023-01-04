import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineUpBold } from '../bold/arrow-line-up-bold'
import { ArrowLineUpDuotone } from '../duotone/arrow-line-up-duotone'
import { ArrowLineUpFill } from '../fill/arrow-line-up-fill'
import { ArrowLineUpLight } from '../light/arrow-line-up-light'
import { ArrowLineUpRegular } from '../regular/arrow-line-up-regular'
import { ArrowLineUpThin } from '../thin/arrow-line-up-thin'

const weightMap = {
  regular: ArrowLineUpRegular,
  bold: ArrowLineUpBold,
  duotone: ArrowLineUpDuotone,
  fill: ArrowLineUpFill,
  light: ArrowLineUpLight,
  thin: ArrowLineUpThin,
} as const

export const ArrowLineUp = (props: IconProps) => {
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
