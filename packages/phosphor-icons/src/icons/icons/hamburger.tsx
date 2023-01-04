import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HamburgerBold } from '../bold/hamburger-bold'
import { HamburgerDuotone } from '../duotone/hamburger-duotone'
import { HamburgerFill } from '../fill/hamburger-fill'
import { HamburgerLight } from '../light/hamburger-light'
import { HamburgerRegular } from '../regular/hamburger-regular'
import { HamburgerThin } from '../thin/hamburger-thin'

const weightMap = {
  regular: HamburgerRegular,
  bold: HamburgerBold,
  duotone: HamburgerDuotone,
  fill: HamburgerFill,
  light: HamburgerLight,
  thin: HamburgerThin,
} as const

export const Hamburger = (props: IconProps) => {
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
