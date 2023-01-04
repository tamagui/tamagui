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
      <_Path d="M232,188a36,36,0,1,1-44-35.1v-33a40,40,0,0,0-11.7-28.3L152,67.3V88a8,8,0,0,1-16,0V48a8,8,0,0,1,8-8h40a8,8,0,0,1,0,16H163.3l24.3,24.3A55.5,55.5,0,0,1,204,119.9v33A36.1,36.1,0,0,1,232,188ZM112,160a8,8,0,0,0-8,8v20.7L79.7,164.4A40,40,0,0,1,68,136.1v-33a36,36,0,1,0-16,0v33a55.5,55.5,0,0,0,16.4,39.6L92.7,200H72a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,112,160Z" />
    </_Svg>
  )
}

Icon.displayName = 'GitDiffFill'

export const GitDiffFill = memo<IconProps>(themed(Icon))
