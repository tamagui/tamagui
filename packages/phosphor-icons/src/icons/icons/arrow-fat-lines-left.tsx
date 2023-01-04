import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLinesLeftBold } from '../bold/arrow-fat-lines-left-bold'
import { ArrowFatLinesLeftDuotone } from '../duotone/arrow-fat-lines-left-duotone'
import { ArrowFatLinesLeftFill } from '../fill/arrow-fat-lines-left-fill'
import { ArrowFatLinesLeftLight } from '../light/arrow-fat-lines-left-light'
import { ArrowFatLinesLeftRegular } from '../regular/arrow-fat-lines-left-regular'
import { ArrowFatLinesLeftThin } from '../thin/arrow-fat-lines-left-thin'

const weightMap = {
  regular: ArrowFatLinesLeftRegular,
  bold: ArrowFatLinesLeftBold,
  duotone: ArrowFatLinesLeftDuotone,
  fill: ArrowFatLinesLeftFill,
  light: ArrowFatLinesLeftLight,
  thin: ArrowFatLinesLeftThin,
} as const

export const ArrowFatLinesLeft = (props: IconProps) => {
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
