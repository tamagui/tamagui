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
      <_Path d="M223.2,68.4l-16-32A8.2,8.2,0,0,0,200,32H56a8.2,8.2,0,0,0-7.2,4.4l-16,32A9,9,0,0,0,32,72V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V72A9,9,0,0,0,223.2,68.4Zm-55.6,87.3-33.9,34a8.2,8.2,0,0,1-11.4,0l-33.9-34a8,8,0,0,1,11.3-11.3L120,164.7V104a8,8,0,0,1,16,0v60.7l20.3-20.3a8,8,0,0,1,11.3,11.3ZM52.9,64l8-16H195.1l8,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArchiveBoxFill'

export const ArchiveBoxFill = memo<IconProps>(themed(Icon))
