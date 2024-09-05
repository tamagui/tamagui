/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
/**
 * Types
 */
export type HoverEventsConfig = {
    contain?: boolean | null;
    disabled?: boolean | null;
    onHoverStart?: ((e: any) => void) | null;
    onHoverChange?: ((bool: boolean) => void) | null;
    onHoverUpdate?: ((e: any) => void) | null;
    onHoverEnd?: ((e: any) => void) | null;
};
export default function useHover(targetRef: any, config: HoverEventsConfig): void;
//# sourceMappingURL=index.d.ts.map