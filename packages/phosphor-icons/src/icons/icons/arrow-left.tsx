import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLeftBold } from '../bold/arrow-left-bold'
import { ArrowLeftDuotone } from '../duotone/arrow-left-duotone'
import { ArrowLeftFill } from '../fill/arrow-left-fill'
import { ArrowLeftLight } from '../light/arrow-left-light'
import { ArrowLeftRegular } from '../regular/arrow-left-regular'
import { ArrowLeftThin } from '../thin/arrow-left-thin'

const weightMap = {
  regular: ArrowLeftRegular,
  bold: ArrowLeftBold,
  duotone: ArrowLeftDuotone,
  fill: ArrowLeftFill,
  light: ArrowLeftLight,
  thin: ArrowLeftThin,
} as const

export const ArrowLeft = (props: IconProps) => {
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
