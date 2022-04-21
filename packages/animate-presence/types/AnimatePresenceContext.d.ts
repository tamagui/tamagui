/// <reference types="react" />
import { VariantLabels } from './types';
export interface AnimatePresenceContextProps {
    id: string;
    isEntering: boolean | undefined;
    register: (id: string) => () => void;
    onExitComplete?: (id: string) => void;
    initial?: false | VariantLabels;
    exitVariant?: string | null;
    enterVariant?: string | null;
}
export declare const AnimatePresenceContext: import("react").Context<AnimatePresenceContextProps | null>;
//# sourceMappingURL=AnimatePresenceContext.d.ts.map