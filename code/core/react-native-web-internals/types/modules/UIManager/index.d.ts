/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
declare const UIManager: {
    blur(node: any): void;
    focus(node: any): void;
    measure(node: any, callback: any): void;
    measureInWindow(node: any, callback: any): void;
    measureLayout(node: any, relativeToNativeNode: any, onFail: any, onSuccess: any): void;
    updateView(node: any, props: any): void;
    configureNextLayoutAnimation(config: any, onAnimationDidEnd: any): void;
    setLayoutAnimationEnabledExperimental(): void;
};
export default UIManager;
//# sourceMappingURL=index.d.ts.map