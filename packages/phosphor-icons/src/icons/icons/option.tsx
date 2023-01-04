import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { OptionBold } from '../bold/option-bold'
import { OptionDuotone } from '../duotone/option-duotone'
import { OptionFill } from '../fill/option-fill'
import { OptionLight } from '../light/option-light'
import { OptionRegular } from '../regular/option-regular'
import { OptionThin } from '../thin/option-thin'

const weightMap = {
  regular: OptionRegular,
  bold: OptionBold,
  duotone: OptionDuotone,
  fill: OptionFill,
  light: OptionLight,
  thin: OptionThin,
} as const

export const Option = (props: IconProps) => {
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
