import type { ChildGroupState } from '../types';
export type TamaguiComponentState = {
    unmounted: boolean | 'should-enter';
    disabled?: boolean;
    hover?: boolean;
    press?: boolean;
    pressIn?: boolean;
    focus?: boolean;
    focusVisible?: boolean;
    focusWithin?: boolean;
    animation?: null | {
        style?: any;
        avoidClasses?: boolean;
    };
    group?: Record<string, ChildGroupState>;
    hasDynGroupChildren?: boolean;
};
//# sourceMappingURL=TamaguiComponentState.d.ts.map