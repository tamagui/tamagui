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
      <_Path d="M156,92V80H144a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h12V164a16,16,0,0,1,16-16h40a16,16,0,0,1,16,16v40a16,16,0,0,1-16,16H172a16,16,0,0,1-16-16V192H144a32.1,32.1,0,0,1-32-32V136H84v8a16,16,0,0,1-16,16H36a16,16,0,0,1-16-16V112A16,16,0,0,1,36,96H68a16,16,0,0,1,16,16v8h28V96a32.1,32.1,0,0,1,32-32h12V52a16,16,0,0,1,16-16h40a16,16,0,0,1,16,16V92a16,16,0,0,1-16,16H172A16,16,0,0,1,156,92Z" />
    </_Svg>
  )
}

Icon.displayName = 'TreeStructureFill'

export const TreeStructureFill = memo<IconProps>(themed(Icon))
