import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SmileyStickerBold } from '../bold/smiley-sticker-bold'
import { SmileyStickerDuotone } from '../duotone/smiley-sticker-duotone'
import { SmileyStickerFill } from '../fill/smiley-sticker-fill'
import { SmileyStickerLight } from '../light/smiley-sticker-light'
import { SmileyStickerRegular } from '../regular/smiley-sticker-regular'
import { SmileyStickerThin } from '../thin/smiley-sticker-thin'

const weightMap = {
  regular: SmileyStickerRegular,
  bold: SmileyStickerBold,
  duotone: SmileyStickerDuotone,
  fill: SmileyStickerFill,
  light: SmileyStickerLight,
  thin: SmileyStickerThin,
} as const

export const SmileySticker = (props: IconProps) => {
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
