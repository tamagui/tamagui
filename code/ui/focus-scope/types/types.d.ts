import type { Scope } from '@tamagui/create-context';
import type React from 'react';
export type ScopedProps<P> = P & {
    __scopeFocusScope?: Scope;
};
export interface FocusScopeProps {
    /**
     * @default true
     */
    enabled?: boolean;
    /**
     * When `true`, tabbing from last item will focus first tabbable
     * and shift+tab from first item will focus last tababble.
     * @default false
     */
    loop?: boolean;
    /**
     * When `true`, focus cannot escape the focus scope via keyboard,
     * pointer, or a programmatic focus.
     * @default false
     */
    trapped?: boolean;
    /**
     * Event handler called when auto-focusing on mount.
     * Can be prevented.
     */
    onMountAutoFocus?: (event: Event) => void;
    /**
     * Event handler called when auto-focusing on unmount.
     * Can be prevented.
     */
    onUnmountAutoFocus?: (event: Event) => void;
    /**
     * If unmount is animated, you want to force re-focus at start of animation not after
     */
    forceUnmount?: boolean;
    /**
     * When true, waits for idle before focusing. When a number, waits that many ms.
     * This prevents reflows during animations.
     * @default true
     */
    focusOnIdle?: boolean | number | {
        min?: number;
        max?: number;
    };
    children?: React.ReactNode | ((props: {
        onKeyDown: (event: React.KeyboardEvent) => void;
        tabIndex?: number;
        ref: React.ForwardedRef<any>;
    }) => React.ReactNode);
}
//# sourceMappingURL=types.d.ts.map