/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */
export declare const UIManager: {
    blur(node: any): void;
    focus(node: any): void;
    measure(node: any, callback: any): Promise<import("@tamagui/use-element-layout").LayoutValue | null>;
    measureInWindow(node: any, callback: any): Promise<{
        pageX: number;
        pageY: number;
        width: number;
        height: number;
    } | null>;
    measureLayout(node: HTMLElement, relativeToNativeNode?: HTMLElement, onFail: any, onSuccess: any): Promise<any>;
    configureNextLayoutAnimation(config: any, onAnimationDidEnd: any): void;
    setLayoutAnimationEnabledExperimental(): void;
};
//# sourceMappingURL=index.d.ts.map