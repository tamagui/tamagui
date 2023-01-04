import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowRightBold } from '../bold/arrow-right-bold'
import { ArrowRightDuotone } from '../duotone/arrow-right-duotone'
import { ArrowRightFill } from '../fill/arrow-right-fill'
import { ArrowRightLight } from '../light/arrow-right-light'
import { ArrowRightRegular } from '../regular/arrow-right-regular'
import { ArrowRightThin } from '../thin/arrow-right-thin'

const weightMap = {
  regular: ArrowRightRegular,
  bold: ArrowRightBold,
  duotone: ArrowRightDuotone,
  fill: ArrowRightFill,
  light: ArrowRightLight,
  thin: ArrowRightThin,
} as const

export const ArrowRight = (props: IconProps) => {
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
