import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowUpBold } from '../bold/arrow-up-bold'
import { ArrowUpDuotone } from '../duotone/arrow-up-duotone'
import { ArrowUpFill } from '../fill/arrow-up-fill'
import { ArrowUpLight } from '../light/arrow-up-light'
import { ArrowUpRegular } from '../regular/arrow-up-regular'
import { ArrowUpThin } from '../thin/arrow-up-thin'

const weightMap = {
  regular: ArrowUpRegular,
  bold: ArrowUpBold,
  duotone: ArrowUpDuotone,
  fill: ArrowUpFill,
  light: ArrowUpLight,
  thin: ArrowUpThin,
} as const

export const ArrowUp = (props: IconProps) => {
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
