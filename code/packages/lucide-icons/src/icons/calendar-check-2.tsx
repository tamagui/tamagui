import * as React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}>

      <Path
        d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"
        stroke={color} />

      <Line x1="16" x2="16" y1="2" y2="6" stroke={color} />
      <Line x1="8" x2="8" y1="2" y2="6" stroke={color} />
      <Line x1="3" x2="21" y1="10" y2="10" stroke={color} />
      <Path d="m16 20 2 2 4-4" stroke={color} />
    </Svg>);

};

Icon.displayName = 'CalendarCheck2';

export const CalendarCheck2 = React.memo<IconProps>(themed(Icon));