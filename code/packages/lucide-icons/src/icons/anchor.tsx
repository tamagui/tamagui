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

      <_Circle cx="12" cy="5" r="3" stroke={color} />
      <Line x1="12" x2="12" y1="22" y2="8" stroke={color} />
      <Path d="M5 12H2a10 10 0 0 0 20 0h-3" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Anchor';

export const Anchor = React.memo<IconProps>(themed(Icon));