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
      <_Path d="M232,56a8,8,0,0,1-8,8H208V80a8,8,0,0,1-16,0V64H176a8,8,0,0,1,0-16h16V32a8,8,0,0,1,16,0V48h16A8,8,0,0,1,232,56Zm-24,55.2a8,8,0,0,0-8,8v22.9a35.3,35.3,0,0,0-20-6.1,36,36,0,1,0,36,36V119.2A8,8,0,0,0,208,111.2ZM162.4,99.5a7.9,7.9,0,0,0,4.4-5.2,8.3,8.3,0,0,0-2-7.7,9,9,0,0,0-2.6-1.7A32.3,32.3,0,0,1,144,56a37.1,37.1,0,0,1,.3-4.7,7.9,7.9,0,0,0-2-6.9,8.1,8.1,0,0,0-7.8-2.3L78.1,56.2A8,8,0,0,0,72,64V174.1A35.3,35.3,0,0,0,52,168a36,36,0,1,0,36,36V118.2L160.8,100Z" />
    </_Svg>
  )
}

Icon.displayName = 'MusicNotesPlusFill'

export const MusicNotesPlusFill = memo<IconProps>(themed(Icon))
