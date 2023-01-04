import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowSquareOutBold } from '../bold/arrow-square-out-bold'
import { ArrowSquareOutDuotone } from '../duotone/arrow-square-out-duotone'
import { ArrowSquareOutFill } from '../fill/arrow-square-out-fill'
import { ArrowSquareOutLight } from '../light/arrow-square-out-light'
import { ArrowSquareOutRegular } from '../regular/arrow-square-out-regular'
import { ArrowSquareOutThin } from '../thin/arrow-square-out-thin'

const weightMap = {
  regular: ArrowSquareOutRegular,
  bold: ArrowSquareOutBold,
  duotone: ArrowSquareOutDuotone,
  fill: ArrowSquareOutFill,
  light: ArrowSquareOutLight,
  thin: ArrowSquareOutThin,
} as const

export const ArrowSquareOut = (props: IconProps) => {
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
