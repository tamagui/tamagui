import type { Focusable } from './focusable';
export declare const registerFocusable: (id: string, input: Focusable) => () => void;
export declare const unregisterFocusable: (id: string) => void;
export declare const focusFocusable: (id: string, select?: boolean) => void;
//# sourceMappingURL=registerFocusable.native.d.ts.map