import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LightbulbBold } from '../bold/lightbulb-bold'
import { LightbulbDuotone } from '../duotone/lightbulb-duotone'
import { LightbulbFill } from '../fill/lightbulb-fill'
import { LightbulbLight } from '../light/lightbulb-light'
import { LightbulbRegular } from '../regular/lightbulb-regular'
import { LightbulbThin } from '../thin/lightbulb-thin'

const weightMap = {
  regular: LightbulbRegular,
  bold: LightbulbBold,
  duotone: LightbulbDuotone,
  fill: LightbulbFill,
  light: LightbulbLight,
  thin: LightbulbThin,
} as const

export const Lightbulb = (props: IconProps) => {
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
