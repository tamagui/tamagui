import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLinesUpBold } from '../bold/arrow-fat-lines-up-bold'
import { ArrowFatLinesUpDuotone } from '../duotone/arrow-fat-lines-up-duotone'
import { ArrowFatLinesUpFill } from '../fill/arrow-fat-lines-up-fill'
import { ArrowFatLinesUpLight } from '../light/arrow-fat-lines-up-light'
import { ArrowFatLinesUpRegular } from '../regular/arrow-fat-lines-up-regular'
import { ArrowFatLinesUpThin } from '../thin/arrow-fat-lines-up-thin'

const weightMap = {
  regular: ArrowFatLinesUpRegular,
  bold: ArrowFatLinesUpBold,
  duotone: ArrowFatLinesUpDuotone,
  fill: ArrowFatLinesUpFill,
  light: ArrowFatLinesUpLight,
  thin: ArrowFatLinesUpThin,
} as const

export const ArrowFatLinesUp = (props: IconProps) => {
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
