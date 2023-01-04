import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleSixBold } from '../bold/number-circle-six-bold'
import { NumberCircleSixDuotone } from '../duotone/number-circle-six-duotone'
import { NumberCircleSixFill } from '../fill/number-circle-six-fill'
import { NumberCircleSixLight } from '../light/number-circle-six-light'
import { NumberCircleSixRegular } from '../regular/number-circle-six-regular'
import { NumberCircleSixThin } from '../thin/number-circle-six-thin'

const weightMap = {
  regular: NumberCircleSixRegular,
  bold: NumberCircleSixBold,
  duotone: NumberCircleSixDuotone,
  fill: NumberCircleSixFill,
  light: NumberCircleSixLight,
  thin: NumberCircleSixThin,
} as const

export const NumberCircleSix = (props: IconProps) => {
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
