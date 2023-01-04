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
      <_Path d="M120,168H88a8,8,0,0,0,0,16h8v32a8,8,0,0,0,16,0V184h8a8,8,0,0,0,0-16Z" />
      <_Path d="M64,168a8,8,0,0,0-8,8v12H44V176a8,8,0,0,0-16,0v40a8,8,0,0,0,16,0V204H56v12a8,8,0,0,0,16,0V176A8,8,0,0,0,64,168Z" />
      <_Path d="M236,208H220V176a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8h24a8,8,0,0,0,0-16Z" />
      <_Path d="M186.4,168.4a7.8,7.8,0,0,0-8.9,3L164,190.2l-13.5-18.8A8,8,0,0,0,136,176v40a8,8,0,0,0,16,0V201l5.5,7.6a7.9,7.9,0,0,0,13,0L176,201v15a8,8,0,0,0,16,0V176A7.8,7.8,0,0,0,186.4,168.4Z" />
      <_Path d="M48,136H208a8,8,0,0,0,8-8V88a8.1,8.1,0,0,0-2.3-5.7l-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40v88A8,8,0,0,0,48,136ZM152,44l44,44H152Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileHtmlFill'

export const FileHtmlFill = memo<IconProps>(themed(Icon))
