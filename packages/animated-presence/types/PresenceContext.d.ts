/// <reference types="react" />
import { VariantLabels } from './types';
export interface PresenceContextProps {
    id: string;
    isPresent: boolean;
    register: (id: string) => () => void;
    onExitComplete?: (id: string) => void;
    initial?: false | VariantLabels;
    custom?: any;
}
export declare const PresenceContext: import("react").Context<PresenceContextProps | null>;
//# sourceMappingURL=PresenceContext.d.ts.map