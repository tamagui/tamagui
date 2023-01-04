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
      <_Path d="M213.7,82.3l-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40v88a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48V216H176a8,8,0,0,0,0,16h24a16,16,0,0,0,16-16V88A8.1,8.1,0,0,0,213.7,82.3ZM160,51.3,188.7,80H160ZM160,180a52,52,0,0,1-52,52H60a36,36,0,0,1-9.2-70.8A65.3,65.3,0,0,0,48,180a8,8,0,0,0,16,0,47.4,47.4,0,0,1,4.4-20h0A48,48,0,0,1,160,180Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileCloudFill'

export const FileCloudFill = memo<IconProps>(themed(Icon))
