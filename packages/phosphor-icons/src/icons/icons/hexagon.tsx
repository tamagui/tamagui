import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HexagonBold } from '../bold/hexagon-bold'
import { HexagonDuotone } from '../duotone/hexagon-duotone'
import { HexagonFill } from '../fill/hexagon-fill'
import { HexagonLight } from '../light/hexagon-light'
import { HexagonRegular } from '../regular/hexagon-regular'
import { HexagonThin } from '../thin/hexagon-thin'

const weightMap = {
  regular: HexagonRegular,
  bold: HexagonBold,
  duotone: HexagonDuotone,
  fill: HexagonFill,
  light: HexagonLight,
  thin: HexagonThin,
} as const

export const Hexagon = (props: IconProps) => {
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
