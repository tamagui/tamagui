import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSixBold } from '../bold/number-six-bold'
import { NumberSixDuotone } from '../duotone/number-six-duotone'
import { NumberSixFill } from '../fill/number-six-fill'
import { NumberSixLight } from '../light/number-six-light'
import { NumberSixRegular } from '../regular/number-six-regular'
import { NumberSixThin } from '../thin/number-six-thin'

const weightMap = {
  regular: NumberSixRegular,
  bold: NumberSixBold,
  duotone: NumberSixDuotone,
  fill: NumberSixFill,
  light: NumberSixLight,
  thin: NumberSixThin,
} as const

export const NumberSix = (props: IconProps) => {
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
