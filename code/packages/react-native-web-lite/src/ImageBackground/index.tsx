/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react'
import { forwardRef } from 'react'
import { StyleSheet } from '@tamagui/react-native-web-internals'

import type { ImageProps } from '../Image/index'
import Image from '../Image/index'
import type { ViewProps } from '../View/index'
import View from '../View/index'

type ImageBackgroundProps = ImageProps & {
  imageRef?: any
  imageStyle?: ImageProps['style']
  style?: ViewProps['style']
}

const emptyObject = {}

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */
const ImageBackground = forwardRef<React.ElementRef<typeof View>, ImageBackgroundProps>(
  (props, forwardedRef) => {
    const { children, style = emptyObject, imageStyle, imageRef, ...rest } = props
    const { height, width } = StyleSheet.flatten(style)

    return (
      <View ref={forwardedRef} style={style}>
        <Image
          {...rest}
          ref={imageRef}
          style={[
            {
              // Temporary Workaround:
              // Current (imperfect yet) implementation of <Image> overwrites width and height styles
              // (which is not quite correct), and these styles conflict with explicitly set styles
              // of <ImageBackground> and with our internal layout model here.
              // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
              // This workaround should be removed after implementing proper support of
              // intrinsic content size of the <Image>.
              width,
              height,
              zIndex: -1,
            },
            StyleSheet.absoluteFill,
            imageStyle,
          ]}
        />
        {children}
      </View>
    )
  }
)

ImageBackground.displayName = 'ImageBackground'

export default ImageBackground
