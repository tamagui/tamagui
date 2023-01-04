import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignTopBold } from '../bold/align-top-bold'
import { AlignTopDuotone } from '../duotone/align-top-duotone'
import { AlignTopFill } from '../fill/align-top-fill'
import { AlignTopLight } from '../light/align-top-light'
import { AlignTopRegular } from '../regular/align-top-regular'
import { AlignTopThin } from '../thin/align-top-thin'

const weightMap = {
  regular: AlignTopRegular,
  bold: AlignTopBold,
  duotone: AlignTopDuotone,
  fill: AlignTopFill,
  light: AlignTopLight,
  thin: AlignTopThin,
} as const

export const AlignTop = (props: IconProps) => {
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
