import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatUpBold } from '../bold/arrow-fat-up-bold'
import { ArrowFatUpDuotone } from '../duotone/arrow-fat-up-duotone'
import { ArrowFatUpFill } from '../fill/arrow-fat-up-fill'
import { ArrowFatUpLight } from '../light/arrow-fat-up-light'
import { ArrowFatUpRegular } from '../regular/arrow-fat-up-regular'
import { ArrowFatUpThin } from '../thin/arrow-fat-up-thin'

const weightMap = {
  regular: ArrowFatUpRegular,
  bold: ArrowFatUpBold,
  duotone: ArrowFatUpDuotone,
  fill: ArrowFatUpFill,
  light: ArrowFatUpLight,
  thin: ArrowFatUpThin,
} as const

export const ArrowFatUp = (props: IconProps) => {
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
