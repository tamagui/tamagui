import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MegaphoneBold } from '../bold/megaphone-bold'
import { MegaphoneDuotone } from '../duotone/megaphone-duotone'
import { MegaphoneFill } from '../fill/megaphone-fill'
import { MegaphoneLight } from '../light/megaphone-light'
import { MegaphoneRegular } from '../regular/megaphone-regular'
import { MegaphoneThin } from '../thin/megaphone-thin'

const weightMap = {
  regular: MegaphoneRegular,
  bold: MegaphoneBold,
  duotone: MegaphoneDuotone,
  fill: MegaphoneFill,
  light: MegaphoneLight,
  thin: MegaphoneThin,
} as const

export const Megaphone = (props: IconProps) => {
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
