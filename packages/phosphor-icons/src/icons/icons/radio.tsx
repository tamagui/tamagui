import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RadioBold } from '../bold/radio-bold'
import { RadioDuotone } from '../duotone/radio-duotone'
import { RadioFill } from '../fill/radio-fill'
import { RadioLight } from '../light/radio-light'
import { RadioRegular } from '../regular/radio-regular'
import { RadioThin } from '../thin/radio-thin'

const weightMap = {
  regular: RadioRegular,
  bold: RadioBold,
  duotone: RadioDuotone,
  fill: RadioFill,
  light: RadioLight,
  thin: RadioThin,
} as const

export const Radio = (props: IconProps) => {
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
