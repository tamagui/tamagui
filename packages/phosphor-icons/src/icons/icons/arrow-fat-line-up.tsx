import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLineUpBold } from '../bold/arrow-fat-line-up-bold'
import { ArrowFatLineUpDuotone } from '../duotone/arrow-fat-line-up-duotone'
import { ArrowFatLineUpFill } from '../fill/arrow-fat-line-up-fill'
import { ArrowFatLineUpLight } from '../light/arrow-fat-line-up-light'
import { ArrowFatLineUpRegular } from '../regular/arrow-fat-line-up-regular'
import { ArrowFatLineUpThin } from '../thin/arrow-fat-line-up-thin'

const weightMap = {
  regular: ArrowFatLineUpRegular,
  bold: ArrowFatLineUpBold,
  duotone: ArrowFatLineUpDuotone,
  fill: ArrowFatLineUpFill,
  light: ArrowFatLineUpLight,
  thin: ArrowFatLineUpThin,
} as const

export const ArrowFatLineUp = (props: IconProps) => {
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
