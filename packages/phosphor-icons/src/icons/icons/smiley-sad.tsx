import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileySadBold } from '../bold/smiley-sad-bold'
import { SmileySadDuotone } from '../duotone/smiley-sad-duotone'
import { SmileySadFill } from '../fill/smiley-sad-fill'
import { SmileySadLight } from '../light/smiley-sad-light'
import { SmileySadRegular } from '../regular/smiley-sad-regular'
import { SmileySadThin } from '../thin/smiley-sad-thin'

const weightMap = {
  regular: SmileySadRegular,
  bold: SmileySadBold,
  duotone: SmileySadDuotone,
  fill: SmileySadFill,
  light: SmileySadLight,
  thin: SmileySadThin,
} as const

export const SmileySad = (props: IconProps) => {
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
