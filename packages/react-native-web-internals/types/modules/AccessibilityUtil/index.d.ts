/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
declare const AccessibilityUtil: {
    isDisabled: (props: Record<string, any>) => boolean;
    propsToAccessibilityComponent: (props?: Object) => string | void;
    propsToAriaRole: ({ accessibilityRole }: {
        accessibilityRole?: string | undefined;
    }) => string | void;
};
export default AccessibilityUtil;
//# sourceMappingURL=index.d.ts.map