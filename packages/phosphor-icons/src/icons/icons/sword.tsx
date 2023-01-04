import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SwordBold } from '../bold/sword-bold'
import { SwordDuotone } from '../duotone/sword-duotone'
import { SwordFill } from '../fill/sword-fill'
import { SwordLight } from '../light/sword-light'
import { SwordRegular } from '../regular/sword-regular'
import { SwordThin } from '../thin/sword-thin'

const weightMap = {
  regular: SwordRegular,
  bold: SwordBold,
  duotone: SwordDuotone,
  fill: SwordFill,
  light: SwordLight,
  thin: SwordThin,
} as const

export const Sword = (props: IconProps) => {
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
