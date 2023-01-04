import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SunBold } from '../bold/sun-bold'
import { SunDuotone } from '../duotone/sun-duotone'
import { SunFill } from '../fill/sun-fill'
import { SunLight } from '../light/sun-light'
import { SunRegular } from '../regular/sun-regular'
import { SunThin } from '../thin/sun-thin'

const weightMap = {
  regular: SunRegular,
  bold: SunBold,
  duotone: SunDuotone,
  fill: SunFill,
  light: SunLight,
  thin: SunThin,
} as const

export const Sun = (props: IconProps) => {
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
