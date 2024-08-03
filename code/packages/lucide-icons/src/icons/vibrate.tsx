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

      <Path d="m2 8 2 2-2 2 2 2-2 2" stroke={color} />
      <Path d="m22 8-2 2 2 2-2 2 2 2" stroke={color} />
      <Rect width="8" height="14" x="8" y="5" rx="1" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Vibrate';

export const Vibrate = React.memo<IconProps>(themed(Icon));