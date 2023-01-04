import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleFourBold } from '../bold/number-circle-four-bold'
import { NumberCircleFourDuotone } from '../duotone/number-circle-four-duotone'
import { NumberCircleFourFill } from '../fill/number-circle-four-fill'
import { NumberCircleFourLight } from '../light/number-circle-four-light'
import { NumberCircleFourRegular } from '../regular/number-circle-four-regular'
import { NumberCircleFourThin } from '../thin/number-circle-four-thin'

const weightMap = {
  regular: NumberCircleFourRegular,
  bold: NumberCircleFourBold,
  duotone: NumberCircleFourDuotone,
  fill: NumberCircleFourFill,
  light: NumberCircleFourLight,
  thin: NumberCircleFourThin,
} as const

export const NumberCircleFour = (props: IconProps) => {
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
