import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GridFourBold } from '../bold/grid-four-bold'
import { GridFourDuotone } from '../duotone/grid-four-duotone'
import { GridFourFill } from '../fill/grid-four-fill'
import { GridFourLight } from '../light/grid-four-light'
import { GridFourRegular } from '../regular/grid-four-regular'
import { GridFourThin } from '../thin/grid-four-thin'

const weightMap = {
  regular: GridFourRegular,
  bold: GridFourBold,
  duotone: GridFourDuotone,
  fill: GridFourFill,
  light: GridFourLight,
  thin: GridFourThin,
} as const

export const GridFour = (props: IconProps) => {
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
