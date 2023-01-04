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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm-8,32a8,8,0,0,1,16,0v60a8,8,0,0,1-16,0Zm8,152A80,80,0,0,1,83.5,61.5a8,8,0,0,1,8.9,13.3,64.1,64.1,0,1,0,71.1,0,8.1,8.1,0,0,1-2.2-11.1,8,8,0,0,1,11.1-2.2A80,80,0,0,1,128,208Z" />
    </_Svg>
  )
}

Icon.displayName = 'PowerFill'

export const PowerFill = memo<IconProps>(themed(Icon))
