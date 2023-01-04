import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilmSlateBold } from '../bold/film-slate-bold'
import { FilmSlateDuotone } from '../duotone/film-slate-duotone'
import { FilmSlateFill } from '../fill/film-slate-fill'
import { FilmSlateLight } from '../light/film-slate-light'
import { FilmSlateRegular } from '../regular/film-slate-regular'
import { FilmSlateThin } from '../thin/film-slate-thin'

const weightMap = {
  regular: FilmSlateRegular,
  bold: FilmSlateBold,
  duotone: FilmSlateDuotone,
  fill: FilmSlateFill,
  light: FilmSlateLight,
  thin: FilmSlateThin,
} as const

export const FilmSlate = (props: IconProps) => {
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
