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
      <_Path d="M224,136h3.3a4,4,0,0,1,3.9,4.5,104.2,104.2,0,0,1-94.8,91.1A88,88,0,0,1,224,136Zm-73.5,14.5A102.9,102.9,0,0,1,224,120h3.1a4,4,0,0,0,4.1-4.4,104.1,104.1,0,0,0-90.9-90.9,4,4,0,0,0-4.4,4.1,103.7,103.7,0,0,1-30.4,76.7A102.9,102.9,0,0,1,32,136H28.9a4,4,0,0,0-4.1,4.4,104.1,104.1,0,0,0,90.9,90.9,4,4,0,0,0,4.4-4.1A103.7,103.7,0,0,1,150.5,150.5ZM94.2,94.2a87.6,87.6,0,0,0,25.7-65.7,4,4,0,0,0-4.5-3.7,104,104,0,0,0-90.6,90.6,4,4,0,0,0,3.8,4.5A87.8,87.8,0,0,0,94.2,94.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'TennisBallFill'

export const TennisBallFill = memo<IconProps>(themed(Icon))
