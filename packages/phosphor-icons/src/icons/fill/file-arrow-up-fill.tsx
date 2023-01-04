import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M213.6,82.3l-55.9-56-.3-.2-.3-.3-.3-.2-.3-.2c-.1-.1-.2-.1-.2-.2l-.5-.3h-.2l-.5-.3H155l-.7-.3H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A7.8,7.8,0,0,0,213.6,82.3Zm-51.9,71.4a8.1,8.1,0,0,1-11.4,0L136,139.3V184a8,8,0,0,1-16,0V139.3l-14.3,14.4a8.1,8.1,0,0,1-11.4-11.4l28-28h.1l.5-.5.3-.2.4-.3.3-.2.3-.2h.4l.3-.2h.4l.4-.2h4.6l.4.2h.4l.3.2h.4l.3.2.3.2.4.3.3.2.5.5h.1l28,28A8.1,8.1,0,0,1,161.7,153.7ZM152,88V43.3L196.7,88Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileArrowUpFill'

export const FileArrowUpFill = memo<IconProps>(themed(Icon))
