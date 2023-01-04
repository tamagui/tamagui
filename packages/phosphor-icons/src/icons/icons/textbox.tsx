import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextboxBold } from '../bold/textbox-bold'
import { TextboxDuotone } from '../duotone/textbox-duotone'
import { TextboxFill } from '../fill/textbox-fill'
import { TextboxLight } from '../light/textbox-light'
import { TextboxRegular } from '../regular/textbox-regular'
import { TextboxThin } from '../thin/textbox-thin'

const weightMap = {
  regular: TextboxRegular,
  bold: TextboxBold,
  duotone: TextboxDuotone,
  fill: TextboxFill,
  light: TextboxLight,
  thin: TextboxThin,
} as const

export const Textbox = (props: IconProps) => {
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
