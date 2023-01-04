import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CornersInBold } from '../bold/corners-in-bold'
import { CornersInDuotone } from '../duotone/corners-in-duotone'
import { CornersInFill } from '../fill/corners-in-fill'
import { CornersInLight } from '../light/corners-in-light'
import { CornersInRegular } from '../regular/corners-in-regular'
import { CornersInThin } from '../thin/corners-in-thin'

const weightMap = {
  regular: CornersInRegular,
  bold: CornersInBold,
  duotone: CornersInDuotone,
  fill: CornersInFill,
  light: CornersInLight,
  thin: CornersInThin,
} as const

export const CornersIn = (props: IconProps) => {
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
