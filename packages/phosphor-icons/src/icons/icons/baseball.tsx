import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BaseballBold } from '../bold/baseball-bold'
import { BaseballDuotone } from '../duotone/baseball-duotone'
import { BaseballFill } from '../fill/baseball-fill'
import { BaseballLight } from '../light/baseball-light'
import { BaseballRegular } from '../regular/baseball-regular'
import { BaseballThin } from '../thin/baseball-thin'

const weightMap = {
  regular: BaseballRegular,
  bold: BaseballBold,
  duotone: BaseballDuotone,
  fill: BaseballFill,
  light: BaseballLight,
  thin: BaseballThin,
} as const

export const Baseball = (props: IconProps) => {
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
