import type { Delay, UseFloatingOptions } from '@tamagui/floating';
export type UseFloatingContextOptions = {
    open: boolean;
    setOpen: (val: boolean, type?: string) => void;
    disable?: boolean;
    disableFocus?: boolean;
    hoverable?: boolean | Record<string, any>;
    role?: 'dialog' | 'tooltip';
    focus?: Record<string, any>;
    groupId?: string;
    delay?: Delay;
    restMs?: number;
};
export declare const useFloatingContext: ({ open, setOpen, disable, disableFocus, hoverable, role: roleProp, focus: focusProp, groupId, delay: delayProp, restMs: restMsProp, }: UseFloatingContextOptions) => (props?: UseFloatingOptions) => any;
//# sourceMappingURL=useFloatingContext.d.ts.map