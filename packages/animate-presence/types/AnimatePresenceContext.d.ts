/// <reference types="react" />
import { VariantLabels } from './types';
export interface AnimatePresenceContextProps {
    id: string;
    isPresent: boolean;
    register: (id: string) => () => void;
    onExitComplete?: (id: string) => void;
    initial?: false | VariantLabels;
    custom?: any;
}
export declare const AnimatePresenceContext: import("react").Context<AnimatePresenceContextProps | null>;
//# sourceMappingURL=AnimatePresenceContext.d.ts.map