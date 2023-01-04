import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CactusBold } from '../bold/cactus-bold'
import { CactusDuotone } from '../duotone/cactus-duotone'
import { CactusFill } from '../fill/cactus-fill'
import { CactusLight } from '../light/cactus-light'
import { CactusRegular } from '../regular/cactus-regular'
import { CactusThin } from '../thin/cactus-thin'

const weightMap = {
  regular: CactusRegular,
  bold: CactusBold,
  duotone: CactusDuotone,
  fill: CactusFill,
  light: CactusLight,
  thin: CactusThin,
} as const

export const Cactus = (props: IconProps) => {
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
