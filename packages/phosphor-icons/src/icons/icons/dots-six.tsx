import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsSixBold } from '../bold/dots-six-bold'
import { DotsSixDuotone } from '../duotone/dots-six-duotone'
import { DotsSixFill } from '../fill/dots-six-fill'
import { DotsSixLight } from '../light/dots-six-light'
import { DotsSixRegular } from '../regular/dots-six-regular'
import { DotsSixThin } from '../thin/dots-six-thin'

const weightMap = {
  regular: DotsSixRegular,
  bold: DotsSixBold,
  duotone: DotsSixDuotone,
  fill: DotsSixFill,
  light: DotsSixLight,
  thin: DotsSixThin,
} as const

export const DotsSix = (props: IconProps) => {
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
