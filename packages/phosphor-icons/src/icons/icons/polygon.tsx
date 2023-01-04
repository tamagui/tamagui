import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PolygonBold } from '../bold/polygon-bold'
import { PolygonDuotone } from '../duotone/polygon-duotone'
import { PolygonFill } from '../fill/polygon-fill'
import { PolygonLight } from '../light/polygon-light'
import { PolygonRegular } from '../regular/polygon-regular'
import { PolygonThin } from '../thin/polygon-thin'

const weightMap = {
  regular: PolygonRegular,
  bold: PolygonBold,
  duotone: PolygonDuotone,
  fill: PolygonFill,
  light: PolygonLight,
  thin: PolygonThin,
} as const

export const Polygon = (props: IconProps) => {
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
