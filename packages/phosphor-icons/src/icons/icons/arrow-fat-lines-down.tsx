import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLinesDownBold } from '../bold/arrow-fat-lines-down-bold'
import { ArrowFatLinesDownDuotone } from '../duotone/arrow-fat-lines-down-duotone'
import { ArrowFatLinesDownFill } from '../fill/arrow-fat-lines-down-fill'
import { ArrowFatLinesDownLight } from '../light/arrow-fat-lines-down-light'
import { ArrowFatLinesDownRegular } from '../regular/arrow-fat-lines-down-regular'
import { ArrowFatLinesDownThin } from '../thin/arrow-fat-lines-down-thin'

const weightMap = {
  regular: ArrowFatLinesDownRegular,
  bold: ArrowFatLinesDownBold,
  duotone: ArrowFatLinesDownDuotone,
  fill: ArrowFatLinesDownFill,
  light: ArrowFatLinesDownLight,
  thin: ArrowFatLinesDownThin,
} as const

export const ArrowFatLinesDown = (props: IconProps) => {
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
