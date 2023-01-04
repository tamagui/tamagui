import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToiletPaperBold } from '../bold/toilet-paper-bold'
import { ToiletPaperDuotone } from '../duotone/toilet-paper-duotone'
import { ToiletPaperFill } from '../fill/toilet-paper-fill'
import { ToiletPaperLight } from '../light/toilet-paper-light'
import { ToiletPaperRegular } from '../regular/toilet-paper-regular'
import { ToiletPaperThin } from '../thin/toilet-paper-thin'

const weightMap = {
  regular: ToiletPaperRegular,
  bold: ToiletPaperBold,
  duotone: ToiletPaperDuotone,
  fill: ToiletPaperFill,
  light: ToiletPaperLight,
  thin: ToiletPaperThin,
} as const

export const ToiletPaper = (props: IconProps) => {
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
