import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GlobeBold } from '../bold/globe-bold'
import { GlobeDuotone } from '../duotone/globe-duotone'
import { GlobeFill } from '../fill/globe-fill'
import { GlobeLight } from '../light/globe-light'
import { GlobeRegular } from '../regular/globe-regular'
import { GlobeThin } from '../thin/globe-thin'

const weightMap = {
  regular: GlobeRegular,
  bold: GlobeBold,
  duotone: GlobeDuotone,
  fill: GlobeFill,
  light: GlobeLight,
  thin: GlobeThin,
} as const

export const Globe = (props: IconProps) => {
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
