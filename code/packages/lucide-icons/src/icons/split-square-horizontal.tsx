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

      <Path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" stroke={color} />
      <Path d="M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" stroke={color} />
      <Line x1="12" x2="12" y1="4" y2="20" stroke={color} />
    </Svg>);

};

Icon.displayName = 'SplitSquareHorizontal';

export const SplitSquareHorizontal = React.memo<IconProps>(themed(Icon));