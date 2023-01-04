import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaperPlaneRightBold } from '../bold/paper-plane-right-bold'
import { PaperPlaneRightDuotone } from '../duotone/paper-plane-right-duotone'
import { PaperPlaneRightFill } from '../fill/paper-plane-right-fill'
import { PaperPlaneRightLight } from '../light/paper-plane-right-light'
import { PaperPlaneRightRegular } from '../regular/paper-plane-right-regular'
import { PaperPlaneRightThin } from '../thin/paper-plane-right-thin'

const weightMap = {
  regular: PaperPlaneRightRegular,
  bold: PaperPlaneRightBold,
  duotone: PaperPlaneRightDuotone,
  fill: PaperPlaneRightFill,
  light: PaperPlaneRightLight,
  thin: PaperPlaneRightThin,
} as const

export const PaperPlaneRight = (props: IconProps) => {
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
