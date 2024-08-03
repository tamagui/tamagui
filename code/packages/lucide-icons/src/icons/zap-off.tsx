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

      <Polyline points="12.41 6.75 13 2 10.57 4.92" stroke={color} />
      <Polyline points="18.57 12.91 21 10 15.66 10" stroke={color} />
      <Polyline points="8 8 3 14 12 14 11 22 16 16" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ZapOff';

export const ZapOff = React.memo<IconProps>(themed(Icon));