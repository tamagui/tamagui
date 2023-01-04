import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CornersOutBold } from '../bold/corners-out-bold'
import { CornersOutDuotone } from '../duotone/corners-out-duotone'
import { CornersOutFill } from '../fill/corners-out-fill'
import { CornersOutLight } from '../light/corners-out-light'
import { CornersOutRegular } from '../regular/corners-out-regular'
import { CornersOutThin } from '../thin/corners-out-thin'

const weightMap = {
  regular: CornersOutRegular,
  bold: CornersOutBold,
  duotone: CornersOutDuotone,
  fill: CornersOutFill,
  light: CornersOutLight,
  thin: CornersOutThin,
} as const

export const CornersOut = (props: IconProps) => {
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
