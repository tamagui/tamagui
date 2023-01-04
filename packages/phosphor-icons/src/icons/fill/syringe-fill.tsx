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
      <_Path d="M237.7,77.7a8.2,8.2,0,0,1-11.4,0L208,59.3,179.3,88l34.4,34.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-6.3-6.4-84,84a16.1,16.1,0,0,1-11.3,4.7H51.3L29.7,237.7a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L40,204.7V155.3A16.1,16.1,0,0,1,44.7,144l11.2-11.2a4,4,0,0,1,5.6,0l28.8,28.9a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L72.8,121.5a4,4,0,0,1,0-5.6L91.9,96.8a4,4,0,0,1,5.6,0l28.8,28.9a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L108.8,85.5a4,4,0,0,1,0-5.6L128.7,60l-6.1-6.1a8.3,8.3,0,0,1-.4-11.4,8.1,8.1,0,0,1,11.5-.2L168,76.7,196.7,48,178.6,29.9a8.3,8.3,0,0,1-.4-11.4,8.1,8.1,0,0,1,11.5-.2l48,48A8.1,8.1,0,0,1,237.7,77.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'SyringeFill'

export const SyringeFill = memo<IconProps>(themed(Icon))
