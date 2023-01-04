import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RadioButtonBold } from '../bold/radio-button-bold'
import { RadioButtonDuotone } from '../duotone/radio-button-duotone'
import { RadioButtonFill } from '../fill/radio-button-fill'
import { RadioButtonLight } from '../light/radio-button-light'
import { RadioButtonRegular } from '../regular/radio-button-regular'
import { RadioButtonThin } from '../thin/radio-button-thin'

const weightMap = {
  regular: RadioButtonRegular,
  bold: RadioButtonBold,
  duotone: RadioButtonDuotone,
  fill: RadioButtonFill,
  light: RadioButtonLight,
  thin: RadioButtonThin,
} as const

export const RadioButton = (props: IconProps) => {
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
