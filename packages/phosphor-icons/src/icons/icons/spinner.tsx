import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpinnerBold } from '../bold/spinner-bold'
import { SpinnerDuotone } from '../duotone/spinner-duotone'
import { SpinnerFill } from '../fill/spinner-fill'
import { SpinnerLight } from '../light/spinner-light'
import { SpinnerRegular } from '../regular/spinner-regular'
import { SpinnerThin } from '../thin/spinner-thin'

const weightMap = {
  regular: SpinnerRegular,
  bold: SpinnerBold,
  duotone: SpinnerDuotone,
  fill: SpinnerFill,
  light: SpinnerLight,
  thin: SpinnerThin,
} as const

export const Spinner = (props: IconProps) => {
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
