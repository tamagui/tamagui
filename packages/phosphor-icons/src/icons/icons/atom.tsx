import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AtomBold } from '../bold/atom-bold'
import { AtomDuotone } from '../duotone/atom-duotone'
import { AtomFill } from '../fill/atom-fill'
import { AtomLight } from '../light/atom-light'
import { AtomRegular } from '../regular/atom-regular'
import { AtomThin } from '../thin/atom-thin'

const weightMap = {
  regular: AtomRegular,
  bold: AtomBold,
  duotone: AtomDuotone,
  fill: AtomFill,
  light: AtomLight,
  thin: AtomThin,
} as const

export const Atom = (props: IconProps) => {
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
