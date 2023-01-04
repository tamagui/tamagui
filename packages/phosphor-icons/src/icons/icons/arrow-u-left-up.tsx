import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowULeftUpBold } from '../bold/arrow-u-left-up-bold'
import { ArrowULeftUpDuotone } from '../duotone/arrow-u-left-up-duotone'
import { ArrowULeftUpFill } from '../fill/arrow-u-left-up-fill'
import { ArrowULeftUpLight } from '../light/arrow-u-left-up-light'
import { ArrowULeftUpRegular } from '../regular/arrow-u-left-up-regular'
import { ArrowULeftUpThin } from '../thin/arrow-u-left-up-thin'

const weightMap = {
  regular: ArrowULeftUpRegular,
  bold: ArrowULeftUpBold,
  duotone: ArrowULeftUpDuotone,
  fill: ArrowULeftUpFill,
  light: ArrowULeftUpLight,
  thin: ArrowULeftUpThin,
} as const

export const ArrowULeftUp = (props: IconProps) => {
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
