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
      <_Path d="M224,76.7,179.3,32a15.9,15.9,0,0,0-22.6,0L36.7,152a15.4,15.4,0,0,0-3.6,5.5l-.2.5a16,16,0,0,0-.9,5.3V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.3L224,99.3A16.1,16.1,0,0,0,224,76.7Zm-80-9.4L160.7,84,68,176.7,51.3,160ZM48,208V179.3L76.7,208Zm48-3.3L79.3,188,172,95.3,188.7,112Z" />
    </_Svg>
  )
}

Icon.displayName = 'PencilLineFill'

export const PencilLineFill = memo<IconProps>(themed(Icon))
