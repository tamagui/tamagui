/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

import { Platform } from 'react-native-web-internals'

import AnimatedImplementation from './AnimatedImplementation.js'
import AnimatedMock from './AnimatedMock.js'
import Image from './components/AnimatedImage'
import Text from './components/AnimatedText'
import View from './components/AnimatedView'

const Animated = Platform.isTesting ? AnimatedMock : AnimatedImplementation

export default {
  Image,
  Text,
  View,
  ...Animated,
}
