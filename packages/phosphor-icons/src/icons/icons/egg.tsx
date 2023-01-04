import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { EggBold } from '../bold/egg-bold'
import { EggDuotone } from '../duotone/egg-duotone'
import { EggFill } from '../fill/egg-fill'
import { EggLight } from '../light/egg-light'
import { EggRegular } from '../regular/egg-regular'
import { EggThin } from '../thin/egg-thin'

const weightMap = {
  regular: EggRegular,
  bold: EggBold,
  duotone: EggDuotone,
  fill: EggFill,
  light: EggLight,
  thin: EggThin,
} as const

export const Egg = (props: IconProps) => {
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
