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

      <Path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" stroke={color} />
      <Rect width="18" height="18" x="3" y="4" rx="2" stroke={color} />
      <_Circle cx="12" cy="10" r="2" stroke={color} />
      <Line x1="8" x2="8" y1="2" y2="4" stroke={color} />
      <Line x1="16" x2="16" y1="2" y2="4" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Contact';

export const Contact = React.memo<IconProps>(themed(Icon));