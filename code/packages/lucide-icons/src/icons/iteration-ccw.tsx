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

      <Path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8" stroke={color} />
      <Polyline points="16 14 20 18 16 22" stroke={color} />
    </Svg>);

};

Icon.displayName = 'IterationCcw';

export const IterationCcw = React.memo<IconProps>(themed(Icon));