import React from 'react';
import { type NativeStyleThemeMapping } from './helpers/nativeStyleEngine';
/**
 * internal: emitted by the native compiler when experimental.nativeFastPath is on.
 *
 * One component over the host: the theme scope is the only context read, the
 * host ref links straight to the engine and unlinks through React's ref
 * cleanup, so a themed view costs one component and one engine call to mount.
 *
 * `host: 'view'`: `Component` is RN's host view (`unstable_NativeView`).
 * <View> resets TextAncestorContext for its children when it sits inside a
 * <Text>; this wrapper does that reset itself, so the host view can carry
 * children without changing what a nested <Text> renders.
 *
 * `host: 'text'`: `Component` is RN's <Text>, and outside a text ancestor this
 * renders its host (`unstable_NativeText`) with the exact props <Text> would
 * pass: the defaults above, `overflow: 'hidden'` first in the style, a string
 * fontWeight, and TextAncestorContext only around element children. Inside a
 * text ancestor it renders <Text>, which owns the virtual text path.
 */
export declare const _withNativeStyle: (Component: any, baseStyle: Record<string, unknown>, themeStyleKeys: NativeStyleThemeMapping, host?: 'view' | 'text') => (props: any) => React.JSX.Element;
//# sourceMappingURL=_withNativeStyle.d.ts.map