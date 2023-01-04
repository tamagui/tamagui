import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlaylistBold } from '../bold/playlist-bold'
import { PlaylistDuotone } from '../duotone/playlist-duotone'
import { PlaylistFill } from '../fill/playlist-fill'
import { PlaylistLight } from '../light/playlist-light'
import { PlaylistRegular } from '../regular/playlist-regular'
import { PlaylistThin } from '../thin/playlist-thin'

const weightMap = {
  regular: PlaylistRegular,
  bold: PlaylistBold,
  duotone: PlaylistDuotone,
  fill: PlaylistFill,
  light: PlaylistLight,
  thin: PlaylistThin,
} as const

export const Playlist = (props: IconProps) => {
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
