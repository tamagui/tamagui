import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsLeftRightBold } from '../bold/arrows-left-right-bold'
import { ArrowsLeftRightDuotone } from '../duotone/arrows-left-right-duotone'
import { ArrowsLeftRightFill } from '../fill/arrows-left-right-fill'
import { ArrowsLeftRightLight } from '../light/arrows-left-right-light'
import { ArrowsLeftRightRegular } from '../regular/arrows-left-right-regular'
import { ArrowsLeftRightThin } from '../thin/arrows-left-right-thin'

const weightMap = {
  regular: ArrowsLeftRightRegular,
  bold: ArrowsLeftRightBold,
  duotone: ArrowsLeftRightDuotone,
  fill: ArrowsLeftRightFill,
  light: ArrowsLeftRightLight,
  thin: ArrowsLeftRightThin,
} as const

export const ArrowsLeftRight = (props: IconProps) => {
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
