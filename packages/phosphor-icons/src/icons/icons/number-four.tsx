import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberFourBold } from '../bold/number-four-bold'
import { NumberFourDuotone } from '../duotone/number-four-duotone'
import { NumberFourFill } from '../fill/number-four-fill'
import { NumberFourLight } from '../light/number-four-light'
import { NumberFourRegular } from '../regular/number-four-regular'
import { NumberFourThin } from '../thin/number-four-thin'

const weightMap = {
  regular: NumberFourRegular,
  bold: NumberFourBold,
  duotone: NumberFourDuotone,
  fill: NumberFourFill,
  light: NumberFourLight,
  thin: NumberFourThin,
} as const

export const NumberFour = (props: IconProps) => {
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
