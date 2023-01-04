import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LightbulbFilamentBold } from '../bold/lightbulb-filament-bold'
import { LightbulbFilamentDuotone } from '../duotone/lightbulb-filament-duotone'
import { LightbulbFilamentFill } from '../fill/lightbulb-filament-fill'
import { LightbulbFilamentLight } from '../light/lightbulb-filament-light'
import { LightbulbFilamentRegular } from '../regular/lightbulb-filament-regular'
import { LightbulbFilamentThin } from '../thin/lightbulb-filament-thin'

const weightMap = {
  regular: LightbulbFilamentRegular,
  bold: LightbulbFilamentBold,
  duotone: LightbulbFilamentDuotone,
  fill: LightbulbFilamentFill,
  light: LightbulbFilamentLight,
  thin: LightbulbFilamentThin,
} as const

export const LightbulbFilament = (props: IconProps) => {
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
