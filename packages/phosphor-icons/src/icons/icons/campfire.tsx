import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CampfireBold } from '../bold/campfire-bold'
import { CampfireDuotone } from '../duotone/campfire-duotone'
import { CampfireFill } from '../fill/campfire-fill'
import { CampfireLight } from '../light/campfire-light'
import { CampfireRegular } from '../regular/campfire-regular'
import { CampfireThin } from '../thin/campfire-thin'

const weightMap = {
  regular: CampfireRegular,
  bold: CampfireBold,
  duotone: CampfireDuotone,
  fill: CampfireFill,
  light: CampfireLight,
  thin: CampfireThin,
} as const

export const Campfire = (props: IconProps) => {
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
