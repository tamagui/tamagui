/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { PanResponderConfig, PanResponderInstance } from './types';
/**
 * The same PanResponder react-native ships, over the responder system in
 * `@tamagui/react-native-use-responder-events`, so a drag can be written once
 * and behave the same on both platforms without the web build importing
 * react-native.
 *
 * `create` returns `panHandlers`, which go straight into `useResponderEvents`,
 * except `onClickCapture`: it is a plain React prop that swallows the click a
 * finished drag would otherwise fire.
 */
export declare const PanResponder: {
    create(config: PanResponderConfig): PanResponderInstance;
};
//# sourceMappingURL=PanResponder.d.ts.map