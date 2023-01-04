import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StickerBold } from '../bold/sticker-bold'
import { StickerDuotone } from '../duotone/sticker-duotone'
import { StickerFill } from '../fill/sticker-fill'
import { StickerLight } from '../light/sticker-light'
import { StickerRegular } from '../regular/sticker-regular'
import { StickerThin } from '../thin/sticker-thin'

const weightMap = {
  regular: StickerRegular,
  bold: StickerBold,
  duotone: StickerDuotone,
  fill: StickerFill,
  light: StickerLight,
  thin: StickerThin,
} as const

export const Sticker = (props: IconProps) => {
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
