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
      <_Path d="M104,68a36,36,0,1,0-44,35.1v49.8a36,36,0,1,0,16,0V103.1A36.1,36.1,0,0,0,104,68ZM88,188a20,20,0,1,1-20-20A20.1,20.1,0,0,1,88,188Zm136,0a36,36,0,1,1-44-35.1v-33a40,40,0,0,0-11.7-28.3L144,67.3V88a8,8,0,0,1-16,0V48a8,8,0,0,1,8-8h40a8,8,0,0,1,0,16H155.3l24.3,24.3A55.5,55.5,0,0,1,196,119.9v33A36.1,36.1,0,0,1,224,188Z" />
    </_Svg>
  )
}

Icon.displayName = 'GitPullRequestFill'

export const GitPullRequestFill = memo<IconProps>(themed(Icon))
