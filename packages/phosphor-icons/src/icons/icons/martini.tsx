import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MartiniBold } from '../bold/martini-bold'
import { MartiniDuotone } from '../duotone/martini-duotone'
import { MartiniFill } from '../fill/martini-fill'
import { MartiniLight } from '../light/martini-light'
import { MartiniRegular } from '../regular/martini-regular'
import { MartiniThin } from '../thin/martini-thin'

const weightMap = {
  regular: MartiniRegular,
  bold: MartiniBold,
  duotone: MartiniDuotone,
  fill: MartiniFill,
  light: MartiniLight,
  thin: MartiniThin,
} as const

export const Martini = (props: IconProps) => {
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
