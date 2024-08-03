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

      <Rect width="8" height="4" x="8" y="2" rx="1" stroke={color} />
      <Path
        d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5"
        stroke={color} />

      <Path d="M16 4h2a2 2 0 0 1 1.73 1" stroke={color} />
      <Path d="M8 18h1" stroke={color} />
      <Path d="M18.4 9.6a2 2 0 0 1 3 3L17 17l-4 1 1-4Z" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ClipboardPenLine';

export const ClipboardPenLine = React.memo<IconProps>(themed(Icon));