import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NavigationArrowBold } from '../bold/navigation-arrow-bold'
import { NavigationArrowDuotone } from '../duotone/navigation-arrow-duotone'
import { NavigationArrowFill } from '../fill/navigation-arrow-fill'
import { NavigationArrowLight } from '../light/navigation-arrow-light'
import { NavigationArrowRegular } from '../regular/navigation-arrow-regular'
import { NavigationArrowThin } from '../thin/navigation-arrow-thin'

const weightMap = {
  regular: NavigationArrowRegular,
  bold: NavigationArrowBold,
  duotone: NavigationArrowDuotone,
  fill: NavigationArrowFill,
  light: NavigationArrowLight,
  thin: NavigationArrowThin,
} as const

export const NavigationArrow = (props: IconProps) => {
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
