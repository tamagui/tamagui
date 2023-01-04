import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowFatLinesRightBold } from '../bold/arrow-fat-lines-right-bold'
import { ArrowFatLinesRightDuotone } from '../duotone/arrow-fat-lines-right-duotone'
import { ArrowFatLinesRightFill } from '../fill/arrow-fat-lines-right-fill'
import { ArrowFatLinesRightLight } from '../light/arrow-fat-lines-right-light'
import { ArrowFatLinesRightRegular } from '../regular/arrow-fat-lines-right-regular'
import { ArrowFatLinesRightThin } from '../thin/arrow-fat-lines-right-thin'

const weightMap = {
  regular: ArrowFatLinesRightRegular,
  bold: ArrowFatLinesRightBold,
  duotone: ArrowFatLinesRightDuotone,
  fill: ArrowFatLinesRightFill,
  light: ArrowFatLinesRightLight,
  thin: ArrowFatLinesRightThin,
} as const

export const ArrowFatLinesRight = (props: IconProps) => {
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
